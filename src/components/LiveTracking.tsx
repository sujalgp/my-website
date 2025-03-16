import React, { useEffect, useRef, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { Phone } from 'lucide-react';

interface MechanicLocation {
  lat: number;
  lng: number;
  eta: string;
}

interface LiveTrackingProps {
  requestId: string;
  mechanicPhone: string;
}

const DEFAULT_LOCATION = {
  lat: 19.0760,
  lng: 72.8777
};

function MapComponent({ center, zoom }: { center: google.maps.LatLngLiteral; zoom: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => {
    if (ref.current && !map) {
      const mapInstance = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          {
            elementType: "geometry",
            stylers: [{ color: "#242f3e" }]
          },
          {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#242f3e" }]
          },
          {
            elementType: "labels.text.fill",
            stylers: [{ color: "#746855" }]
          },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }]
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }]
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }]
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }]
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }]
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }]
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }]
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }]
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }]
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }]
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }]
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }]
          }
        ]
      });
      setMap(mapInstance);

      const markerInstance = new google.maps.Marker({
        position: center,
        map: mapInstance,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        }
      });
      setMarker(markerInstance);
    }

    return () => {
      if (marker) {
        marker.setMap(null);
      }
      if (map) {
        // Clean up map instance if needed
      }
    };
  }, [ref, map, center, zoom]);

  useEffect(() => {
    if (marker) {
      marker.setPosition(center);
    }
  }, [marker, center]);

  return <div ref={ref} className="w-full h-full rounded-lg" />;
}

function LoadingComponent() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-400">
      <div className="animate-pulse">Loading map...</div>
    </div>
  );
}

function ErrorComponent({ message }: { message: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-400">
      <div className="text-center">
        <p className="mb-2">⚠️ {message}</p>
        <p className="text-sm">Please check your Google Maps API configuration</p>
      </div>
    </div>
  );
}

export function LiveTracking({ requestId, mechanicPhone }: LiveTrackingProps) {
  const [mechanicLocation, setMechanicLocation] = useState<MechanicLocation>({
    lat: DEFAULT_LOCATION.lat,
    lng: DEFAULT_LOCATION.lng,
    eta: '15 mins'
  });

  useEffect(() => {
    // Simulate mechanic movement
    const interval = setInterval(() => {
      setMechanicLocation(prev => ({
        ...prev,
        lat: prev.lat + 0.0001
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-700">
        <ErrorComponent message="Google Maps API key not configured" />
      </div>
    );
  }

  return (
    <div className="bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Mechanic on the way</h3>
          <p className="text-gray-400">ETA: {mechanicLocation.eta}</p>
        </div>
        <a
          href={`tel:${mechanicPhone}`}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Phone className="h-4 w-4 mr-2" />
          Call Mechanic
        </a>
      </div>
      <div className="w-full h-[400px] rounded-lg overflow-hidden">
        <Wrapper
          apiKey={apiKey}
          render={status => {
            switch (status) {
              case 'LOADING':
                return <LoadingComponent />;
              case 'FAILURE':
                return <ErrorComponent message="Failed to load Google Maps" />;
              case 'SUCCESS':
                return (
                  <MapComponent
                    center={{ lat: mechanicLocation.lat, lng: mechanicLocation.lng }}
                    zoom={15}
                  />
                );
            }
          }}
        />
      </div>
    </div>
  );
}