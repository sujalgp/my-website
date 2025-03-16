import React, { useState } from 'react';
import { MessageCircle, Star, Clock, MapPin, CreditCard, PenTool as Tool, User, ChevronDown, ChevronUp, Wrench } from 'lucide-react';

const testimonials = [
  {
    name: "Arjun Kanojiya",
    rating: 5,
    comment: "Quick and reliable service! The mechanic arrived within 15 minutes. Highly recommend VBAMS for any vehicle emergency.",
    date: "2 days ago",
    avatar: "https://thumbs.dreamstime.com/b/smiling-indian-man-looking-camera-mature-wearing-spectacles-portrait-middle-eastern-confident-businessman-office-195195079.jpg?w=360"
  },
  {
    name: "Somaiya Soni",
    rating: 4,
    comment: "Professional service and transparent pricing. The mechanic was knowledgeable and fixed my car on the spot.",
    date: "1 week ago",
    avatar: "https://thumbs.dreamstime.com/b/asian-indian-businessman-good-looking-mature-business-suit-smiling-isolated-white-background-portrait-handsome-31871432.jpg?w=360"
  },
  {
    name: "Radhika Shing",
    rating: 5,
    comment: "Amazing experience! The app is easy to use and the service was outstanding. Will definitely use again.",
    date: "3 days ago",
    avatar: "https://thumbs.dreamstime.com/b/close-up-headshot-portrait-young-s-indian-woman-pose-look-camera-feel-optimistic-profile-picture-smiling-millennial-mixed-211140257.jpg"
  }
];

const faqs = [
  {
    question: "How do I request roadside assistance?",
    answer: "Simply open the VBAMS app, click 'Find Mechanic', share your location, and select the type of service you need. A nearby mechanic will be assigned to help you immediately."
  },
  {
    question: "How long does it take for a mechanic to arrive?",
    answer: "Our average response time is 15-30 minutes, depending on your location and traffic conditions. You can track your mechanic's location in real-time through the app."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept all major payment methods including credit/debit cards, UPI, digital wallets, and cash. Payment can be made securely through the app or directly to the mechanic."
  },
  {
    question: "What types of vehicles do you service?",
    answer: "We service all types of vehicles including cars, bikes, trucks, and buses. Our mechanics are trained to handle various makes and models."
  }
];

const steps = [
  {
    icon: Tool,
    title: "Choose Service",
    description: "Select the type of service you need from our wide range of options"
  },
  {
    icon: MapPin,
    title: "Share Location",
    description: "Allow location access or manually enter your breakdown location"
  },
  {
    icon: User,
    title: "Get Mechanic",
    description: "A verified mechanic will be assigned and arrive at your location"
  },
  {
    icon: CreditCard,
    title: "Pay Securely",
    description: "Make secure payment through our platform after service completion"
  }
];

export function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{text: string, sender: 'user' | 'bot', timestamp: Date}>>([
    {
      text: "👋 Hi! How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    setChatMessages(prev => [...prev, {
      text: message,
      sender: 'user',
      timestamp: new Date()
    }]);

    // Simulate bot response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        text: "Thanks for reaching out! One of our support agents will get back to you shortly. For immediate assistance, please call us at +91 8828864749.",
        sender: 'bot',
        timestamp: new Date()
      }]);
    }, 1000);

    setMessage('');
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* How VBAMS Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">How VBAMS Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-200">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="bg-indigo-600 rounded-full p-4">
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mt-4">{step.title}</h3>
                  <p className="mt-2 text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-indigo-600"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-200">
                <div className="flex items-start mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                    <div className="flex items-center mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-sm text-gray-400">{testimonial.date}</span>
                </div>
                <p className="text-gray-300">{testimonial.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="text-lg font-medium text-white">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 py-4 bg-gray-800/30">
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Animated Support Assistant */}
        <div className="fixed bottom-24 right-6 z-50">
          <button
            onClick={() => setShowChat(!showChat)}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
            <div className="relative bg-gray-900 rounded-full p-4 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-white animate-bounce" />
            </div>
          </button>
        </div>

        {/* Chat Widget */}
        {showChat && (
          <div className="fixed bottom-40 right-6 w-96 bg-white rounded-xl shadow-2xl z-50">
            <div className="p-4 bg-indigo-600 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center">
                <MessageCircle className="h-6 w-6 text-white" />
                <span className="ml-2 text-white font-medium">Chat Support</span>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}