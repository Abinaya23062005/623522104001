import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

import Button from '../../../components/ui/Button';

const ClicksChart = ({ clicksData, timeRange, onTimeRangeChange }) => {
  const [chartType, setChartType] = useState('line');

  const timeRangeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  const formatTooltipLabel = (label) => {
    return new Date(label).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-medium">
          <p className="text-sm font-medium text-foreground mb-1">
            {formatTooltipLabel(label)}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Click Activity</h3>
          <p className="text-sm text-muted-foreground">
            Track clicks over time to understand usage patterns
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Chart Type Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="xs"
              onClick={() => setChartType('line')}
              iconName="TrendingUp"
              iconSize={14}
            >
              Line
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="xs"
              onClick={() => setChartType('bar')}
              iconName="BarChart3"
              iconSize={14}
            >
              Bar
            </Button>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            {timeRangeOptions.map((option) => (
              <Button
                key={option.value}
                variant={timeRange === option.value ? 'default' : 'ghost'}
                size="xs"
                onClick={() => onTimeRangeChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-64 lg:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={clicksData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="var(--color-primary)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
                name="Clicks"
              />
              <Line 
                type="monotone" 
                dataKey="uniqueVisitors" 
                stroke="var(--color-success)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-success)', strokeWidth: 2 }}
                name="Unique Visitors"
              />
            </LineChart>
          ) : (
            <BarChart data={clicksData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="clicks" 
                fill="var(--color-primary)" 
                radius={[2, 2, 0, 0]}
                name="Clicks"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Peak Day</p>
            <p className="text-sm font-medium text-foreground">
              {clicksData.length > 0 ? 
                new Date(clicksData.reduce((max, item) => item.clicks > max.clicks ? item : max).date)
                  .toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 
                'N/A'
              }
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Peak Clicks</p>
            <p className="text-sm font-medium text-foreground">
              {clicksData.length > 0 ? 
                Math.max(...clicksData.map(item => item.clicks)) : 
                0
              }
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Avg Daily</p>
            <p className="text-sm font-medium text-foreground">
              {clicksData.length > 0 ? 
                Math.round(clicksData.reduce((sum, item) => sum + item.clicks, 0) / clicksData.length) : 
                0
              }
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Period</p>
            <p className="text-sm font-medium text-foreground">
              {clicksData.reduce((sum, item) => sum + item.clicks, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClicksChart;