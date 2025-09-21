import apiClient from './axios';

/**
 * Vehicle API functions
 */

// Create a new vehicle
export const addVehicle = async (vehicleData) => {
  try {
    const response = await apiClient.post('/vehicles', vehicleData);
    return {
      success: true,
      data: response.data,
      message: 'Vehicle added successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to add vehicle',
      details: error.response?.data
    };
  }
};

// Get all vehicles
export const getVehicles = async (params = {}) => {
  try {
    const response = await apiClient.get('/vehicles', { params });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch vehicles',
      details: error.response?.data
    };
  }
};

// Search for available vehicles
export const searchAvailableVehicles = async (searchParams) => {
  try {
    const response = await apiClient.get('/vehicles/available', {
      params: searchParams
    });
    
    // Extract the actual data from the backend response
    const backendResponse = response.data;
    
    return {
      success: true,
      data: backendResponse.data || backendResponse, // Handle both structures
      message: backendResponse.message
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to search vehicles',
      details: error.response?.data
    };
  }
};

// Get vehicle by ID
export const getVehicleById = async (vehicleId) => {
  try {
    const response = await apiClient.get(`/vehicles/${vehicleId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch vehicle details',
      details: error.response?.data
    };
  }
};

// Update vehicle
export const updateVehicle = async (vehicleId, updateData) => {
  try {
    const response = await apiClient.put(`/vehicles/${vehicleId}`, updateData);
    return {
      success: true,
      data: response.data,
      message: 'Vehicle updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update vehicle',
      details: error.response?.data
    };
  }
};

// Delete vehicle
export const deleteVehicle = async (vehicleId) => {
  try {
    const response = await apiClient.delete(`/vehicles/${vehicleId}`);
    return {
      success: true,
      data: response.data,
      message: 'Vehicle deleted successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete vehicle',
      details: error.response?.data
    };
  }
};

// Get vehicle statistics
export const getVehicleStats = async () => {
  try {
    const response = await apiClient.get('/vehicles/stats');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch vehicle statistics',
      details: error.response?.data
    };
  }
};
