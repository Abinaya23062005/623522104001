import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import RedirectionLoader from './components/RedirectionLoader';
import ExpiredUrlError from './components/ExpiredUrlError';
import InvalidUrlError from './components/InvalidUrlError';
import RedirectionLogger, { useLogger } from './components/RedirectionLogger';

const URLRedirectionHandlerContent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const logger = useLogger();
  
  const [redirectionState, setRedirectionState] = useState('loading'); // 'loading', 'expired', 'invalid', 'redirecting'
  const [urlData, setUrlData] = useState(null);
  const [shortCode, setShortCode] = useState('');

  // Mock URL database - in real app this would be from API/database
  const mockUrls = [
    {
      id: 1,
      shortCode: "tech-news",
      originalUrl: "https://techcrunch.com/2024/07/24/latest-ai-developments",
      createdAt: "2024-07-24T06:13:27.690Z",
      expiresAt: "2024-07-24T06:43:27.690Z", // 30 minutes from creation
      status: "active",
      clicks: 15
    },
    {
      id: 2,
      shortCode: "social-media",
      originalUrl: "https://twitter.com/linkshrinker/status/1234567890",
      createdAt: "2024-07-24T05:43:27.690Z",
      expiresAt: "2024-07-24T06:13:27.690Z", // Expired
      status: "expired",
      clicks: 8
    },
    {
      id: 3,
      shortCode: "product-demo",
      originalUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      createdAt: "2024-07-24T06:38:27.690Z",
      expiresAt: "2024-07-24T07:08:27.690Z", // Active
      status: "active",
      clicks: 3
    },
    {
      id: 4,
      shortCode: "marketing-campaign",
      originalUrl: "https://example.com/summer-sale-2024",
      createdAt: "2024-07-24T06:00:27.690Z",
      expiresAt: "2024-07-24T06:30:27.690Z", // Expired
      status: "expired",
      clicks: 42
    }
  ];

  useEffect(() => {
    // Get shortcode from URL parameters or path
    const codeFromParams = searchParams.get('code') || searchParams.get('shortcode');
    const pathSegments = window.location.pathname.split('/');
    const codeFromPath = pathSegments[pathSegments.length - 1];
    
    const extractedCode = codeFromParams || (codeFromPath !== 'url-redirection-handler' ? codeFromPath : '');
    
    if (!extractedCode) {
      // If no shortcode provided, redirect to dashboard
      navigate('/url-shortening-dashboard');
      return;
    }

    setShortCode(extractedCode);
    
    // Log redirection attempt
    logger.logRedirectionAttempt(extractedCode, 'attempting');

    // Simulate API call to validate shortcode
    setTimeout(() => {
      const foundUrl = mockUrls.find(url => url.shortCode === extractedCode);
      
      if (!foundUrl) {
        // Invalid shortcode
        setRedirectionState('invalid');
        logger.logRedirectionError(extractedCode, 'invalid', 'Shortcode not found');
        return;
      }

      // Check if URL is expired
      const now = new Date();
      const expirationDate = new Date(foundUrl.expiresAt);
      
      if (now > expirationDate || foundUrl.status === 'expired') {
        setRedirectionState('expired');
        logger.logRedirectionError(extractedCode, 'expired', 'URL has expired');
        return;
      }

      // URL is valid and active
      setUrlData(foundUrl);
      setRedirectionState('redirecting');
      
      // Log successful redirection
      logger.logRedirectionSuccess(extractedCode, foundUrl.originalUrl, 2000);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        // Update click count (in real app this would be API call)
        foundUrl.clicks += 1;
        
        // Redirect to original URL
        window.location.href = foundUrl.originalUrl;
      }, 2000);
      
    }, 1000); // Simulate network delay
  }, [searchParams, navigate, logger]);

  // Render appropriate component based on state
  switch (redirectionState) {
    case 'loading': case'redirecting':
      return (
        <RedirectionLoader 
          shortCode={shortCode} 
          originalUrl={urlData?.originalUrl} 
        />
      );
    
    case 'expired':
      return <ExpiredUrlError shortCode={shortCode} />;
    
    case 'invalid':
      return <InvalidUrlError shortCode={shortCode} />;
    
    default:
      return (
        <RedirectionLoader 
          shortCode={shortCode} 
          originalUrl={urlData?.originalUrl} 
        />
      );
  }
};

const URLRedirectionHandler = () => {
  return (
    <RedirectionLogger>
      <URLRedirectionHandlerContent />
    </RedirectionLogger>
  );
};

export default URLRedirectionHandler;