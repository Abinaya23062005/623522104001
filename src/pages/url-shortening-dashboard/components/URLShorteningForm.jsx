import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { useNotification } from '../../../components/ui/NotificationSystem';

const URLShorteningForm = ({ onUrlCreated }) => {
  const [formData, setFormData] = useState({
    originalUrl: '',
    customShortcode: '',
    expirationTime: '30'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { showSuccess, showError } = useNotification();

  const expirationOptions = [
    { value: '5', label: '5 minutes' },
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '120', label: '2 hours' },
    { value: '1440', label: '24 hours' },
    { value: 'custom', label: 'Custom time' }
  ];

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const generateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.originalUrl.trim()) {
      newErrors.originalUrl = 'URL is required';
    } else if (!validateUrl(formData.originalUrl)) {
      newErrors.originalUrl = 'Please enter a valid URL';
    }

    if (formData.customShortcode && formData.customShortcode.length < 3) {
      newErrors.customShortcode = 'Custom shortcode must be at least 3 characters';
    }

    if (formData.customShortcode && !/^[a-zA-Z0-9-_]+$/.test(formData.customShortcode)) {
      newErrors.customShortcode = 'Only letters, numbers, hyphens, and underscores allowed';
    }

    if (formData.expirationTime === 'custom' && !formData.customMinutes) {
      newErrors.customMinutes = 'Please specify custom minutes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const shortCode = formData.customShortcode || generateShortCode();
      const expirationMinutes = formData.expirationTime === 'custom' 
        ? parseInt(formData.customMinutes) 
        : parseInt(formData.expirationTime);

      const newUrl = {
        id: Date.now(),
        originalUrl: formData.originalUrl,
        shortCode: shortCode,
        shortUrl: `${window.location.origin}/${shortCode}`,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + expirationMinutes * 60 * 1000).toISOString(),
        clicks: 0,
        status: 'active'
      };

      onUrlCreated(newUrl);
      showSuccess('Short URL created successfully!');
      
      // Reset form
      setFormData({
        originalUrl: '',
        customShortcode: '',
        expirationTime: '30'
      });

    } catch (error) {
      showError('Failed to create short URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-subtle border border-border p-6 lg:p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
          <Icon name="Link" size={32} className="text-primary" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Shorten Your URL
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Transform long URLs into short, shareable links with custom expiration times
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Original URL"
          type="url"
          placeholder="https://example.com/very-long-url-that-needs-shortening"
          value={formData.originalUrl}
          onChange={(e) => handleInputChange('originalUrl', e.target.value)}
          error={errors.originalUrl}
          required
          className="text-base"
        />

        <Input
          label="Custom Short Code (Optional)"
          type="text"
          placeholder="my-custom-link"
          value={formData.customShortcode}
          onChange={(e) => handleInputChange('customShortcode', e.target.value)}
          error={errors.customShortcode}
          description="Leave empty for auto-generated code"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Select
            label="Expiration Time"
            options={expirationOptions}
            value={formData.expirationTime}
            onChange={(value) => handleInputChange('expirationTime', value)}
            placeholder="Select expiration time"
          />

          {formData.expirationTime === 'custom' && (
            <Input
              label="Custom Minutes"
              type="number"
              placeholder="60"
              min="1"
              max="43200"
              value={formData.customMinutes || ''}
              onChange={(e) => handleInputChange('customMinutes', e.target.value)}
              error={errors.customMinutes}
              description="Max 30 days (43,200 minutes)"
            />
          )}
        </div>

        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          iconName="Zap"
          iconPosition="left"
          className="mt-8"
        >
          {isLoading ? 'Creating Short URL...' : 'Shorten URL'}
        </Button>
      </form>
    </div>
  );
};

export default URLShorteningForm;