import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WrenchIcon, MenuIcon, BellIcon, X, Home, FileText, HelpCircle, Loader, UserPlus } from 'lucide-react';
import { NotificationPanel } from './NotificationPanel';

interface Notification {
  id: string;
  type: 'booking' | 'emergency' | 'service' | 'payment' | 'general';
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'booking',
      message: 'Your mechanic is on the way 🚗 ETA: 15 mins',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isRead: false
    },
    {
      id: '2',
      type: 'emergency',
      message: 'Emergency help request received! 🚨',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      isRead: false
    },
    {
      id: '3',
      type: 'service',
      message: 'Your vehicle repair is completed 🔧',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: true
    }
  ]);

  const isActive = (path: string) => location.pathname === path;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const menuItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/find-mechanic', label: 'Find Mechanic', icon: WrenchIcon },
    { path: '/my-requests', label: 'My Requests', icon: FileText },
    { path: '/support', label: 'Support', icon: HelpCircle },
    { path: '/register-mechanic', label: 'Become a Mechanic', icon: UserPlus },
  ];

  const handleNotificationClick = async (id: string) => {
    setIsLoading(true);
    
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    
    setIsLoading(false);
  };

  const handleMarkAllRead = async () => {
    setIsLoading(true);
    
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 50, 30]);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
    
    setIsLoading(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    
    const timer = setTimeout(() => {
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      setShowNotifications(true);
    }, 500);
    
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (longPressTimer) {
      const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
      const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
      
      if (deltaX > 10 || deltaY > 10) {
        clearTimeout(longPressTimer);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notifications-container')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <WrenchIcon className="h-8 w-8 text-indigo-500" />
              <span className="ml-2 text-xl font-bold text-white">VBAMS</span>
            </Link>
            
            <div className="hidden md:flex md:ml-10">
              {menuItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-white bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="notifications-container relative">
              <button
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                onClick={() => setShowNotifications(!showNotifications)}
                disabled={isLoading}
                className={`fixed md:relative bottom-20 right-4 md:bottom-auto md:right-auto z-50 p-4 md:p-2 rounded-full md:rounded-lg transition-all duration-200 ${
                  showNotifications
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                } ${
                  unreadCount > 0 ? 'animate-pulse' : ''
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg md:shadow-none`}
              >
                {isLoading ? (
                  <Loader className="h-6 w-6 animate-spin" />
                ) : (
                  <BellIcon className="h-6 w-6" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-red-500 text-white text-xs">
                      {unreadCount}
                    </span>
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationPanel
                  notifications={notifications}
                  onClose={() => setShowNotifications(false)}
                  onMarkAllRead={handleMarkAllRead}
                  onNotificationClick={handleNotificationClick}
                />
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-3">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                  isActive(item.path)
                    ? 'text-white bg-gray-800'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}