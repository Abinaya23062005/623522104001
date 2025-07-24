import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import URLCard from './URLCard';

const URLList = ({ urls, onDeleteUrl, onViewAnalytics }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const statusOptions = [
    { value: 'all', label: 'All URLs' },
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'most_clicks', label: 'Most Clicks' },
    { value: 'expiring_soon', label: 'Expiring Soon' }
  ];

  const filteredAndSortedUrls = useMemo(() => {
    let filtered = urls.filter(url => {
      const matchesSearch = url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           url.shortCode.toLowerCase().includes(searchTerm.toLowerCase());
      
      const now = new Date();
      const isExpired = new Date(url.expiresAt) <= now;
      
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'active' && !isExpired) ||
                           (filterStatus === 'expired' && isExpired);
      
      return matchesSearch && matchesStatus;
    });

    // Sort URLs
    filtered.sort((a, b) => {
      const now = new Date();
      const aExpired = new Date(a.expiresAt) <= now;
      const bExpired = new Date(b.expiresAt) <= now;

      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'most_clicks':
          return (b.clicks || 0) - (a.clicks || 0);
        case 'expiring_soon':
          if (aExpired && bExpired) return 0;
          if (aExpired) return 1;
          if (bExpired) return -1;
          return new Date(a.expiresAt) - new Date(b.expiresAt);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [urls, searchTerm, filterStatus, sortBy]);

  const getStatsData = () => {
    const now = new Date();
    const active = urls.filter(url => new Date(url.expiresAt) > now).length;
    const expired = urls.filter(url => new Date(url.expiresAt) <= now).length;
    const totalClicks = urls.reduce((sum, url) => sum + (url.clicks || 0), 0);

    return { total: urls.length, active, expired, totalClicks };
  };

  const stats = getStatsData();

  if (urls.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full mx-auto mb-4">
          <Icon name="Link" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No URLs Created Yet</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Start by creating your first short URL using the form above. Your URLs will appear here for easy management.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total URLs</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <p className="text-2xl font-bold text-success">{stats.active}</p>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <p className="text-2xl font-bold text-error">{stats.expired}</p>
          <p className="text-sm text-muted-foreground">Expired</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <p className="text-2xl font-bold text-primary">{stats.totalClicks}</p>
          <p className="text-sm text-muted-foreground">Total Clicks</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Input
            type="search"
            placeholder="Search URLs or short codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="lg:col-span-1"
          />
          
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="Filter by status"
          />
          
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAndSortedUrls.length} of {urls.length} URLs
        </p>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-sm text-primary hover:text-primary/80 transition-smooth"
          >
            Clear search
          </button>
        )}
      </div>

      {/* URL Grid */}
      {filteredAndSortedUrls.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="Search" size={32} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No URLs Found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedUrls.map((url) => (
            <URLCard
              key={url.id}
              url={url}
              onDelete={onDeleteUrl}
              onAnalytics={onViewAnalytics}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default URLList;