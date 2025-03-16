import React, { useState } from 'react';
import { Search, Filter, Star, MapPin, Phone, MessageCircle, FileText, Calendar, Clock, AlertCircle } from 'lucide-react';
import { LiveTracking } from '../components/LiveTracking';
import { ChatSupport } from '../components/ChatSupport';

interface Request {
  id: string;
  serviceType: string;
  mechanicName: string;
  mechanicPhone: string;
  status: 'pending' | 'accepted' | 'inProgress' | 'completed' | 'cancelled';
  eta?: string;
  date: string;
  location: string;
  amount?: number;
  rating?: number;
  description: string;
}

const sampleRequests: Request[] = [
  {
    id: 'REQ001',
    serviceType: 'Towing',
    mechanicName: 'Jay sheety',
    mechanicPhone: '918828864749',
    status: 'inProgress',
    eta: '15 mins',
    date: '2024-03-15 14:30',
    location: 'Mumbai Central',
    amount: 1500,
    description: 'Vehicle broke down on highway'
  },
  {
    id: 'REQ002',
    serviceType: 'Tire Change',
    mechanicName: 'Abhishek Gupta',
    mechanicPhone: '918828864749',
    status: 'completed',
    date: '2024-03-14 09:15',
    location: 'Andheri West',
    amount: 800,
    rating: 5,
    description: 'Flat tire replacement'
  }
];

export function MyRequestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const filteredRequests = sampleRequests.filter(request => {
    const matchesSearch = 
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.mechanicName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSubmitReview = () => {
    // Here you would typically submit the review to your backend
    console.log('Submitting review:', { rating, review });
    setShowReviewModal(false);
    setRating(0);
    setReview('');
  };

  const handleCancelRequest = (requestId: string) => {
    // Here you would typically make an API call to cancel the request
    console.log('Cancelling request:', requestId);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
          
          {/* Search and Filters */}
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="inProgress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-gray-900">
                        {request.serviceType}
                      </span>
                      <span className="text-sm text-gray-500">
                        #{request.id}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(request.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {request.location}
                      </div>
                      {request.amount && (
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          ₹{request.amount}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : request.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : request.status === 'inProgress'
                          ? 'bg-blue-100 text-blue-800'
                          : request.status === 'accepted'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(request.mechanicName)}&background=random`}
                        alt={request.mechanicName}
                        className="h-8 w-8 rounded-full"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {request.mechanicName}
                      </span>
                    </div>
                    {request.eta && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        ETA: {request.eta}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {request.status === 'inProgress' && (
                      <>
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          Track
                        </button>
                        <a
                          href={`tel:${request.mechanicPhone}`}
                          className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </a>
                        <a
                          href={`https://wa.me/${request.mechanicPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Chat
                        </a>
                      </>
                    )}
                    
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleCancelRequest(request.id)}
                        className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    
                    {request.status === 'completed' && !request.rating && (
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Star className="h-4 w-4 mr-1" />
                        Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Live Tracking Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Track Request #{selectedRequest.id}
                </h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <LiveTracking
                requestId={selectedRequest.id}
                mechanicPhone={selectedRequest.mechanicPhone}
              />
              <ChatSupport
                requestId={selectedRequest.id}
                mechanicName={selectedRequest.mechanicName}
              />
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Rate Your Experience
                </h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-1 ${
                          rating >= star ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        <Star className="h-8 w-8 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Share your experience..."
                  />
                </div>

                <button
                  onClick={handleSubmitReview}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}