export interface User {
  id: string;
  name: string;
  email: string;
  role: 'driver' | 'mechanic' | 'admin';
  location?: {
    lat: number;
    lng: number;
  };
}

export interface ServiceRequest {
  id: string;
  userId: string;
  mechanicId?: string;
  status: 'pending' | 'accepted' | 'inProgress' | 'completed';
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  vehicleType: string;
  createdAt: Date;
}

export interface Mechanic {
  id: string;
  name: string;
  expertise: string[];
  rating: number;
  available: boolean;
  location: {
    lat: number;
    lng: number;
  };
}

export interface Notification {
  id: string;
  type: 'booking' | 'emergency' | 'service' | 'payment' | 'general';
  message: string;
  timestamp: Date;
  isRead: boolean;
  userId: string;
  relatedId?: string;
  priority: 'low' | 'medium' | 'high';
}