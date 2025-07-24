import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReferrerSources = ({ referrerData }) => {
  const [viewMode, setViewMode] = useState('sources');

  const getReferrerIcon = (source) => {
    const iconMap = {
      'google.com': 'Search',
      'facebook.com': 'Facebook',
      'twitter.com': 'Twitter',
      'linkedin.com': 'Linkedin',
      'instagram.com': 'Instagram',
      'youtube.com': 'Youtube',
      'reddit.com': 'MessageCircle',
      'direct': 'Link',
      'email': 'Mail',
      'sms': 'MessageSquare',
      'other': 'Globe'
    };
    return iconMap[source] || 'ExternalLink';
  };

  const getReferrerColor = (source) => {
    const colorMap = {
      'google.com': 'text-blue-600',
      'facebook.com': 'text-blue-700',
      'twitter.com': 'text-sky-500',
      'linkedin.com': 'text-blue-800',
      'instagram.com': 'text-pink-600',
      'youtube.com': 'text-red-600',
      'reddit.com': 'text-orange-600',
      'direct': 'text-success',
      'email': 'text-purple-600',
      'sms': 'text-green-600',
      'other': 'text-muted-foreground'
    };
    return colorMap[source] || 'text-muted-foreground';
  };

  const formatSourceName = (source) => {
    if (source === 'direct') return 'Direct Traffic';
    if (source === 'email') return 'Email';
    if (source === 'sms') return 'SMS';
    if (source === 'other') return 'Other Sources';
    return source.replace('.com', '').replace(/^\w/, c => c.toUpperCase());
  };

  const topSources = referrerData.sources.slice(0, 8);
  const topPages = referrerData.pages.slice(0, 8);

  const maxClicks = Math.max(
    ...referrerData.sources.map(item => item.clicks),
    ...referrerData.pages.map(item => item.clicks)
  );

  const getBarWidth = (clicks) => {
    return Math.max((clicks / maxClicks) * 100, 2);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Traffic Sources</h3>
          <p className="text-sm text-muted-foreground">
            Understand where your traffic is coming from
          </p>
        </div>

        <div className="flex items-center bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === 'sources' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setViewMode('sources')}
            iconName="Globe"
            iconSize={14}
          >
            Sources
          </Button>
          <Button
            variant={viewMode === 'pages' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setViewMode('pages')}
            iconName="FileText"
            iconSize={14}
          >
            Pages
          </Button>
        </div>
      </div>

      {/* Referrer Data List */}
      <div className="space-y-3">
        {(viewMode === 'sources' ? topSources : topPages).map((item, index) => (
          <div key={item.source || item.page} className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-muted ${
              viewMode === 'sources' ? getReferrerColor(item.source) : 'text-primary'
            }`}>
              <Icon 
                name={viewMode === 'sources' ? getReferrerIcon(item.source) : 'FileText'} 
                size={16} 
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {viewMode === 'sources' ? formatSourceName(item.source) : item.page}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {item.clicks} clicks
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({item.percentage}%)
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-progressive"
                  style={{ width: `${getBarWidth(item.clicks)}%` }}
                ></div>
              </div>
              
              {viewMode === 'sources' && item.source !== 'direct' && (
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {item.source}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Traffic Source Categories */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Traffic Categories</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { category: 'Social Media', percentage: 35, color: 'bg-blue-500' },
            { category: 'Search Engines', percentage: 28, color: 'bg-green-500' },
            { category: 'Direct Traffic', percentage: 22, color: 'bg-purple-500' },
            { category: 'Email & SMS', percentage: 15, color: 'bg-orange-500' }
          ].map((category) => (
            <div key={category.category} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                <span className="text-xs text-muted-foreground">{category.percentage}%</span>
              </div>
              <p className="text-xs font-medium text-foreground">{category.category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Top Source</p>
            <div className="flex items-center justify-center space-x-1">
              <Icon 
                name={getReferrerIcon(referrerData.sources[0]?.source)} 
                size={16} 
                className={getReferrerColor(referrerData.sources[0]?.source)}
              />
              <p className="text-sm font-medium text-foreground">
                {formatSourceName(referrerData.sources[0]?.source || 'N/A')}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Sources</p>
            <p className="text-sm font-medium text-foreground">
              {referrerData.sources.length}
            </p>
          </div>
          <div className="col-span-2 lg:col-span-1">
            <p className="text-sm text-muted-foreground mb-1">Direct Traffic</p>
            <p className="text-sm font-medium text-foreground">
              {referrerData.sources.find(s => s.source === 'direct')?.percentage || 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferrerSources;