import React, { useState } from 'react';
import { FAQSection } from '../components/support/FAQSection';
import { ContactForm } from '../components/support/ContactForm';
import { HelpGuides } from '../components/support/HelpGuides';
import { Phone, Mail, MessageCircle, Clock, FileQuestion, Users } from 'lucide-react';

export function SupportPage() {
  const [activeTab, setActiveTab] = useState('faqs');

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
              How can we help you?
            </h1>
            <p className="mt-4 text-xl text-gray-300">
              Get instant support through our various channels
            </p>
          </div>

          {/* Quick Contact Cards */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* WhatsApp Support */}
            <a
              href="https://wa.me/918828864749"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800 transition-all duration-200 group"
            >
              <MessageCircle className="h-8 w-8 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white">WhatsApp Support</h3>
              <p className="mt-2 text-gray-400">Get instant help via WhatsApp</p>
              <div className="mt-4 flex items-center text-green-400">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">Response within 5 minutes</span>
              </div>
            </a>

            {/* Phone Support */}
            <a
              href="tel:+918828864749"
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800 transition-all duration-200"
            >
              <Phone className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white">Phone Support</h3>
              <p className="mt-2 text-gray-400">Call our 24/7 helpline</p>
              <p className="mt-4 text-blue-400">+91 8828864749</p>
            </a>

            {/* Email Support */}
            <a
              href="mailto:kanojiyakaran89969@gmail.com"
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800 transition-all duration-200"
            >
              <Mail className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white">Email Support</h3>
              <p className="mt-2 text-gray-400">Send us your queries</p>
              <p className="mt-4 text-purple-400">kanojiyakaran89969@gmail.com</p>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-6 py-3 text-lg font-medium rounded-t-lg transition-colors ${
              activeTab === 'faqs'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <FileQuestion className="h-5 w-5 mr-2" />
              FAQs
            </div>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 text-lg font-medium rounded-t-lg transition-colors ${
              activeTab === 'contact'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Contact Support
            </div>
          </button>
          <button
            onClick={() => setActiveTab('guides')}
            className={`px-6 py-3 text-lg font-medium rounded-t-lg transition-colors ${
              activeTab === 'guides'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Help Guides
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'faqs' && <FAQSection />}
          {activeTab === 'contact' && <ContactForm />}
          {activeTab === 'guides' && <HelpGuides />}
        </div>
      </div>
    </div>
  );
}