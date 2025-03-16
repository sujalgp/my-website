import React, { useState, useEffect } from 'react';
import { Upload, MapPin, Clock, Shield, Camera, Calendar, DollarSign, FileCheck, Loader, CheckCircle, ChevronDown } from 'lucide-react';
import { auth } from '../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

const serviceTypes = [
  'General Repair',
  'Towing Service',
  'Battery Service',
  'Tire Service',
  'Engine Repair',
  'Electrical Repair',
  'Fuel Delivery',
  'Lockout Service'
];

const availabilityOptions = [
  { id: '24-7', label: '24/7 Availability' },
  { id: 'weekdays', label: 'Weekdays Only' },
  { id: 'weekends', label: 'Weekends Only',  },
  { id: 'custom', label: 'Custom Hours' }
];

const inputStyles = "mt-1 block w-full rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 shadow-sm transition-colors duration-200";

const countryCodes = [
  { code: '+91', country: 'India' },
  { code: '+1', country: 'USA' },
  { code: '+44', country: 'UK' },
  { code: '+971', country: 'UAE' },
  { code: '+65', country: 'Singapore' }
];

export function RegisterMechanicPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [verificationError, setVerificationError] = useState<string>('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    otp: '',
    serviceTypes: [] as string[],
    experience: '',
    availability: [] as string[],
    customHours: '',
    baseCharge: '',
    location: {
      lat: 0,
      lng: 0,
      address: ''
    },
    about: '',
    vehicleInfo: '',
    documents: [] as string[]
  });

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
        'expired-callback': () => {
          setVerificationError('reCAPTCHA expired. Please try again.');
        }
      });
    }

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.country-dropdown')) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertificateFile(e.target.files[0]);
    }
  };

  const handleServiceTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(type)
        ? prev.serviceTypes.filter(t => t !== type)
        : [...prev.serviceTypes, type]
    }));
  };

  const handleAvailabilityToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(id)
        ? prev.availability.filter(a => a !== id)
        : [...prev.availability, id]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: cleaned }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const detectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: 'Location detected'
            }
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned);
  };

  const sendOTP = async () => {
    try {
      if (!validatePhoneNumber(formData.phone)) {
        setVerificationError('Please enter a valid 10-digit Indian mobile number');
        return;
      }

      setIsVerifyingOTP(true);
      setVerificationError('');

      const formattedPhone = `${selectedCountry.code}${formData.phone}`;
      
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );

      setConfirmationResult(confirmation);
      setOtpSent(true);
      
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 100, 50]);
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      setVerificationError(error.message || 'Error sending OTP. Please try again.');
      
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const verifyOTP = async () => {
    if (!confirmationResult) {
      setVerificationError('Please request OTP first');
      return;
    }

    try {
      setIsVerifyingOTP(true);
      setVerificationError('');

      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }

      await confirmationResult.confirm(formData.otp);
      
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 100, 50]);
      }

      setStep(2);
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      setVerificationError(error.message || 'Invalid OTP. Please try again.');
      
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep(4);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
        <p className="mt-2 text-gray-600">Let's start with your personal details</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {profileImagePreview ? (
              <img
                src={profileImagePreview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
            <Camera className="h-4 w-4" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className={inputStyles}
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <div className="mt-1 relative flex">
          <div className="country-dropdown relative">
            <button
              type="button"
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              className="h-[42px] flex items-center px-3 bg-gray-50 border border-gray-300 border-r-0 rounded-l-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <span className="text-gray-900 font-medium">{selectedCountry.code}</span>
              <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
            </button>
            
            {showCountryDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                {countryCodes.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      setSelectedCountry(country);
                      setShowCountryDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <span className="font-medium">{country.code}</span>
                    <span className="text-gray-600">{country.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`${inputStyles} rounded-l-none flex-1`}
            placeholder="Enter mobile number"
            maxLength={10}
            pattern="[6-9]\d{9}"
            title="Please enter a valid mobile number"
          />
          
          {formData.phone && validatePhoneNumber(formData.phone) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          )}
        </div>
        
        {formData.phone && !validatePhoneNumber(formData.phone) && (
          <p className="mt-1 text-sm text-red-600">
            Please enter a valid mobile number
          </p>
        )}
        
        <div className="mt-2">
          <button
            onClick={sendOTP}
            disabled={isVerifyingOTP || otpSent || !validatePhoneNumber(formData.phone)}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
          >
            {isVerifyingOTP ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : otpSent ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              'Send OTP'
            )}
          </button>
        </div>
      </div>

      {otpSent && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
          <div className="mt-1 flex space-x-2">
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleInputChange}
              maxLength={6}
              className={`${inputStyles} text-center tracking-widest text-xl`}
              placeholder="• • • • • •"
            />
            <button
              onClick={verifyOTP}
              disabled={isVerifyingOTP || formData.otp.length !== 6}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px] shadow-sm"
            >
              {isVerifyingOTP ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                'Verify'
              )}
            </button>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Didn't receive OTP?{' '}
              <button
                onClick={sendOTP}
                disabled={isVerifyingOTP}
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Resend
              </button>
            </p>
            {verificationError && (
              <p className="text-sm text-red-600">{verificationError}</p>
            )}
          </div>
        </div>
      )}

      <div id="recaptcha-container"></div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Service Details</h2>
        <p className="mt-2 text-gray-600">Tell us about your services and expertise</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Types
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {serviceTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleServiceTypeToggle(type)}
              className={`flex items-center justify-center px-4 py-2 rounded-lg border-2 transition-all ${
                formData.serviceTypes.includes(type)
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 hover:border-indigo-500'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
        <input
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleInputChange}
          className={inputStyles}
          placeholder="Enter years of experience"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Availability
        </label>
        <div className="grid grid-cols-2 gap-3">
          {availabilityOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAvailabilityToggle(option.id)}
              className={`flex items-center justify-center px-4 py-2 rounded-lg border-2 transition-all ${
                formData.availability.includes(option.id)
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 hover:border-indigo-500'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {formData.availability.includes('custom') && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Custom Hours</label>
          <input
            type="text"
            name="customHours"
            value={formData.customHours}
            onChange={handleInputChange}
            className={inputStyles}
            placeholder="e.g., Mon-Fri 9AM-6PM"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Base Service Charge (₹)</label>
        <input
          type="number"
          name="baseCharge"
          value={formData.baseCharge}
          onChange={handleInputChange}
          className={inputStyles}
          placeholder="Enter your base service charge"
        />
      </div>

      <button
        onClick={() => setStep(3)}
        className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Continue
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>
        <p className="mt-2 text-gray-600">Help customers know you better</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">About You</label>
        <textarea
          name="about"
          value={formData.about}
          onChange={handleInputChange}
          rows={4}
          className={inputStyles}
          placeholder="Tell us about your experience and expertise..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Vehicle Information</label>
        <input
          type="text"
          name="vehicleInfo"
          value={formData.vehicleInfo}
          onChange={handleInputChange}
          className={inputStyles}
          placeholder="e.g., Service Van, Tow Truck, etc."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Service Location</label>
        <div className="mt-1 flex space-x-2">
          <input
            type="text"
            value={formData.location.address}
            readOnly
            className={inputStyles}
            placeholder="Your service area"
          />
          <button
            onClick={detectLocation}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
          >
            <MapPin className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Certificates</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <span>Upload certificates</span>
                <input
                  type="file"
                  className="sr-only"
                  onChange={handleCertificateChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
            {certificateFile && (
              <p className="text-sm text-indigo-600 mt-2">
                Selected: {certificateFile.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <Loader className="animate-spin h-5 w-5 mr-2" />
            Submitting...
          </span>
        ) : (
          'Submit Registration'
        )}
      </button>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
      <p className="text-gray-600 mb-8">
        Your registration is being reviewed. We'll notify you once it's approved.
      </p>
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900">What's Next?</h3>
          <ul className="mt-2 text-sm text-gray-600 space-y-1">
            <li>• Our team will verify your details</li>
            <li>• You'll receive an email confirmation</li>
            <li>• Once approved, you can start accepting service requests</li>
          </ul>
        </div>
        <button
          onClick={() => window.location.href = '/'}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Return to Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {step < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    s <= step
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </div>
              ))}
              <div className="absolute left-0 right-0 h-0.5 bg-gray-200 -z-10">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderSuccess()}
        </div>
      </div>
    </div>
  );
}