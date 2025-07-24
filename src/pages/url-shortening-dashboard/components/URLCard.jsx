import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useNotification } from '../../../components/ui/NotificationSystem';

const URLCard = ({ url, onDelete, onAnalytics }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const expiresAt = new Date(url.expiresAt);
      const diff = expiresAt - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeRemaining('Expired');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [url.expiresAt]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess('URL copied to clipboard!');
    } catch (error) {
      showError('Failed to copy URL');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      onDelete(url.id);
      showSuccess('URL deleted successfully');
    }
  };

  const getStatusColor = () => {
    if (isExpired) return 'text-error';
    if (url.status === 'active') return 'text-success';
    return 'text-warning';
  };

  const getStatusIcon = () => {
    if (isExpired) return 'XCircle';
    if (url.status === 'active') return 'CheckCircle';
    return 'Clock';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateUrl = (url, maxLength = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <div className={`bg-card rounded-lg border transition-smooth hover:shadow-medium ${
      isExpired ? 'border-error/20 bg-error/5' : 'border-border hover:border-primary/20'
    }`}>
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon
              name={getStatusIcon()}
              size={16}
              className={getStatusColor()}
            />
            <span className={`text-xs font-medium uppercase tracking-wide ${getStatusColor()}`}>
              {isExpired ? 'Expired' : url.status}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onAnalytics(url)}
              iconName="BarChart3"
              iconSize={16}
              className="text-muted-foreground hover:text-foreground"
            >
              <span className="sr-only">View analytics</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              iconName="Trash2"
              iconSize={16}
              className="text-muted-foreground hover:text-error"
            >
              <span className="sr-only">Delete URL</span>
            </Button>
          </div>
        </div>

        {/* URLs */}
        <div className="space-y-3 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Short URL</p>
            <div className="flex items-center space-x-2">
              <code className={`text-sm font-mono px-2 py-1 rounded flex-1 ${
                isExpired ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'
              }`}>
                /{url.shortCode}
              </code>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(url.shortUrl)}
                iconName="Copy"
                iconSize={14}
                disabled={isExpired}
                className="flex-shrink-0"
              >
                <span className="sr-only">Copy short URL</span>
              </Button>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Original URL</p>
            <p className="text-sm text-foreground break-all" title={url.originalUrl}>
              {truncateUrl(url.originalUrl, 50)}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-lg font-semibold text-foreground">{url.clicks}</p>
            <p className="text-xs text-muted-foreground">Clicks</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className={`text-sm font-medium ${isExpired ? 'text-error' : 'text-foreground'}`}>
              {timeRemaining}
            </p>
            <p className="text-xs text-muted-foreground">
              {isExpired ? 'Status' : 'Remaining'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
          <span>Created {formatDate(url.createdAt)}</span>
          <span>Expires {formatDate(url.expiresAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default URLCard;