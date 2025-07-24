import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsOverview = ({ selectedUrl, metrics }) => {
  const metricCards = [
    {
      id: 'total-clicks',
      title: 'Total Clicks',
      value: metrics.totalClicks,
      change: metrics.clicksChange,
      icon: 'MousePointer',
      color: 'text-primary'
    },
    {
      id: 'unique-visitors',
      title: 'Unique Visitors',
      value: metrics.uniqueVisitors,
      change: metrics.visitorsChange,
      icon: 'Users',
      color: 'text-success'
    },
    {
      id: 'click-rate',
      title: 'Click Rate',
      value: `${metrics.clickRate}%`,
      change: metrics.rateChange,
      icon: 'TrendingUp',
      color: 'text-warning'
    },
    {
      id: 'avg-daily',
      title: 'Avg Daily Clicks',
      value: metrics.avgDaily,
      change: metrics.dailyChange,
      icon: 'Calendar',
      color: 'text-accent'
    }
  ];

  const formatChange = (change) => {
    if (change === 0) return { text: 'No change', color: 'text-muted-foreground' };
    const sign = change > 0 ? '+' : '';
    const color = change > 0 ? 'text-success' : 'text-error';
    return { text: `${sign}${change}%`, color };
  };

  return (
    <div className="bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Performance Overview</h2>
          <p className="text-sm text-muted-foreground">
            Analytics for the last 30 days compared to previous period
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {metricCards.map((metric) => {
            const changeData = formatChange(metric.change);
            
            return (
              <div
                key={metric.id}
                className="bg-card border border-border rounded-lg p-4 lg:p-6 hover:shadow-medium transition-progressive"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-muted ${metric.color}`}>
                    <Icon name={metric.icon} size={20} />
                  </div>
                  <div className={`text-xs font-medium ${changeData.color}`}>
                    {changeData.text}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">
                    {metric.value.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {metric.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        {selectedUrl && (
          <div className="mt-6 p-4 bg-card border border-border rounded-lg">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Created</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(selectedUrl.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <div className="flex items-center justify-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    selectedUrl.status === 'active' ? 'bg-success' : 
                    selectedUrl.status === 'expired' ? 'bg-error' : 'bg-warning'
                  }`}></div>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {selectedUrl.status}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Expires</p>
                <p className="text-sm font-medium text-foreground">
                  {selectedUrl.expiresAt ? 
                    new Date(selectedUrl.expiresAt).toLocaleDateString() : 
                    'Never'
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Click</p>
                <p className="text-sm font-medium text-foreground">
                  {metrics.lastClick ? 
                    new Date(metrics.lastClick).toLocaleDateString() : 
                    'No clicks yet'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsOverview;