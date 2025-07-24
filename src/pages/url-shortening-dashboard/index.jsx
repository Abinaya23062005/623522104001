import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import URLContextPanel from '../../components/ui/URLContextPanel';
import { NotificationProvider } from '../../components/ui/NotificationSystem';
import URLShorteningForm from './components/URLShorteningForm';
import URLList from './components/URLList';
import RecentActivity from './components/RecentActivity';

const URLShorteningDashboard = () => {
  const [urls, setUrls] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const navigate = useNavigate();

  // Load mock data on component mount
  useEffect(() => {
    const mockUrls = [
      {
        id: 1,
        originalUrl: "https://www.example.com/very-long-url-that-needs-to-be-shortened-for-better-sharing",
        shortCode: "abc123",
        shortUrl: `${window.location.origin}/abc123`,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        expiresAt: new Date(Date.now() + 28 * 60 * 1000).toISOString(), // 28 minutes from now
        clicks: 15,
        status: 'active'
      },
      {
        id: 2,
        originalUrl: "https://github.com/facebook/react/blob/main/packages/react/src/React.js",
        shortCode: "react-src",
        shortUrl: `${window.location.origin}/react-src`,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        expiresAt: new Date(Date.now() + 55 * 60 * 1000).toISOString(), // 55 minutes from now
        clicks: 8,
        status: 'active'
      },
      {
        id: 3,
        originalUrl: "https://tailwindcss.com/docs/installation",
        shortCode: "tw-docs",
        shortUrl: `${window.location.origin}/tw-docs`,
        createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), // 25 hours ago
        expiresAt: new Date(Date.now() - 60 * 1000).toISOString(), // Expired 1 minute ago
        clicks: 23,
        status: 'active'
      },
      {
        id: 4,
        originalUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
        shortCode: "js-array",
        shortUrl: `${window.location.origin}/js-array`,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        clicks: 5,
        status: 'active'
      }
    ];

    setUrls(mockUrls);
  }, []);

  const handleUrlCreated = (newUrl) => {
    setUrls(prev => [newUrl, ...prev]);
    setSelectedUrl(newUrl);
  };

  const handleDeleteUrl = (urlId) => {
    setUrls(prev => prev.filter(url => url.id !== urlId));
    if (selectedUrl?.id === urlId) {
      setSelectedUrl(null);
    }
  };

  const handleViewAnalytics = (url) => {
    setSelectedUrl(url);
    navigate(`/url-analytics-view?id=${url.id}`);
  };

  const handleUrlSelect = (url) => {
    setSelectedUrl(url);
  };

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* URL Shortening Form */}
                <URLShorteningForm onUrlCreated={handleUrlCreated} />

                {/* URL List */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Your Short URLs
                  </h2>
                  <URLList
                    urls={urls}
                    onDeleteUrl={handleDeleteUrl}
                    onViewAnalytics={handleViewAnalytics}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <RecentActivity urls={urls} />
              </div>
            </div>
          </div>
        </main>

        {/* URL Context Panel */}
        <URLContextPanel
          selectedUrl={selectedUrl}
          onUrlSelect={handleUrlSelect}
          urls={urls}
        />
      </div>
    </NotificationProvider>
  );
};

export default URLShorteningDashboard;