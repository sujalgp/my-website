import React, { useState, useRef, useEffect } from 'react';
import { Bell, Clock, CheckCircle, AlertTriangle, DollarSign, MapPin, X, Filter, Car, Star, Loader, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'booking' | 'emergency' | 'service' | 'payment' | 'general';
  message: string;
  timestamp: Date;
  isRead: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onNotificationClick: (id: string) => void;
}

const getNotificationIcon = (type: Notification['type']) => {
  const iconProps = {
    className: "h-5 w-5",
    strokeWidth: 2
  };

  switch (type) {
    case 'booking':
      return <Car {...iconProps} className="h-5 w-5 text-blue-400" />;
    case 'emergency':
      return <AlertTriangle {...iconProps} className="h-5 w-5 text-red-400" />;
    case 'service':
      return <CheckCircle {...iconProps} className="h-5 w-5 text-green-400" />;
    case 'payment':
      return <DollarSign {...iconProps} className="h-5 w-5 text-yellow-400" />;
    case 'general':
      return <Star {...iconProps} className="h-5 w-5 text-orange-400" />;
  }
};

const formatTimestamp = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days === 1) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};

export function NotificationPanel({
  notifications,
  onClose,
  onMarkAllRead,
  onNotificationClick,
}: NotificationPanelProps) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [showExitAnimation, setShowExitAnimation] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setShowExitAnimation(true);
    setTimeout(onClose, 200);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchMove = (e: React.TouchEvent, notification: Notification) => {
    if (!touchStart) return;

    const deltaX = e.touches[0].clientX - touchStart.x;
    const deltaY = Math.abs(e.touches[0].clientY - touchStart.y);

    if (deltaY < 30) {
      if (deltaX < -50) {
        onNotificationClick(notification.id);
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const handleNotificationAction = (notification: Notification) => {
    onNotificationClick(notification.id);
    
    switch (notification.type) {
      case 'booking':
      case 'emergency':
        navigate('/my-requests');
        break;
      case 'payment':
        break;
      case 'service':
        navigate('/my-requests');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.isRead) || 
      (filter === 'read' && notification.isRead);

    const matchesSearch = searchTerm === '' || 
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div
      ref={panelRef}
      className={`fixed inset-x-0 top-16 md:absolute md:right-0 md:top-full md:left-auto md:mt-2 md:w-96 bg-[#232636] md:rounded-xl shadow-lg border border-gray-700 overflow-hidden z-50 transition-all duration-200 ${
        showExitAnimation ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
      }`}
    >
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-2 space-y-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notifications..."
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {(['all', 'unread', 'read'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === type
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            {notifications.some(n => !n.isRead) && (
              <button
                onClick={onMarkAllRead}
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-h-[calc(100vh-16rem)] md:max-h-[400px] overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Bell className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No notifications to show</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700/50">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onTouchStart={handleTouchStart}
                onTouchMove={(e) => handleTouchMove(e, notification)}
                onTouchEnd={handleTouchEnd}
                onClick={() => handleNotificationAction(notification)}
                className={`w-full p-4 text-left hover:bg-gray-700/20 transition-colors flex items-start space-x-3 group ${
                  !notification.isRead ? 'bg-gray-700/10' : ''
                }`}
              >
                <div className="flex-shrink-0 p-1 rounded-full bg-gray-800">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${!notification.isRead ? 'text-white font-medium' : 'text-gray-300'}`}>
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatTimestamp(notification.timestamp)}
                  </p>
                </div>
                {!notification.isRead && (
                  <span className="flex-shrink-0 h-2 w-2 mt-2 bg-indigo-400 rounded-full"></span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}