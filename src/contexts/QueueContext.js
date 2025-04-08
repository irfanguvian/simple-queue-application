'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import graphQLClient, { MUTATIONS } from '@/lib/graphql';

const QueueContext = createContext();

// Polling interval in milliseconds (10 seconds)
const STATUS_CHECK_INTERVAL = 10000;

export function QueueProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(true);

  // Start queueing for a new user
  const startQueueing = useCallback(async (productCode) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await graphQLClient.request(MUTATIONS.START_QUEUEING, { productCode });
      
      if (result.startQueueing.success) {
        const newUser = {
          id: crypto.randomUUID(),
          queueId: result.startQueueing.data.queueId,
          productCode,
          status: 'start', // Initial status is 'start' (grey)
          estimatedTime: null,
          isAvailable: false,
          createdAt: new Date().toISOString(),
        };
        
        setUsers((prevUsers) => [...prevUsers, newUser]);
        return newUser;
      } else {
        throw new Error(result.startQueueing.message || 'Failed to join queue');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while joining the queue');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start queueing for multiple users in bulk
  const bulkStartQueueing = useCallback(async (productCode, count) => {
    if (!count || count < 1) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create an array of promises for parallel API calls
      const userPromises = Array.from({ length: count }, () => 
        graphQLClient.request(MUTATIONS.START_QUEUEING, { productCode })
      );
      
      // Wait for all API calls to complete
      const results = await Promise.allSettled(userPromises);
      
      // Process successful results
      const newUsers = results
        .filter(result => result.status === 'fulfilled' && result.value.startQueueing.success)
        .map(result => ({
          id: crypto.randomUUID(),
          queueId: result.value.startQueueing.data.queueId,
          productCode,
          status: 'start',
          estimatedTime: null,
          isAvailable: false,
          createdAt: new Date().toISOString(),
        }));
      
      // Add all new users to the state
      if (newUsers.length > 0) {
        setUsers((prevUsers) => [...prevUsers, ...newUsers]);
      }
      
      // Check if any failed
      const failedCount = count - newUsers.length;
      if (failedCount > 0) {
        console.warn(`${failedCount} out of ${count} users failed to be created`);
      }
      
      return newUsers;
    } catch (err) {
      setError(err.message || 'An error occurred while creating bulk users');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check status for a specific user
  const checkStatus = useCallback(async (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return null;
    
    try {
      const result = await graphQLClient.request(MUTATIONS.CHECK_QUEUE_STATUS, { 
        queueId: user.queueId 
      });
      
      if (result.checkQueueStatus.success) {
        const { queue_id, is_available, estimated_time } = result.checkQueueStatus.data;
        
        // Keep the 'joined' status if the user has already joined, otherwise update to 'checking' or 'available'
        const newStatus = user.status === 'joined' 
          ? 'joined' 
          : is_available ? 'available' : 'checking';
        
        const updatedUser = {
          ...user,
          status: newStatus,
          isAvailable: is_available,
          estimatedTime: estimated_time,
          lastChecked: new Date().toISOString(),
        };
        
        setUsers((prevUsers) => 
          prevUsers.map(u => u.id === userId ? updatedUser : u)
        );
        
        return updatedUser;
      } else {
        // If check status was not successful, remove the user
        removeUser(userId);
        return null;
      }
    } catch (err) {
      console.error(`Error checking status for user ${userId}:`, err);
      // Remove the user if there was an error checking their status
      removeUser(userId);
      return null;
    }
  }, [users]);

  // Check status for all users - no longer filtering out joined users
  const checkAllStatuses = useCallback(async () => {
    return Promise.all(
      users.map(user => checkStatus(user.id))
    );
  }, [users, checkStatus]);

  // Join room when status is available
  const enterQueueRoom = useCallback(async (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user || !user.isAvailable) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await graphQLClient.request(MUTATIONS.ENTER_QUEUE_ROOM, { 
        queueId: user.queueId 
      });
      
      const updatedUser = {
        ...user,
        status: result.enterQueueRoom.success ? 'joined' : 'not_eligible',
        joinAttempted: true,
        joinSuccess: result.enterQueueRoom.success,
        message: result.enterQueueRoom.message,
        joinedAt: result.enterQueueRoom.success ? new Date().toISOString() : null,
      };
      
      setUsers((prevUsers) => 
        prevUsers.map(u => u.id === userId ? updatedUser : u)
      );
      
      return updatedUser;
    } catch (err) {
      setError(err.message || 'An error occurred while entering the queue room');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [users]);

  // Remove a user from the queue list
  const removeUser = useCallback((userId) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  }, []);

  // Clear all users
  const clearAllUsers = useCallback(() => {
    setUsers([]);
  }, []);

  // Toggle polling on/off
  const togglePolling = useCallback(() => {
    setIsPolling(prev => !prev);
  }, []);

  // Setup polling interval for status checks
  useEffect(() => {
    if (!isPolling || users.length === 0) return;
    
    const intervalId = setInterval(() => {
      checkAllStatuses();
    }, STATUS_CHECK_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [users, isPolling, checkAllStatuses]);

  return (
    <QueueContext.Provider value={{
      users,
      isLoading,
      error,
      isPolling,
      startQueueing,
      bulkStartQueueing,
      checkStatus,
      enterQueueRoom,
      removeUser,
      clearAllUsers,
      togglePolling
    }}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
}