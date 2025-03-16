import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Camera, Upload, AlertCircle, X, Loader, Phone, Car, User, Clock, Navigation } from 'lucide-react';
import { LiveTracking } from './LiveTracking';
import { ChatSupport } from './ChatSupport';

const vehicleTypes = ['Car', 'Bike', 'Truck', 'Bus', 'Other'];
const issueTypes = ['Flat Tire', 'Engine Failure', 'Battery Dead', 'Out of Fuel', 'Accident', 'Other'];

interface HelpRequestFormProps {
  onClose: () => void;
}

interface MechanicDetails {
  name: string;
  vehicle: string;
  phone: string;
  eta: string;
  progress: number;
  status: 'Assigned' | 'En Route' | 'Reached Location' | 'Service Started' | 'Service Completed';
}

export function HelpRequestForm({ onClose }: HelpRequestFormProps) {
  const [location, setLocation] = useState({ lat: '', lng: '', address: '' });
  const [urgency, setUrgency] = useState('high');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [showFullForm, setShowFullForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleType: '',
    registration: '',
    issueType: '',
    notes: ''
  });
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [showExitAnimation, setShowExitAnimation] = useState(false);
  const [mechanicDetails, setMechanicDetails] = useState<MechanicDetails>({
    name: 'Shahfaiz Khan',
    vehicle: 'Hero Splendor',
    phone: '+91 9137214680',
    eta: '15 minutes',
    progress: 25,
    status: 'En Route'
  });

  const detectLocation = () => {
    if ('geolocation' in navigator) {
      setIsDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString(),
            address: 'Location detected'
          });
          setIsDetectingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsDetectingLocation(false);
        }
      );
    }
  };

  const handleSOSSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setRequestSubmitted(true);
  };

  const handleClose = () => {
    setShowExitAnimation(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleTrackLocation = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`, '_blank');
  };

  const handleFullFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setRequestSubmitted(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(prev => ({
      ...prev,
      address: e.target.value
    }));
  };

  if (requestSubmitted) {
    return (
      <div className={`fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${showExitAnimation ? 'opacity-0' : 'opacity-100'}`}>
        <div className="bg-[#2A2D3E] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Help is on the way! 🚀</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mechanic Details Card */}
            <div className="bg-gray-800/50 rounded-lg p-6 mb-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-white">{mechanicDetails.name}</h3>
                  <div className="flex items-center text-gray-300">
                    <Car className="h-4 w-4 mr-1" />
                    <span>{mechanicDetails.vehicle}</span>
                  </div>
                </div>
              </div>

              {/* Status and ETA */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>{mechanicDetails.status}</span>
                    <span>ETA: {mechanicDetails.eta}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${mechanicDetails.progress}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href={`tel:${mechanicDetails.phone.replace(/\s+/g, '')}`}
                    className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Call Mechanic
                  </a>
                  <button
                    onClick={handleTrackLocation}
                    className="flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Navigation className="h-5 w-5 mr-2" />
                    Track Location
                  </button>
                </div>
              </div>
            </div>

            <LiveTracking requestId="123" mechanicPhone={mechanicDetails.phone.replace(/\s+/g, '')} />
            <ChatSupport requestId="123" mechanicName={mechanicDetails.name} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${showExitAnimation ? 'opacity-0' : 'opacity-100'}`}>
      <div className="bg-[#2A2D3E] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Request Roadside Assistance</h2>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {!showFullForm ? (
            <div className="space-y-6">
              <div className="p-6 border-2 border-red-500/50 rounded-xl bg-red-500/10 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-2" />
                  Need Immediate Help?
                </h3>
                <button
                  onClick={handleSOSSubmit}
                  disabled={isLoading}
                  className="w-full bg-red-600 text-white px-6 py-4 rounded-xl font-medium text-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(239,68,68,0.3)]"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader className="animate-spin h-5 w-5 mr-2" />
                      Sending SOS...
                    </span>
                  ) : (
                    '🆘 Send SOS - Get Immediate Help'
                  )}
                </button>
              </div>
              
              <div className="text-center">
                <span className="px-4 py-2 text-gray-400">or</span>
              </div>

              <button
                onClick={() => setShowFullForm(true)}
                className="w-full bg-indigo-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] shadow-[0_4px_20px_rgba(99,102,241,0.3)]"
              >
                Fill Detailed Request Form
              </button>
            </div>
          ) : (
            <form onSubmit={handleFullFormSubmit} className="space-y-6">
              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400"
                    placeholder="Your Phone Number"
                  />
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">Vehicle Type</label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                  >
                    <option value="">Select Vehicle Type</option>
                    {vehicleTypes.map(type => (
                      <option key={type} value={type.toLowerCase()}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">Vehicle Registration</label>
                  <input
                    type="text"
                    name="registration"
                    value={formData.registration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400"
                    placeholder="Registration Number"
                  />
                </div>
              </div>

              {/* Issue Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Issue Type</label>
                <select
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                >
                  <option value="">Select Issue Type</option>
                  {issueTypes.map(type => (
                    <option key={type} value={type.toLowerCase()}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">Location</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={location.address}
                    onChange={handleLocationChange}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-600 bg-gray-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400"
                    placeholder="Your Location"
                  />
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={isDetectingLocation}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDetectingLocation ? (
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      <MapPin className="h-4 w-4 mr-2" />
                    )}
                    {isDetectingLocation ? 'Detecting...' : 'Detect'}
                  </button>
                </div>
              </div>

              {/* Urgency Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Urgency Level</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setUrgency('high')}
                    className={`flex items-center justify-center px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                      urgency === 'high'
                        ? 'border-red-500 bg-red-500/20 text-red-400 shadow-lg transform scale-[1.02]'
                        : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-red-500 hover:bg-red-500/20'
                    }`}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    High
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('medium')}
                    className={`flex items-center justify-center px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                      urgency === 'medium'
                        ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400 shadow-lg transform scale-[1.02]'
                        : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-yellow-500 hover:bg-yellow-500/20'
                    }`}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Medium
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('low')}
                    className={`flex items-center justify-center px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                      urgency === 'low'
                        ? 'border-green-500 bg-green-500/20 text-green-400 shadow-lg transform scale-[1.02]'
                        : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-green-500 hover:bg-green-500/20'
                    }`}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Low
                  </button>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-400"
                  placeholder="Describe your issue in detail..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Upload Images</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg hover:border-indigo-500 transition-colors bg-gray-700/30">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-400">
                      <label className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    {selectedFile && (
                      <p className="text-sm text-indigo-400 mt-2">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(99,102,241,0.3)]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Request'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}