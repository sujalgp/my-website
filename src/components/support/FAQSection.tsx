import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
  category: string;
  questions: {
    question: string;
    answer: string;
  }[];
}

const faqs: FAQ[] = [
  {
    category: 'General',
    questions: [
      {
        question: 'What is VBAMS?',
        answer: 'VBAMS (Vehicle Breakdown Assistance Management System) is a 24/7 roadside assistance service that connects you with verified mechanics when you need help with your vehicle.'
      },
      {
        question: 'How does VBAMS work?',
        answer: 'VBAMS uses your location to find the nearest available mechanic. You can request help through our app, and a verified mechanic will be dispatched to your location.'
      }
    ]
  },
  {
    category: 'Service Requests',
    questions: [
      {
        question: 'How do I request a mechanic?',
        answer: 'Click on the "Find a Mechanic" button, allow location access, and choose from available mechanics nearby. You can also use the "Quick Request" feature for immediate assistance.'
      },
      {
        question: 'What services are available?',
        answer: 'We offer various services including battery jumpstart, towing, flat tire change, engine repair, fuel delivery, and lockout assistance.'
      }
    ]
  },
  {
    category: 'Payments & Billing',
    questions: [
      {
        question: 'What payment methods are accepted?',
        answer: 'We accept all major payment methods including cash, credit/debit cards, UPI, and digital wallets.'
      },
      {
        question: 'How is the service fee calculated?',
        answer: 'Service fees vary based on the type of service, distance, and time of day. You will see an estimated price range before confirming your request.'
      }
    ]
  },
  {
    category: 'Emergency Help',
    questions: [
      {
        question: 'What should I do if no mechanic is available?',
        answer: 'In such cases, our support team will help you find alternative solutions or contact our partner network. You can reach us 24/7 at +91 8828864749.'
      },
      {
        question: 'Is the service available 24/7?',
        answer: 'Yes, VBAMS operates 24/7, including holidays. You can request assistance anytime, anywhere.'
      }
    ]
  }
];

export function FAQSection() {
  const [openCategories, setOpenCategories] = useState<string[]>([faqs[0].category]);
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setOpenCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleQuestion = (question: string) => {
    setOpenQuestions(prev =>
      prev.includes(question)
        ? prev.filter(q => q !== question)
        : [...prev, question]
    );
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900">
        Frequently Asked Questions
      </h2>
      
      <div className="space-y-6">
        {faqs.map((category) => (
          <div
            key={category.category}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <button
              onClick={() => toggleCategory(category.category)}
              className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <h3 className="text-xl font-semibold text-gray-900">
                {category.category}
              </h3>
              {openCategories.includes(category.category) ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {openCategories.includes(category.category) && (
              <div className="px-6 py-4 space-y-4">
                {category.questions.map((faq) => (
                  <div key={faq.question} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                    <button
                      onClick={() => toggleQuestion(faq.question)}
                      className="w-full text-left flex items-center justify-between py-2"
                    >
                      <span className="text-lg font-medium text-gray-900">
                        {faq.question}
                      </span>
                      {openQuestions.includes(faq.question) ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    
                    {openQuestions.includes(faq.question) && (
                      <p className="mt-2 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}