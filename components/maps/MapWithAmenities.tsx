import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, MapPin, RefreshCw } from 'lucide-react';
import KeyFeatures from './KeyFeatures';

interface Amenity {
  name: string;
  type: string;
  rating?: number;
  distance: string;
  place_id: string;
  vicinity: string;
}

interface MapWithAmenitiesProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  height?: string;
  width?: string;
  title?: string;
  className?: string;
  amenityTypes?: string[];
  radius?: number;
}

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      );
    case Status.FAILURE:
      return (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            Failed to load Google Maps. Please check your API key and internet connection.
          </AlertDescription>
        </Alert>
      );
    default:
      return <div className="h-[300px]" />;
  }
};

const MapComponent: React.FC<{
  center: google.maps.LatLngLiteral;
  zoom: number;
  title?: string;
  onAmenitiesFound: (amenities: Amenity[]) => void;
  amenityTypes: string[];
  radius: number;
}> = ({ center, zoom, title, onAmenitiesFound, amenityTypes, radius }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const serviceRef = useRef<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    if (ref.current && !mapRef.current) {
      try {
        // Check if Google Maps is loaded
        if (typeof google === 'undefined' || !google.maps) {
          console.error('Google Maps API not loaded');
          return;
        }

        // Enhanced Places API debugging
        console.log('Google Maps loaded:', !!google.maps);
        console.log('Google Maps version:', google.maps.version);
        console.log('Places API available:', !!google.maps.places);
        console.log('PlacesService available:', !!google.maps.places?.PlacesService);
        
        // Try to load Places API (New) if not available
        if (!google.maps.places) {
          console.log('Attempting to load Places API (New)...');
          
          // Use importLibrary to load Places API
          google.maps.importLibrary('places').then((placesLibrary) => {
            console.log('Places API (New) loaded successfully:', placesLibrary);
            // Now we can use the new Places API
            initializeMapWithPlaces();
          }).catch((error) => {
            console.error('Failed to load Places API (New):', error);
            // Fallback to basic map without places
            initializeMapWithoutPlaces();
          });
        } else {
          // Places API is already available
          initializeMapWithPlaces();
        }
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
      }
    }
  }, [center, zoom, title, amenityTypes, radius]);

  const initializeMapWithPlaces = () => {
    if (!ref.current || mapRef.current) return;

    try {
      mapRef.current = new google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      // Add marker
      markerRef.current = new google.maps.Marker({
        position: center,
        map: mapRef.current,
        title: title || 'Property Location',
        animation: google.maps.Animation.DROP,
      });

      // Initialize Places service with a small delay to ensure it's loaded
      setTimeout(() => {
        try {
          if (mapRef.current) {
            serviceRef.current = new google.maps.places.PlacesService(mapRef.current);
            console.log('PlacesService initialized successfully');
            
            // Search for nearby amenities
            searchNearbyAmenities();
          }
        } catch (error) {
          console.error('Error initializing PlacesService:', error);
        }
      }, 100);
    } catch (error) {
      console.error('Error initializing map with places:', error);
    }
  };

  const initializeMapWithoutPlaces = () => {
    if (!ref.current || mapRef.current) return;

    try {
      mapRef.current = new google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      // Add marker
      markerRef.current = new google.maps.Marker({
        position: center,
        map: mapRef.current,
        title: title || 'Property Location',
        animation: google.maps.Animation.DROP,
      });

      console.log('Map initialized without Places API - amenities will not be available');
    } catch (error) {
      console.error('Error initializing map without places:', error);
    }
  };

  const searchNearbyAmenities = () => {
    if (!serviceRef.current) {
      console.error('Places service not initialized');
      return;
    }

    const request = {
      location: center,
      radius: radius * 1000, // Convert km to meters
      type: amenityTypes[0] || 'establishment',
    };

    console.log('Searching for amenities with request:', request);

    serviceRef.current.nearbySearch(request, (results, status) => {
      console.log('Places API response:', { status, results });
      
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const amenities: Amenity[] = results.map(place => {
          const distance = calculateDistance(
            center.lat,
            center.lng,
            place.geometry?.location?.lat() || 0,
            place.geometry?.location?.lng() || 0
          );

          return {
            name: place.name || 'Unknown',
            type: place.types?.[0] || 'establishment',
            rating: place.rating,
            distance: `${distance.toFixed(1)} km`,
            place_id: place.place_id || '',
            vicinity: place.vicinity || '',
          };
        });

        // Sort by distance
        amenities.sort((a, b) => {
          const aDistance = parseFloat(a.distance);
          const bDistance = parseFloat(b.distance);
          return aDistance - bDistance;
        });

        console.log('Found amenities:', amenities);
        onAmenitiesFound(amenities);
      } else {
        console.error('Places API error:', status);
        onAmenitiesFound([]);
      }
    });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
};

const MapWithAmenities: React.FC<MapWithAmenitiesProps> = ({
  latitude,
  longitude,
  zoom = 15,
  height = '400px',
  width = '100%',
  title,
  className,
  amenityTypes = ['restaurant', 'hospital', 'school', 'shopping_mall', 'gas_station', 'bank', 'pharmacy', 'gym'],
  radius = 2, // 2km radius
}) => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(false);

  const center: google.maps.LatLngLiteral = {
    lat: latitude,
    lng: longitude,
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;

  const handleAmenitiesFound = (foundAmenities: Amenity[]) => {
    setAmenities(foundAmenities);
    setLoading(false);
  };

  const refreshAmenities = () => {
    setLoading(true);
    // The map component will automatically search again when re-rendered
  };


  return (
    <Card className={className}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className={title ? "pt-0" : "p-0"}>
        <div 
          className="overflow-hidden mb-4 rounded-lg" 
          style={{ width, height }}
        >
          <Wrapper apiKey={apiKey} render={render}>
            <MapComponent 
              center={center} 
              zoom={zoom} 
              title={title}
              onAmenitiesFound={handleAmenitiesFound}
              amenityTypes={amenityTypes}
              radius={radius}
            />
          </Wrapper>
        </div>

        <div className="space-y-4">
          {loading && (
            <div className="flex justify-center py-5">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}

          <KeyFeatures
            features={amenities.map(amenity => ({
              id: amenity.place_id || Math.random().toString(),
              name: amenity.name,
              distance: amenity.distance,
              type: amenity.type,
              rating: amenity.rating,
              vicinity: amenity.vicinity,
              place_id: amenity.place_id
            }))}
            title="Nearby Amenities"
            loading={loading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MapWithAmenities;
