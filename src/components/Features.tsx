import React from 'react';
import { MapPin, Clock, Shield, Phone, Check } from 'lucide-react';

const features = [
  {
    name: 'Real-time Location Tracking',
    description: 'Track your mechanic\'s location in real-time as they head to your breakdown location.',
    icon: MapPin,
    color: 'text-blue-400',
    bg: 'bg-blue-900/30',
  },
  {
    name: '24/7 Availability',
    description: 'Our network of mechanics is available round the clock to assist you with any vehicle emergency.',
    icon: Clock,
    color: 'text-green-400',
    bg: 'bg-green-900/30',
  },
  {
    name: 'Verified Mechanics',
    description: 'All mechanics are thoroughly vetted and verified for your safety and peace of mind.',
    icon: Shield,
    color: 'text-purple-400',
    bg: 'bg-purple-900/30',
  },
  {
    name: 'Instant Support',
    description: 'Get immediate assistance through our WhatsApp support with Karan.',
    icon: Phone,
    color: 'text-red-400',
    bg: 'bg-red-900/30',
  },
];

export function Features() {
  return (
    <div className="py-16 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-400 font-semibold tracking-wide uppercase">
            Features
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Why Choose VBAMS?
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto">
            We provide comprehensive roadside assistance with cutting-edge features to ensure you're never stranded.
          </p>
        </div>

        <div className="mt-16">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative bg-gray-800 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border border-gray-700">
                <div className={`absolute flex items-center justify-center h-12 w-12 rounded-full ${feature.bg} ${feature.color}`}>
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-100">{feature.name}</p>
                <p className="mt-2 ml-16 text-base text-gray-300">{feature.description}</p>
                <div className="mt-4 ml-16 flex items-center text-indigo-400">
                  <Check className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Available Now</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}