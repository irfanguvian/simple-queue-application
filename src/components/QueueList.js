'use client';

import { useQueue } from '@/contexts/QueueContext';
import UserCard from './UserCard';

export default function QueueList() {
  const { users, clearAllUsers, isPolling, togglePolling } = useQueue();

  if (users.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sm:p-8 text-center">
        <p className="text-gray-600">No users in the queue.</p>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">Generate a new user to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-black">Queue Status ({users.length})</h2>
        <div className="flex gap-2 text-xs sm:text-sm">
          <button 
            onClick={togglePolling}
            className={`px-3 py-1 border rounded-md shadow-sm ${
              isPolling 
                ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100' 
                : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
            }`}
          >
            {isPolling ? 'Auto-refresh: ON' : 'Auto-refresh: OFF'}
          </button>
          <button 
            onClick={clearAllUsers}
            className="px-3 py-1 text-red-600 border border-red-300 rounded-md hover:bg-red-50 shadow-sm"
          >
            Clear All
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}