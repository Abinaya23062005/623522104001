import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivity = ({ urls }) => {
  const getRecentActivity = () => {
    const activities = [];
    
    // Add creation activities
    urls.forEach(url => {
      activities.push({
        id: `created-${url.id}`,
        type: 'created',
        url: url,
        timestamp: new Date(url.createdAt),
        message: `Created short URL /${url.shortCode}`
      });
    });

    // Add click activities (mock data)
    urls.forEach(url => {
      if (url.clicks > 0) {
        // Generate mock click activities
        for (let i = 0; i < Math.min(url.clicks, 3); i++) {
          activities.push({
            id: `clicked-${url.id}-${i}`,
            type: 'clicked',
            url: url,
            timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
            message: `/${url.shortCode} was clicked`
          });
        }
      }
    });

    // Add expiration activities
    const now = new Date();
    urls.forEach(url => {
      if (new Date(url.expiresAt) <= now) {
        activities.push({
          id: `expired-${url.id}`,
          type: 'expired',
          url: url,
          timestamp: new Date(url.expiresAt),
          message: `/${url.shortCode} expired`
        });
      }
    });

    // Sort by timestamp (newest first) and limit to 10
    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
  };

  const activities = getRecentActivity();

  const getActivityIcon = (type) => {
    switch (type) {
      case 'created':
        return { name: 'Plus', color: 'text-success' };
      case 'clicked':
        return { name: 'MousePointer', color: 'text-primary' };
      case 'expired':
        return { name: 'Clock', color: 'text-warning' };
      default:
        return { name: 'Activity', color: 'text-muted-foreground' };
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  if (activities.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <Icon name="Activity" size={32} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No recent activity to show</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Icon name="Activity" size={20} className="text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const icon = getActivityIcon(activity.type);
          
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-muted ${icon.color}`}>
                <Icon name={icon.name} size={14} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  {activity.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {activities.length >= 10 && (
        <div className="mt-4 pt-4 border-t border-border text-center">
          <button className="text-sm text-primary hover:text-primary/80 transition-smooth">
            View all activity
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;