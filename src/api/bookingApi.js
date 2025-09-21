import apiClient from './axios';

/**
 * Booking API functions
 */

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await apiClient.post('/bookings', bookingData);
    return {
      success: true,
      data: response.data,
      message: 'Booking created successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create booking',
      details: error.response?.data
    };
  }
};

// Get all bookings
export const getBookings = async (params = {}) => {
  try {
    const response = await apiClient.get('/bookings', { params });
    
    // Extract the actual data from the backend response
    const backendResponse = response.data;
    
    return {
      success: true,
      data: {
        bookings: backendResponse.data || [] // Bookings are directly in data array
      },
      message: backendResponse.message
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch bookings',
      details: error.response?.data
    };
  }
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
  try {
    const response = await apiClient.get(`/bookings/${bookingId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch booking details',
      details: error.response?.data
    };
  }
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
  try {
    const response = await apiClient.delete(`/bookings/${bookingId}`);
    return {
      success: true,
      data: response.data,
      message: 'Booking cancelled successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to cancel booking',
      details: error.response?.data
    };
  }
};

// Permanently delete booking (only for completed or cancelled bookings)
export const deleteBooking = async (bookingId) => {
  try {
    const response = await apiClient.delete(`/bookings/${bookingId}/delete`);
    return {
      success: true,
      data: response.data,
      message: 'Booking deleted successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete booking',
      details: error.response?.data
    };
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await apiClient.patch(`/bookings/${bookingId}/status`, {
      status
    });
    return {
      success: true,
      data: response.data,
      message: 'Booking status updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update booking status',
      details: error.response?.data
    };
  }
};

// Get customer bookings
export const getCustomerBookings = async (customerId) => {
  try {
    const response = await apiClient.get(`/bookings/customer/${customerId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch customer bookings',
      details: error.response?.data
    };
  }
};

// Get upcoming bookings
export const getUpcomingBookings = async () => {
  try {
    const response = await apiClient.get('/bookings/upcoming');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch upcoming bookings',
      details: error.response?.data
    };
  }
};

// Get booking statistics
export const getBookingStats = async () => {
  try {
    const response = await apiClient.get('/bookings/stats');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch booking statistics',
      details: error.response?.data
    };
  }
};

// Check booking conflicts
export const checkBookingConflicts = async (conflictData) => {
  try {
    const response = await apiClient.post('/bookings/check-conflicts', conflictData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to check booking conflicts',
      details: error.response?.data
    };
  }
};
