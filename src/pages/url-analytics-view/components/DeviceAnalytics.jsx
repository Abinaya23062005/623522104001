import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeviceAnalytics = ({ deviceData }) => {
  const [viewMode, setViewMode] = useState('devices');

  const deviceColors = {
    'Desktop': 'var(--color-primary)',
    'Mobile': 'var(--color-success)',
    'Tablet': 'var(--color-warning)',
    'Other': 'var(--color-muted-foreground)'
  };

  const browserColors = {
    'Chrome': '#4285F4',
    'Safari': '#FF6B35',
    'Firefox': '#FF7139',
    'Edge': '#0078D4',
    'Opera': '#FF1B2D',
    'Other': 'var(--color-muted-foreground)'
  };

  const osColors = {
    'Windows': '#0078D4',
    'macOS': '#000000',
    'iOS': '#007AFF',
    'Android': '#3DDC84',
    'Linux': '#FCC624',
    'Other': 'var(--color-muted-foreground)'
  };

  const getDeviceIcon = (device) => {
    const iconMap = {
      'Desktop': 'Monitor',
      'Mobile': 'Smartphone',
      'Tablet': 'Tablet',
      'Other': 'HelpCircle'
    };
    return iconMap[device] || 'HelpCircle';
  };

  const getBrowserIcon = (browser) => {
    const iconMap = {
      'Chrome': 'Chrome',
      'Safari': 'Globe',
      'Firefox': 'Globe',
      'Edge': 'Globe',
      'Opera': 'Globe',
      'Other': 'Globe'
    };
    return iconMap[browser] || 'Globe';
  };

  const getOSIcon = (os) => {
    const iconMap = {
      'Windows': 'Monitor',
      'macOS': 'Monitor',
      'iOS': 'Smartphone',
      'Android': 'Smartphone',
      'Linux': 'Terminal',
      'Other': 'HelpCircle'
    };
    return iconMap[os] || 'HelpCircle';
  };

  const getCurrentData = () => {
    switch (viewMode) {
      case 'devices':
        return deviceData.devices;
      case 'browsers':
        return deviceData.browsers;
      case 'os':
        return deviceData.operatingSystems;
      default:
        return deviceData.devices;
    }
  };

  const getCurrentColors = () => {
    switch (viewMode) {
      case 'devices':
        return deviceColors;
      case 'browsers':
        return browserColors;
      case 'os':
        return osColors;
      default:
        return deviceColors;
    }
  };

  const getCurrentIcon = (item) => {
    switch (viewMode) {
      case 'devices':
        return getDeviceIcon(item);
      case 'browsers':
        return getBrowserIcon(item);
      case 'os':
        return getOSIcon(item);
      default:
        return getDeviceIcon(item);
    }
  };

  const currentData = getCurrentData();
  const currentColors = getCurrentColors();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-medium">
          <p className="text-sm font-medium text-foreground mb-1">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.clicks} clicks ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Device Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Understand how users access your links across different devices
          </p>
        </div>

        <div className="flex items-center bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === 'devices' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setViewMode('devices')}
            iconName="Monitor"
            iconSize={14}
          >
            Devices
          </Button>
          <Button
            variant={viewMode === 'browsers' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setViewMode('browsers')}
            iconName="Globe"
            iconSize={14}
          >
            Browsers
          </Button>
          <Button
            variant={viewMode === 'os' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setViewMode('os')}
            iconName="Settings"
            iconSize={14}
          >
            OS
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="space-y-4">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="clicks"
                >
                  {currentData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={currentColors[entry.name] || 'var(--color-muted-foreground)'} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2">
            {currentData.map((item, index) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: currentColors[item.name] || 'var(--color-muted-foreground)' }}
                ></div>
                <span className="text-xs text-foreground truncate">{item.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed List */}
        <div className="space-y-3">
          {currentData.map((item, index) => (
            <div key={item.name} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-card">
                <Icon 
                  name={getCurrentIcon(item.name)} 
                  size={20} 
                  style={{ color: currentColors[item.name] || 'var(--color-muted-foreground)' }}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{item.clicks}</span>
                    <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
                  </div>
                </div>
                
                <div className="w-full bg-background rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-progressive"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: currentColors[item.name] || 'var(--color-muted-foreground)'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Mobile Traffic</p>
            <p className="text-sm font-medium text-foreground">
              {deviceData.devices.find(d => d.name === 'Mobile')?.percentage || 0}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Desktop Traffic</p>
            <p className="text-sm font-medium text-foreground">
              {deviceData.devices.find(d => d.name === 'Desktop')?.percentage || 0}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Top Browser</p>
            <p className="text-sm font-medium text-foreground">
              {deviceData.browsers[0]?.name || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Top OS</p>
            <p className="text-sm font-medium text-foreground">
              {deviceData.operatingSystems[0]?.name || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceAnalytics;