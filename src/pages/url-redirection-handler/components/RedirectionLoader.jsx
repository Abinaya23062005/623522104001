import React from 'react';
import Icon from '../../../components/AppIcon';

const RedirectionLoader = ({ shortCode, originalUrl }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* App Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-medium">
            <Icon name="Link" size={32} color="white" strokeWidth={2.5} />
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          LinkShrinker
        </h1>

        {/* Loading Animation */}
        <div className="flex items-center justify-center mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>

        {/* Status Message */}
        <div className="space-y-3">
          <p className="text-lg font-medium text-foreground">
            Redirecting...
          </p>
          <p className="text-sm text-muted-foreground">
            Taking you to your destination
          </p>
        </div>

        {/* URL Info */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
              <span className="text-sm font-mono text-primary">
                /{shortCode}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate" title={originalUrl}>
              {originalUrl}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-muted rounded-full h-1">
            <div className="bg-primary h-1 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedirectionLoader;