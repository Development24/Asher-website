import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

interface KeyFeature {
  id: string;
  name: string;
  distance: string;
  type: string;
  rating?: number;
  address?: string;
  icon?: string;
  place_id?: string;
  vicinity?: string;
}

interface KeyFeaturesProps {
  features?: KeyFeature[];
  title?: string;
  itemsPerPage?: number;
  className?: string;
  loading?: boolean;
}

const defaultFeatures: KeyFeature[] = [
  {
    id: '1',
    name: 'Lagos University Teaching Hospital',
    distance: '0.8 km',
    type: 'hospital',
    rating: 4.2,
    address: 'Idi-Araba, Lagos',
    icon: '🏥'
  },
  {
    id: '2',
    name: 'University of Lagos',
    distance: '1.2 km',
    type: 'school',
    rating: 4.5,
    address: 'Akoka, Lagos',
    icon: '🏫'
  },
  {
    id: '3',
    name: 'Shoprite Surulere',
    distance: '0.5 km',
    type: 'shopping_mall',
    rating: 4.0,
    address: 'Surulere, Lagos',
    icon: '🛍️'
  },
  {
    id: '4',
    name: 'Shell Petrol Station',
    distance: '0.3 km',
    type: 'gas_station',
    rating: 3.8,
    address: 'Western Avenue, Lagos',
    icon: '⛽'
  },
  {
    id: '5',
    name: 'First Bank Nigeria',
    distance: '0.7 km',
    type: 'bank',
    rating: 4.1,
    address: 'Adeniran Ogunsanya, Lagos',
    icon: '🏦'
  },
  {
    id: '6',
    name: 'KFC Restaurant',
    distance: '0.4 km',
    type: 'restaurant',
    rating: 4.3,
    address: 'Surulere, Lagos',
    icon: '🍽️'
  },
  {
    id: '7',
    name: 'Fitness First Gym',
    distance: '0.9 km',
    type: 'gym',
    rating: 4.4,
    address: 'Victoria Island, Lagos',
    icon: '💪'
  },
  {
    id: '8',
    name: 'Medplus Pharmacy',
    distance: '0.6 km',
    type: 'pharmacy',
    rating: 4.0,
    address: 'Surulere, Lagos',
    icon: '💊'
  },
  {
    id: '9',
    name: 'Lagos State University',
    distance: '1.5 km',
    type: 'school',
    rating: 4.2,
    address: 'Ojo, Lagos',
    icon: '🏫'
  },
  {
    id: '10',
    name: 'Lekki Conservation Centre',
    distance: '2.1 km',
    type: 'park',
    rating: 4.6,
    address: 'Lekki, Lagos',
    icon: '🌳'
  },
  {
    id: '11',
    name: 'Vicente Pizzeria',
    distance: '0.8 km',
    type: 'restaurant',
    rating: 4.7,
    address: 'Ikoyi, Lagos',
    icon: '🍕'
  },
  {
    id: '12',
    name: 'Eko Hotel & Suites',
    distance: '1.3 km',
    type: 'hotel',
    rating: 4.5,
    address: 'Victoria Island, Lagos',
    icon: '🏨'
  }
];

const KeyFeatures: React.FC<KeyFeaturesProps> = ({
  features = [],
  title = 'Key Features & Amenities',
  itemsPerPage = 6,
  className,
  loading = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Group features by type
  const groupedFeatures = features.reduce((acc, feature) => {
    const type = feature.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(feature);
    return acc;
  }, {} as Record<string, KeyFeature[]>);

  // Define category display names and limits
  const categoryConfig = {
    hospital: { name: 'Nearest hospitals', limit: 2 },
    school: { name: 'Nearest schools', limit: 2 },
    shopping_mall: { name: 'Nearest malls', limit: 2 },
    gas_station: { name: 'Nearest gas stations', limit: 2 },
    bank: { name: 'Nearest banks', limit: 2 },
    restaurant: { name: 'Nearest restaurants', limit: 2 },
    gym: { name: 'Nearest gyms', limit: 2 },
    pharmacy: { name: 'Nearest pharmacies', limit: 2 },
    park: { name: 'Nearest parks', limit: 2 },
    hotel: { name: 'Nearest hotels', limit: 2 },
  };

  const handleShowMore = () => {
    setIsExpanded(!isExpanded);
  };

  const getCategoryItems = (type: string) => {
    const items = groupedFeatures[type] || [];
    const config = categoryConfig[type as keyof typeof categoryConfig];
    const limit = isExpanded ? items.length : (config?.limit || 2);
    return items.slice(0, limit);
  };


  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            {title}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {features.length} features nearby
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {loading && (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Loading nearby amenities...
            </p>
          </div>
        )}

        {!loading && features.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No amenities found nearby
            </p>
          </div>
        )}

        {!loading && features.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.keys(groupedFeatures).slice(0, 5).map((type) => {
                const config = categoryConfig[type as keyof typeof categoryConfig];
                const items = getCategoryItems(type);
                
                if (items.length === 0) return null;

                return (
                  <div key={type} className="space-y-2">
                    <h3 className="text-sm font-semibold text-left">
                      {config?.name || `Nearest ${type}s`}
                    </h3>
                    <div className="space-y-2">
                      {items.slice(0, 4).map((feature) => (
                        <div key={feature.id} className="pb-2 border-b border-border last:border-b-0">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{feature.name}</span>
                            <span className="text-xs text-muted-foreground">{feature.distance}</span>
                          </div>
                          {feature.address && (
                            <p className="mt-1 text-xs text-muted-foreground">{feature.address}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {Object.values(groupedFeatures).some(items => items.length > 2) && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShowMore}
                  className="flex gap-2 items-center"
                >
                  {isExpanded ? 'Show Less' : 'Show More'}
                  {isExpanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default KeyFeatures;
