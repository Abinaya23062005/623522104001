import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnalyticsHeader = ({ selectedUrl, onExport, onShare }) => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/url-shortening-dashboard');
  };

  return (
    <div className="bg-card border-b border-border p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-smooth"
          >
            <Icon name="ChevronLeft" size={16} />
            <span>Dashboard</span>
          </button>
          <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
          <span className="text-sm text-foreground">Analytics</span>
        </div>

        {/* Header Content */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              URL Analytics
            </h1>
            {selectedUrl && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-muted-foreground">Short URL:</span>
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded text-primary">
                    linkshrinker.com/{selectedUrl.shortCode}
                  </code>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-muted-foreground">Original:</span>
                  <p className="text-sm text-foreground truncate max-w-md lg:max-w-2xl" title={selectedUrl.originalUrl}>
                    {selectedUrl.originalUrl}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              iconName="Share2"
              iconPosition="left"
              className="hidden sm:flex"
            >
              Share Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              iconName="Download"
              iconPosition="left"
            >
              Export Data
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onShare}
              iconName="Share2"
              className="sm:hidden"
            >
              <span className="sr-only">Share</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHeader;