import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import UrlShorteningDashboard from "pages/url-shortening-dashboard";
import UrlRedirectionHandler from "pages/url-redirection-handler";
import UrlAnalyticsView from "pages/url-analytics-view";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<UrlShorteningDashboard />} />
        <Route path="/url-shortening-dashboard" element={<UrlShorteningDashboard />} />
        <Route path="/url-redirection-handler" element={<UrlRedirectionHandler />} />
        <Route path="/url-analytics-view" element={<UrlAnalyticsView />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;