import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, MapPin, Clock, Wrench, Truck } from 'lucide-react';
import { HelpRequestForm } from './HelpRequestForm';

export function Hero() {
  const [showHelpForm, setShowHelpForm] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl max-w-[80%] mx-auto lg:mx-0">
                  <span className="block xl:inline">24/7 Roadside</span>{' '}
                  <span className="block text-indigo-400 xl:inline">Assistance</span>
                </h1>
                <p className="mt-3 text-xl text-gray-300 sm:mt-5 sm:text-2xl sm:max-w-xl sm:mx-auto md:mt-5 md:text-2xl lg:mx-0 leading-relaxed max-w-[80%] mx-auto lg:mx-0">
                  Get immediate help for your vehicle breakdown. Our network of verified mechanics is ready to assist you anytime, anywhere.
                </p>
                <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-6 px-4 sm:px-0">
                  <button
                    onClick={() => navigate('/find-mechanic')}
                    className="w-full sm:w-auto flex items-center justify-center px-8 py-5 text-lg font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 transform hover:scale-105 transition-all duration-200 shadow-[0_4px_20px_rgba(99,102,241,0.3)] animate-pulse"
                  >
                    Find a Mechanic
                  </button>
                  
                  <button
                    onClick={() => setShowHelpForm(true)}
                    className="w-full sm:w-auto flex items-center justify-center px-8 py-5 text-lg font-semibold rounded-xl text-white bg-gray-800 border-3 border-indigo-500 hover:bg-indigo-900/30 transform hover:scale-105 transition-all duration-200 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                  >
                    Request Emergency Help
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Animated Right Section - Hidden on mobile */}
        <div className="hidden lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:flex items-center justify-center p-8">
          <div className="relative h-full flex items-center justify-center">
            <div className="grid grid-cols-2 gap-8">
              <div className="col-span-2 flex justify-center animate-float">
                <div className="relative bg-gray-800/50 p-6 rounded-full border border-gray-700">
                  <Truck className="h-32 w-32 text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]" />
                  <div className="absolute -top-2 -right-2 bg-red-500 h-4 w-4 rounded-full animate-blink shadow-lg"></div>
                </div>
              </div>

              <div className="relative animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="bg-gray-800/80 p-4 rounded-lg shadow-xl backdrop-blur-sm border border-gray-700">
                  <div className="flex items-center space-x-2">
                    <PhoneCall className="h-6 w-6 text-green-400" />
                    <span className="font-semibold text-gray-200">Help is on the way!</span>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rotate-45 w-4 h-4 bg-gray-800/80 border-r border-b border-gray-700"></div>
                </div>
              </div>

              <div className="flex justify-center animate-float" style={{ animationDelay: '1s' }}>
                <div className="bg-gray-800/50 p-4 rounded-full border border-gray-700">
                  <Wrench className="h-12 w-12 text-indigo-400" />
                </div>
              </div>

              <div className="flex justify-center animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="bg-gray-800/50 p-4 rounded-full border border-gray-700">
                  <MapPin className="h-12 w-12 text-red-400" />
                </div>
              </div>

              <div className="flex justify-center animate-float" style={{ animationDelay: '2s' }}>
                <div className="bg-gray-800/50 p-4 rounded-full border border-gray-700">
                  <Clock className="h-12 w-12 text-yellow-400 animate-spin-slow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showHelpForm && <HelpRequestForm onClose={() => setShowHelpForm(false)} />}
    </>
  );
}