import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const URLContextPanel = ({ selectedUrl, onUrlSelect, urls = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const isAnalyticsView = location.pathname.includes('/url-analytics-view');

  useEffect(() => {
    if (isAnalyticsView && !isExpanded) {
      setIsExpanded(true);
    }
  }, [isAnalyticsView]);

  const filteredUrls = urls.filter(url =>
    url.originalUrl?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.shortCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUrlSelect = (url) => {
    onUrlSelect?.(url);
    if (isAnalyticsView) {
      navigate(`/url-analytics-view?id=${url.id}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'expired':
        return 'text-error';
      case 'paused':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'CheckCircle';
      case 'expired':
        return 'XCircle';
      case 'paused':
        return 'Pause';
      default:
        return 'Clock';
    }
  };

  if (!isAnalyticsView && !isExpanded) {
    return (
      <div className="hidden lg:block fixed right-4 top-1/2 transform -translate-y-1/2 z-100">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(true)}
          iconName="ChevronLeft"
          iconPosition="left"
          className="bg-card shadow-medium"
        >
          URLs
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed right-0 top-16 bottom-0 w-88 bg-card border-l border-border z-100 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">URL Context</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(false)}
              iconName="X"
              iconSize={16}
            >
              <span className="sr-only">Close panel</span>
            </Button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Icon
                name="Search"
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search URLs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              />
            </div>
          </div>

          {/* URL List */}
          <div className="flex-1 overflow-y-auto">
            {filteredUrls.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center p-4">
                <Icon name="Link" size={32} className="text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? 'No URLs match your search' : 'No URLs available'}
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredUrls.map((url) => (
                  <div
                    key={url.id}
                    onClick={() => handleUrlSelect(url)}
                    className={`p-3 rounded-lg cursor-pointer transition-smooth hover:bg-muted ${
                      selectedUrl?.id === url.id ? 'bg-primary/10 border border-primary/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon
                          name={getStatusIcon(url.status)}
                          size={14}
                          className={getStatusColor(url.status)}
                        />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {url.status}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {url.clicks || 0} clicks
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-mono text-primary truncate">
                        /{url.shortCode}
                      </p>
                      <p className="text-xs text-muted-foreground truncate" title={url.originalUrl}>
                        {url.originalUrl}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created {formatDate(url.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 bg-card border-t border-border z-200 max-h-96 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Handle */}
          <div className="flex justify-center py-2">
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3">
            <h3 className="text-lg font-semibold text-foreground">URLs</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              iconName="ChevronDown"
              iconSize={16}
            >
              Close
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="space-y-2">
              {filteredUrls.map((url) => (
                <div
                  key={url.id}
                  onClick={() => handleUrlSelect(url)}
                  className={`p-3 rounded-lg cursor-pointer transition-smooth ${
                    selectedUrl?.id === url.id ? 'bg-primary/10' : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-mono text-primary">/{url.shortCode}</span>
                    <span className="text-xs text-muted-foreground">{url.clicks || 0} clicks</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {url.originalUrl}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default URLContextPanel;