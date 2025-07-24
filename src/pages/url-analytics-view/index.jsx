import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import URLContextPanel from '../../components/ui/URLContextPanel';
import { useNotification } from '../../components/ui/NotificationSystem';
import AnalyticsHeader from './components/AnalyticsHeader';
import MetricsOverview from './components/MetricsOverview';
import ClicksChart from './components/ClicksChart';
import GeographicDistribution from './components/GeographicDistribution';
import ReferrerSources from './components/ReferrerSources';
import DeviceAnalytics from './components/DeviceAnalytics';

const URLAnalyticsView = () => {
  const [searchParams] = useSearchParams();
  const { showSuccess, showError } = useNotification();
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);

  // Mock URLs data
  const mockUrls = [
    {
      id: 1,
      shortCode: "summer24",
      originalUrl: "https://example.com/summer-sale-2024-discount-offers-limited-time",
      status: "active",
      clicks: 1247,
      createdAt: "2024-07-01T10:30:00Z",
      expiresAt: "2024-08-01T10:30:00Z"
    },
    {
      id: 2,
      shortCode: "blog-post",
      originalUrl: "https://myblog.com/how-to-improve-website-performance-optimization-guide",
      status: "active",
      clicks: 892,
      createdAt: "2024-07-10T14:20:00Z",
      expiresAt: "2024-08-10T14:20:00Z"
    },
    {
      id: 3,
      shortCode: "product-demo",
      originalUrl: "https://company.com/product-demonstration-video-tutorial-guide",
      status: "expired",
      clicks: 456,
      createdAt: "2024-06-15T09:15:00Z",
      expiresAt: "2024-07-15T09:15:00Z"
    },
    {
      id: 4,
      shortCode: "newsletter",
      originalUrl: "https://newsletter.com/subscribe-monthly-updates-technology-trends",
      status: "active",
      clicks: 234,
      createdAt: "2024-07-20T16:45:00Z",
      expiresAt: "2024-08-20T16:45:00Z"
    }
  ];

  // Mock analytics data
  const generateMockAnalytics = (urlId) => {
    const baseDate = new Date('2024-07-01');
    const clicksData = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);
      clicksData.push({
        date: date.toISOString(),
        clicks: Math.floor(Math.random() * 50) + 10,
        uniqueVisitors: Math.floor(Math.random() * 35) + 5
      });
    }

    return {
      metrics: {
        totalClicks: 1247,
        uniqueVisitors: 892,
        clickRate: 71.5,
        avgDaily: 41.6,
        clicksChange: 12.5,
        visitorsChange: 8.3,
        rateChange: -2.1,
        dailyChange: 15.7,
        lastClick: "2024-07-23T14:30:00Z"
      },
      clicksData,
      geographicData: {
        countries: [
          { code: 'US', name: 'United States', clicks: 456, percentage: 36.6 },
          { code: 'GB', name: 'United Kingdom', clicks: 234, percentage: 18.8 },
          { code: 'CA', name: 'Canada', clicks: 187, percentage: 15.0 },
          { code: 'DE', name: 'Germany', clicks: 123, percentage: 9.9 },
          { code: 'FR', name: 'France', clicks: 98, percentage: 7.9 },
          { code: 'AU', name: 'Australia', clicks: 76, percentage: 6.1 },
          { code: 'JP', name: 'Japan', clicks: 45, percentage: 3.6 },
          { code: 'IN', name: 'India', clicks: 28, percentage: 2.2 }
        ],
        cities: [
          { name: 'New York', clicks: 234, percentage: 18.8 },
          { name: 'London', clicks: 187, percentage: 15.0 },
          { name: 'Toronto', clicks: 123, percentage: 9.9 },
          { name: 'Berlin', clicks: 98, percentage: 7.9 },
          { name: 'Paris', clicks: 76, percentage: 6.1 },
          { name: 'Sydney', clicks: 65, percentage: 5.2 },
          { name: 'Tokyo', calls: 45, percentage: 3.6 },
          { name: 'Mumbai', clicks: 28, percentage: 2.2 }
        ]
      },
      referrerData: {
        sources: [
          { source: 'google.com', clicks: 445, percentage: 35.7 },
          { source: 'facebook.com', clicks: 312, percentage: 25.0 },
          { source: 'twitter.com', clicks: 187, percentage: 15.0 },
          { source: 'direct', clicks: 156, percentage: 12.5 },
          { source: 'linkedin.com', clicks: 89, percentage: 7.1 },
          { source: 'instagram.com', clicks: 34, percentage: 2.7 },
          { source: 'email', clicks: 24, percentage: 1.9 }
        ],
        pages: [
          { page: '/landing-page', clicks: 234, percentage: 18.8 },
          { page: '/blog/article-1', clicks: 187, percentage: 15.0 },
          { page: '/products/demo', clicks: 123, percentage: 9.9 },
          { page: '/about-us', clicks: 98, percentage: 7.9 },
          { page: '/contact', clicks: 76, percentage: 6.1 },
          { page: '/pricing', clicks: 65, percentage: 5.2 }
        ]
      },
      deviceData: {
        devices: [
          { name: 'Mobile', clicks: 623, percentage: 50.0 },
          { name: 'Desktop', clicks: 436, percentage: 35.0 },
          { name: 'Tablet', clicks: 187, percentage: 15.0 }
        ],
        browsers: [
          { name: 'Chrome', clicks: 561, percentage: 45.0 },
          { name: 'Safari', clicks: 312, percentage: 25.0 },
          { name: 'Firefox', clicks: 187, percentage: 15.0 },
          { name: 'Edge', clicks: 124, percentage: 10.0 },
          { name: 'Other', clicks: 63, percentage: 5.0 }
        ],
        operatingSystems: [
          { name: 'iOS', clicks: 436, percentage: 35.0 },
          { name: 'Android', clicks: 374, percentage: 30.0 },
          { name: 'Windows', clicks: 249, percentage: 20.0 },
          { name: 'macOS', clicks: 124, percentage: 10.0 },
          { name: 'Other', clicks: 64, percentage: 5.0 }
        ]
      }
    };
  };

  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const urlId = searchParams.get('id');
    if (urlId) {
      const url = mockUrls.find(u => u.id === parseInt(urlId));
      if (url) {
        setSelectedUrl(url);
        setAnalyticsData(generateMockAnalytics(url.id));
      }
    } else if (mockUrls.length > 0) {
      setSelectedUrl(mockUrls[0]);
      setAnalyticsData(generateMockAnalytics(mockUrls[0].id));
    }
    
    setIsLoading(false);
  }, [searchParams]);

  const handleUrlSelect = (url) => {
    setSelectedUrl(url);
    setAnalyticsData(generateMockAnalytics(url.id));
  };

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
    // In a real app, this would trigger a new data fetch
    showSuccess(`Analytics updated for ${newRange} period`);
  };

  const handleExport = () => {
    showSuccess('Analytics data exported successfully');
  };

  const handleShare = () => {
    showSuccess('Analytics report link copied to clipboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedUrl || !analyticsData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No URL selected for analytics</p>
            <button
              onClick={() => window.history.back()}
              className="text-primary hover:text-primary/80 transition-smooth"
            >
              Go back to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16 lg:pr-88">
        <AnalyticsHeader
          selectedUrl={selectedUrl}
          onExport={handleExport}
          onShare={handleShare}
        />

        <div className="space-y-6 pb-8">
          <MetricsOverview
            selectedUrl={selectedUrl}
            metrics={analyticsData.metrics}
          />

          <div className="px-4 lg:px-6">
            <div className="max-w-7xl mx-auto">
              <ClicksChart
                clicksData={analyticsData.clicksData}
                timeRange={timeRange}
                onTimeRangeChange={handleTimeRangeChange}
              />
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GeographicDistribution
                geographicData={analyticsData.geographicData}
              />
              <ReferrerSources
                referrerData={analyticsData.referrerData}
              />
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <div className="max-w-7xl mx-auto">
              <DeviceAnalytics
                deviceData={analyticsData.deviceData}
              />
            </div>
          </div>
        </div>
      </div>

      <URLContextPanel
        selectedUrl={selectedUrl}
        onUrlSelect={handleUrlSelect}
        urls={mockUrls}
      />
    </div>
  );
};

export default URLAnalyticsView;