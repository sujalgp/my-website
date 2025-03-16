import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

export function WhatsAppSupport() {
  const [showTooltip, setShowTooltip] = useState(false);
  const phoneNumber = "918828864749";
  const message = "Hello, I need roadside assistance.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-4 md:bottom-6 md:right-6 bg-green-500 text-white p-5 rounded-full shadow-[0_4px_12px_rgba(0,200,0,0.3)] hover:bg-green-600 transition-all duration-200 flex items-center justify-center z-50 group"
      aria-label="Chat on WhatsApp"
      onTouchStart={() => setShowTooltip(true)}
      onTouchEnd={() => setShowTooltip(false)}
    >
      <MessageCircle className="h-7 w-7" />
      <span className={`absolute right-full mr-3 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg transition-all duration-200 whitespace-nowrap ${
        showTooltip ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
      } transform origin-right`}>
        Chat with Support
      </span>
    </a>
  );
}