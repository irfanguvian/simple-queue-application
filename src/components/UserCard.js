'use client';

import { useState } from 'react';
import { useQueue } from '@/contexts/QueueContext';
import classNames from 'classnames';

export default function UserCard({ user }) {
  const { checkStatus, enterQueueRoom, removeUser } = useQueue();
  const [isChecking, setIsChecking] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      await checkStatus(user.id);
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleJoinRoom = async () => {
    setIsJoining(true);
    try {
      await enterQueueRoom(user.id);
    } catch (error) {
      console.error('Error joining room:', error);
    } finally {
      setIsJoining(false);
    }
  };

  // Calculate time since last check
  const getTimeSinceLastCheck = () => {
    if (!user.lastChecked) return null;
    
    const lastChecked = new Date(user.lastChecked);
    const now = new Date();
    const diffMs = now - lastChecked;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    
    if (diffSecs < 60) {
      return `${diffSecs} second${diffSecs !== 1 ? 's' : ''} ago`;
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else {
      return lastChecked.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    }
  };

  // Define card background colors based on status
  const statusColors = {
    start: 'bg-gray-100 border-gray-300',
    checking: 'bg-yellow-100 border-yellow-300',
    available: 'bg-yellow-100 border-yellow-300',
    joined: 'bg-green-100 border-green-300',
    not_eligible: 'bg-red-100 border-red-300'
  };

  // Define status badge colors
  const badgeColors = {
    start: 'bg-gray-200 text-gray-900',
    checking: 'bg-yellow-200 text-yellow-900',
    available: 'bg-yellow-200 text-yellow-900',
    joined: 'bg-green-500 text-white',
    not_eligible: 'bg-red-500 text-white'
  };

  // Get display text for status
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'start': return 'Queueing';
      case 'checking': return 'In Queue';
      case 'available': return 'Available';
      case 'joined': return 'Joined Room';
      case 'not_eligible': return 'Not Eligible';
      default: return status;
    }
  };

  const timeSinceLastCheck = getTimeSinceLastCheck();

  return (
    <div className={classNames(
      'border rounded-lg p-3 sm:p-4 shadow-sm transition-all h-full',
      statusColors[user.status] || 'bg-gray-50 border-gray-200'
    )}>
      <div className="flex justify-between items-start">
        <div className="w-full pr-5">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 break-all">
            User #{user.id.slice(0, 5)}
          </h3>
          <p className="text-sm sm:text-base font-medium text-gray-800 mb-1 sm:mb-2 break-all">
            Product: {user.productCode}
          </p>
          
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2 sm:mb-3">
            <span className={classNames(
              'px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm rounded-full font-bold whitespace-nowrap',
              badgeColors[user.status]
            )}>
              {getStatusDisplay(user.status)}
            </span>
          </div>
          
          {user.lastChecked && (
            <div className="mb-2 sm:mb-3 flex items-center">
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                Last checked: 
                <span className="ml-1 font-bold text-gray-800">{timeSinceLastCheck}</span>
              </span>
              {user.lastChecked && (
                <span className="ml-2 text-xs text-gray-500">
                  ({new Date(user.lastChecked).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})
                </span>
              )}
            </div>
          )}
          
          {user.isAvailable && user.status !== 'joined' && (
            <p className="text-sm sm:text-base font-bold text-green-600 mb-1 sm:mb-2">
              ✓ Room is available now!
            </p>
          )}

          {user.message && (
            <p className={classNames(
              "text-sm sm:text-base font-medium mb-1 sm:mb-2 line-clamp-2",
              user.joinSuccess ? "text-green-600" : "text-red-600"
            )}>
              {user.message}
            </p>
          )}

          {user.estimatedTime !== null && (
            <p className="text-sm sm:text-base font-medium text-gray-800 mb-1 sm:mb-2">
              Est. wait: <strong>{user.estimatedTime}</strong> min
            </p>
          )}
          
          {user.joinedAt && (
            <p className="text-xs sm:text-sm font-medium text-green-800 mb-1 sm:mb-2">
              Joined at: <strong>{new Date(user.joinedAt).toLocaleTimeString()}</strong>
            </p>
          )}
        </div>
        
        <button 
          onClick={() => removeUser(user.id)}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
          aria-label="Remove user"
        >
          ✕
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4">
        {/* Show Check Status button for all users including joined users */}
        {user.status !== 'not_eligible' && (
          <button
            onClick={handleCheckStatus}
            disabled={isChecking}
            className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-1.5 sm:py-2 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm flex-1"
          >
            {isChecking ? 'Checking...' : 'Check Status'}
          </button>
        )}
        
        {user.isAvailable && user.status !== 'joined' && user.status !== 'not_eligible' && (
          <button
            onClick={handleJoinRoom}
            disabled={isJoining}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 sm:py-2 px-3 sm:px-4 rounded-md shadow-sm text-xs sm:text-sm flex-1"
          >
            {isJoining ? 'Joining...' : 'Join Room'}
          </button>
        )}
        
        {user.status === 'not_eligible' && (
          <button
            onClick={handleCheckStatus}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 sm:py-2 px-3 sm:px-4 rounded-md shadow-sm text-xs sm:text-sm flex-1"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}