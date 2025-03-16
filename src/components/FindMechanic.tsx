import React, { useEffect, useRef, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { Search, Filter, Star, MapPin, Phone, MessageCircle, Clock, DollarSign, Wrench, ChevronDown, AlertTriangle, Loader } from 'lucide-react';

interface Mechanic {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviews: number;
  specializations: string[];
  serviceFee: {
    min: number;
    max: number;
  };
  location: {
    lat: number;
    lng: number;
  };
  estimatedArrival: string;
  isOnline: boolean;
}

const sampleMechanics: Mechanic[] = [
  {
    id: '1',
    name: 'Roshan patel',
    photo: 'https://images.pexels.com/photos/29084948/pexels-photo-29084948/free-photo-of-portrait-of-man-in-studio-with-dramatic-lighting.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.8,
    reviews: 156,
    specializations: ['Engine Repair', 'Towing', 'Battery Service'],
    serviceFee: {
      min: 30,
      max: 100
    },
    location: {
      lat: 19.0760,
      lng: 72.8777
    },
    estimatedArrival: '15 mins',
    isOnline: true
  },
  {
    id: '2',
    name: 'Shahfaiz Khan',
    photo: 'https://images.pexels.com/photos/7073495/pexels-photo-7073495.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.9,
    reviews: 203,
    specializations: ['Flat Tire', 'Battery Service', 'Engine Repair'],
    serviceFee: {
      min: 25,
      max: 80
    },
    location: {
      lat: 19.0825,
      lng: 72.8824
    },
    estimatedArrival: '10 mins',
    isOnline: true
  }
];

const serviceTypes = [
  'Battery Jumpstart',
  'Towing',
  'Flat Tire',
  'Engine Repair',
  'Fuel Delivery',
  'Lockout Service'
];

function MapComponent({ center, zoom, mechanics, onMechanicSelect }: {
  center: google.maps.LatLngLiteral;
  zoom: number;
  mechanics: Mechanic[];
  onMechanicSelect: (mechanic: Mechanic) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [userMarker, setUserMarker] = useState<google.maps.Marker>();
  const [circle, setCircle] = useState<google.maps.Circle>();

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

      // Add user marker
      const marker = new google.maps.Marker({
        position: center,
        map: mapInstance,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#4F46E5",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        }
      });

      // Add radius circle
      const radiusCircle = new google.maps.Circle({
        map: mapInstance,
        center: center,
        radius: 2000, // 2km radius
        fillColor: "#4F46E5",
        fillOpacity: 0.1,
        strokeColor: "#4F46E5",
        strokeOpacity: 0.3,
        strokeWeight: 2
      });

      setMap(mapInstance);
      setUserMarker(marker);
      setCircle(radiusCircle);
    }

    return () => {
      markers.forEach(marker => marker.setMap(null));
      if (userMarker) userMarker.setMap(null);
      if (circle) circle.setMap(null);
    };
  }, [ref, map, center, zoom]);

  useEffect(() => {
    if (map && userMarker && circle) {
      userMarker.setPosition(center);
      circle.setCenter(center);
      map.panTo(center);
    }
  }, [center, map, userMarker, circle]);

  useEffect(() => {
    if (map) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));
      
      // Create new markers
      const newMarkers = mechanics.map(mechanic => {
        const marker = new google.maps.Marker({
          position: mechanic.location,
          map,
          icon: {
            url: mechanic.isOnline 
              ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
              : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }
        });

        marker.addListener('click', () => {
          onMechanicSelect(mechanic);
        });

        return marker;
      });

      setMarkers(newMarkers);
    }
  }, [map, mechanics, onMechanicSelect]);

  return <div ref={ref} className="w-full h-full rounded-lg" />;
}

function MechanicCard({ mechanic, onRequestHelp }: { 
  mechanic: Mechanic;
  onRequestHelp: (mechanic: Mechanic) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        <img
          src={mechanic.photo}
          alt={mechanic.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{mechanic.name}</h3>
            <span className={`px-2 py-1 rounded-full text-sm ${
              mechanic.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {mechanic.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          
          <div className="flex items-center mt-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-900">{mechanic.rating}</span>
            <span className="mx-1 text-gray-500">•</span>
            <span className="text-sm text-gray-500">{mechanic.reviews} reviews</span>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {mechanic.specializations.map((spec, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
              >
                {spec}
              </span>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">{mechanic.estimatedArrival}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="text-sm">${mechanic.serviceFee.min}-${mechanic.serviceFee.max}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => onRequestHelp(mechanic)}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Request Help
            </button>
            <a
              href={`tel:+1234567890`}
              className="p-2 text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Phone className="h-5 w-5" />
            </a>
            <a
              href={`https://wa.me/1234567890`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FindMechanic() {
  const [location, setLocation] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [minRating, setMinRating] = useState(4);
  const [maxPrice, setMaxPrice] = useState(100);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 19.0760, lng: 72.8777 });
  const [filteredMechanics, setFilteredMechanics] = useState(sampleMechanics);
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
  const [showQuickRequest, setShowQuickRequest] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const detectLocation = () => {
    if ('geolocation' in navigator) {
      setIsDetectingLocation(true);
      setLocationError(null);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          setIsDetectingLocation(false);

          // Get address using reverse geocoding
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: newLocation }, (results, status) => {
            if (status === 'OK' && results?.[0]) {
              setLocation(results[0].formatted_address);
            }
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsDetectingLocation(false);
          switch(error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Please enable location access to find nearby mechanics.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setLocationError("Location request timed out.");
              break;
            default:
              setLocationError("An unknown error occurred.");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  };

  const handleQuickRequest = () => {
    // Find nearest available mechanic
    const nearestMechanic = sampleMechanics
      .filter(m => m.isOnline)
      .sort((a, b) => {
        const distA = Math.sqrt(
          Math.pow(a.location.lat - userLocation.lat, 2) +
          Math.pow(a.location.lng - userLocation.lng, 2)
        );
        const distB = Math.sqrt(
          Math.pow(b.location.lat - userLocation.lat, 2) +
          Math.pow(b.location.lng - userLocation.lng, 2)
        );
        return distA - distB;
      })[0];

    if (nearestMechanic) {
      setSelectedMechanic(nearestMechanic);
      setShowQuickRequest(true);
    }
  };

  const handleRequestHelp = (mechanic: Mechanic) => {
    const whatsappMessage = `Hello, I need roadside assistance. My location: ${userLocation.lat},${userLocation.lng}`;
    window.open(`https://wa.me/1234567890?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  useEffect(() => {
    // Initial location detection
    detectLocation();
  }, []);

  useEffect(() => {
    let filtered = sampleMechanics;

    if (showOnlineOnly) {
      filtered = filtered.filter(m => m.isOnline);
    }

    if (selectedService) {
      filtered = filtered.filter(m => 
        m.specializations.some(s => s.toLowerCase().includes(selectedService.toLowerCase()))
      );
    }

    if (minRating > 0) {
      filtered = filtered.filter(m => m.rating >= minRating);
    }

    if (maxPrice < 100) {
      filtered = filtered.filter(m => m.serviceFee.min <= maxPrice);
    }

    setFilteredMechanics(filtered);
  }, [selectedService, minRating, maxPrice, showOnlineOnly]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Find a Mechanic</h2>
          <p className="mt-2 text-lg text-gray-600">Get immediate assistance from our network of verified mechanics</p>
        </div>

        {locationError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{locationError}</p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <button
            onClick={handleQuickRequest}
            className="w-full sm:w-auto bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <AlertTriangle className="h-5 w-5" />
            <span>Quick Request - Find Nearest Mechanic</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location"
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    onClick={detectLocation}
                    disabled={isDetectingLocation}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {isDetectingLocation ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                      <MapPin className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Services</option>
                  {serviceTypes.map((service) => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={minRating}
                    onChange={(e) => setMinRating(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600">{minRating}⭐</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Price
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600">${maxPrice}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Show Online Only</span>
                <button
                  onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showOnlineOnly ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showOnlineOnly ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredMechanics.map((mechanic) => (
                <MechanicCard
                  key={mechanic.id}
                  mechanic={mechanic}
                  onRequestHelp={handleRequestHelp}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-4 h-[calc(100vh-200px)]">
              {apiKey ? (
                <Wrapper
                  apiKey={apiKey}
                  version="beta"
                  libraries={["places"]}
                  render={status => {
                    switch (status) {
                      case 'LOADING':
                        return (
                          <div className="w-full h-full flex items-center justify-center">
                            <Loader className="h-8 w-8 animate-spin text-indigo-600" />
                          </div>
                        );
                      case 'FAILURE':
                        return (
                          <div className="w-full h-full flex items-center justify-center text-red-600">
                            Failed to load Google Maps
                          </div>
                        );
                      case 'SUCCESS':
                        return (
                          <MapComponent
                            center={userLocation}
                            zoom={14}
                            mechanics={filteredMechanics}
                            onMechanicSelect={setSelectedMechanic}
                          />
                        );
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Google Maps API key not configured
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}