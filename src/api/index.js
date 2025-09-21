/**
 * API Layer - Central export for all API functions
 */

// Vehicle API
export {
  addVehicle,
  getVehicles,
  searchAvailableVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getVehicleStats
} from './vehicleApi';

// Booking API
export {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  deleteBooking,
  updateBookingStatus,
  getCustomerBookings,
  getUpcomingBookings,
  getBookingStats,
  checkBookingConflicts
} from './bookingApi';

// Axios instance
export { default as apiClient } from './axios';
