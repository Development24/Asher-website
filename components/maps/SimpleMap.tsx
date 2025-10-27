import React, { useEffect, useRef } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

interface SimpleMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  height?: string;
  width?: string;
  title?: string;
  className?: string;
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
}> = ({ center, zoom, title }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (ref.current && !mapRef.current) {
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

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${title || 'Property Location'}</h3>
            <p style="margin: 0; color: #666; font-size: 14px;">
              ${center.lat.toFixed(6)}, ${center.lng.toFixed(6)}
            </p>
          </div>
        `,
      });

      markerRef.current.addListener('click', () => {
        infoWindow.open(mapRef.current, markerRef.current);
      });
    }
  }, [center, zoom, title]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
};

const SimpleMap: React.FC<SimpleMapProps> = ({
  latitude,
  longitude,
  zoom = 15,
  height = '400px',
  width = '100%',
  title,
  className,
}) => {
  // Validate coordinates and provide fallback
  const validLat = typeof latitude === 'number' && !isNaN(latitude) ? latitude : 6.5244;
  const validLng = typeof longitude === 'number' && !isNaN(longitude) ? longitude : 3.3792;
  
  // Debug logging
  console.log('SimpleMap coordinates:', { latitude, longitude, validLat, validLng });
  
  const center: google.maps.LatLngLiteral = {
    lat: validLat,
    lng: validLng,
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;

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
          className="overflow-hidden rounded-lg" 
          style={{ width, height }}
        >
          <Wrapper apiKey={apiKey} render={render}>
            <MapComponent center={center} zoom={zoom} title={title} />
          </Wrapper>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleMap;
