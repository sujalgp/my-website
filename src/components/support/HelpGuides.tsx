import React from 'react';
import { BookOpen, MapPin, XCircle, UserCheck } from 'lucide-react';

const guides = [
  {
    title: 'How to Book a Mechanic?',
    icon: BookOpen,
    steps: [
      'Click on "Find a Mechanic" in the navigation menu',
      'Allow location access or enter your location manually',
      'Browse available mechanics near you',
      'Check ratings, reviews, and estimated arrival time',
      'Click "Request Help" to book the mechanic'
    ]
  },
  {
    title: 'How to Track My Request?',
    icon: MapPin,
    steps: [
      'After booking, you will see a live tracking interface',
      'View mechanic\'s real-time location on the map',
      'Check estimated arrival time',
      'Use the chat feature for communication',
      'Get notifications about request status'
    ]
  },
  {
    title: 'How to Cancel a Booking?',
    icon: XCircle,
    steps: [
      'Go to "My Requests" in the navigation menu',
      'Find the active booking you want to cancel',
      'Click the "Cancel Request" button',
      'Provide a reason for cancellation',
      'Confirm the cancellation'
    ]
  },
  {
    title: 'How to Become a Verified Mechanic?',
    icon: UserCheck,
    steps: [
      'Click on "Join as Mechanic" in the footer',
      'Fill out the application form',
      'Submit required documents for verification',
      'Complete the background check process',
      'Attend the onboarding session'
    ]
  }
];

export function HelpGuides() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900">
        Help Guides
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide) => (
          <div
            key={guide.title}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <guide.icon className="h-6 w-6 text-indigo-600" />
                <h3 className="ml-3 text-xl font-semibold text-gray-900">
                  {guide.title}
                </h3>
              </div>
              
              <ol className="space-y-3">
                {guide.steps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-600">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-indigo-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-indigo-900 mb-4">
          Need More Help?
        </h3>
        <p className="text-indigo-700">
          Our support team is available 24/7 to assist you. Contact us through:
        </p>
        <div className="mt-4 space-y-2 text-indigo-700">
          <p>📞 Phone: +91 8828864749</p>
          <p>📧 Email: kanojiyakaran89969@gmail.com</p>
          <p>💬 WhatsApp: Available for instant chat</p>
        </div>
      </div>
    </div>
  );
}