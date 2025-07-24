import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExpiredUrlError = ({ shortCode }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/url-shortening-dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-smooth">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Icon name="Link" size={20} color="white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-semibold text-foreground font-sans">
                LinkShrinker
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Error Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="max-w-md w-full text-center">
          {/* Error Icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 bg-error/10 rounded-full">
              <Icon name="Clock" size={40} className="text-error" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4 mb-8">
            <h1 className="text-2xl font-semibold text-foreground">
              Link Expired
            </h1>
            <p className="text-muted-foreground">
              This short URL has expired and is no longer available. The link may have reached its expiration time or been deactivated.
            </p>
          </div>

          {/* URL Info */}
          <div className="mb-8 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <span className="text-sm font-mono text-muted-foreground">
                /{shortCode}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Expired on {new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="default"
              fullWidth
              iconName="Plus"
              iconPosition="left"
              asChild
            >
              <Link to="/url-shortening-dashboard">
                Create New Short URL
              </Link>
            </Button>
            
            <Button
              variant="outline"
              fullWidth
              iconName="Home"
              iconPosition="left"
              asChild
            >
              <Link to="/url-shortening-dashboard">
                Go to Homepage
              </Link>
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 p-4 bg-card border border-border rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={16} className="text-primary mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground mb-1">
                  Need help?
                </p>
                <p className="text-xs text-muted-foreground">
                  Short URLs expire after their set duration. Create a new one with a longer expiration time if needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpiredUrlError;