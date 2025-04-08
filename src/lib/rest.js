// Base API URL from environment variable
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// Create a reusable fetch function with error handling
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      method: options.method || 'GET',
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `API error with status code ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// REST API endpoints for the queue system
const api = {
  // Start queueing for a user
  startQueue: async (productCode) => {
    const data = await fetchAPI('/queue/start', {
      method: 'POST',
      body: { product_code: productCode },
    });
    
    // Ensure we extract the queue_id correctly regardless of response format
    // Check common response structure patterns
    return {
      startQueueing: {
        success: data.success !== undefined ? data.success : true,
        message: data.message || 'Queue started successfully',
        data: {
          queueId: data.data.queue_id,
        },
      },
    };
  },
  
  // Check the status of a queue
  checkQueueStatus: async (queueId) => {
    if (!queueId) {
      console.error('Missing queue ID when checking status');
      throw new Error('Queue ID is required to check status');
    }
    
    const data = await fetchAPI(`/queue/status/${queueId}`, {
      method: 'GET',
    });
    
    return {
      checkQueueStatus: {
        success: data.success !== undefined ? data.success : true,
        message: data.message || 'Status retrieved successfully',
        data: {
          queue_id: data.data?.queue_id || data.queue_id || queueId,
          is_available: data.data?.is_available || data.is_available || false,
          estimated_time: data.data?.estimated_time || data.estimated_time || null,
        },
      },
    };
  },
  
  // Enter a queue room
  enterQueueRoom: async (queueId) => {
    if (!queueId) {
      console.error('Missing queue ID when entering room');
      throw new Error('Queue ID is required to enter room');
    }
    
    const data = await fetchAPI('/queue/enter', {
      method: 'POST',
      body: { queue_id: queueId },
    });
    
    return {
      enterQueueRoom: {
        success: data.success !== undefined ? data.success : true,
        message: data.message || 'Successfully entered queue room',
      },
    };
  },
};

export default api;