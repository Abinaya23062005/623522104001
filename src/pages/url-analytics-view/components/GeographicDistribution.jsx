import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GeographicDistribution = ({ geographicData }) => {
  const [viewMode, setViewMode] = useState('countries');

  const getCountryFlag = (countryCode) => {
    const flags = {
      'US': '🇺🇸',
      'GB': '🇬🇧',
      'CA': '🇨🇦',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'AU': '🇦🇺',
      'JP': '🇯🇵',
      'IN': '🇮🇳',
      'BR': '🇧🇷',
      'MX': '🇲🇽'
    };
    return flags[countryCode] || '🌍';
  };

  const topCountries = geographicData.countries.slice(0, 8);
  const topCities = geographicData.cities.slice(0, 8);

  const maxClicks = Math.max(
    ...geographicData.countries.map(item => item.clicks),
    ...geographicData.cities.map(item => item.clicks)
  );

  const getBarWidth = (clicks) => {
    return Math.max((clicks / maxClicks) * 100, 2);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Geographic Distribution</h3>
          <p className="text-sm text-muted-foreground">
            Where your clicks are coming from around the world
          </p>
        </div>

        <div className="flex items-center bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === 'countries' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setViewMode('countries')}
            iconName="Globe"
            iconSize={14}
          >
            Countries
          </Button>
          <Button
            variant={viewMode === 'cities' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setViewMode('cities')}
            iconName="MapPin"
            iconSize={14}
          >
            Cities
          </Button>
        </div>
      </div>

      {/* Geographic Data List */}
      <div className="space-y-3">
        {(viewMode === 'countries' ? topCountries : topCities).map((item, index) => (
          <div key={item.code || item.name} className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 text-lg">
              {viewMode === 'countries' ? getCountryFlag(item.code) : '🏙️'}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.name}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {item.clicks} clicks
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({item.percentage}%)
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-progressive"
                  style={{ width: `${getBarWidth(item.clicks)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Top Country</p>
            <div className="flex items-center justify-center space-x-1">
              <span className="text-lg">{getCountryFlag(geographicData.countries[0]?.code)}</span>
              <p className="text-sm font-medium text-foreground">
                {geographicData.countries[0]?.name || 'N/A'}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Countries</p>
            <p className="text-sm font-medium text-foreground">
              {geographicData.countries.length}
            </p>
          </div>
          <div className="col-span-2 lg:col-span-1">
            <p className="text-sm text-muted-foreground mb-1">International</p>
            <p className="text-sm font-medium text-foreground">
              {geographicData.countries.length > 1 ? 
                `${((geographicData.countries.slice(1).reduce((sum, country) => sum + country.clicks, 0) / 
                   geographicData.countries.reduce((sum, country) => sum + country.clicks, 0)) * 100).toFixed(1)}%` : 
                '0%'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="mt-6 p-4 bg-muted rounded-lg border-2 border-dashed border-border">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <Icon name="Map" size={32} className="text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">Interactive World Map</p>
          <p className="text-xs text-muted-foreground">
            Visual representation of click distribution across countries
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeographicDistribution;