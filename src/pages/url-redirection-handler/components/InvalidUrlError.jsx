import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InvalidUrlError = ({ shortCode }) => {
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
              <Icon name="AlertCircle" size={40} className="text-error" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4 mb-8">
            <h1 className="text-2xl font-semibold text-foreground">
              Link Not Found
            </h1>
            <p className="text-muted-foreground">
              The short URL you're looking for doesn't exist. It may have been mistyped or the link is invalid.
            </p>
          </div>

          {/* URL Info */}
          <div className="mb-8 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <Icon name="XCircle" size={16} className="text-error" />
              <span className="text-sm font-mono text-muted-foreground">
                /{shortCode}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Invalid shortcode
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
                Create Short URL
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

          {/* Suggestions */}
          <div className="mt-8 p-4 bg-card border border-border rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Lightbulb" size={16} className="text-warning mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground mb-1">
                  Suggestions
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Check if the URL was typed correctly</li>
                  <li>• Verify the shortcode with the sender</li>
                  <li>• Create a new short URL if needed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvalidUrlError;