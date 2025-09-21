import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, LoadingSpinner } from '../components/UI';
import { getBookings, cancelBooking, deleteBooking, updateBookingStatus } from '../api';
import { useToastContext } from '../contexts/ToastContext';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [filter, setFilter] = useState('all');
  const { showSuccess, showError } = useToastContext();

  const statusColors = {
    pending: 'bg-warning-100 text-warning-800',
    confirmed: 'bg-primary-100 text-primary-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-success-100 text-success-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };

  const fetchBookings = useCallback(async () => {
    setLoading(true);

    try {
      const result = await getBookings();

      if (result.success) {
        // Handle different possible data structures
        let bookingsArray = result.data.bookings || result.data || [];
        
        // Ensure bookingsArray is actually an array
        if (!Array.isArray(bookingsArray)) {
          console.warn('📋 Bookings data is not an array:', bookingsArray);
          bookingsArray = [];
        }
        
        
        // Sort bookings by creation date (newest first) - only if array has items
        const sortedBookings = bookingsArray.length > 0 
          ? bookingsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [];
          
        setBookings(sortedBookings);
      } else {
        showError(result.error || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
      showError('An unexpected error occurred while fetching bookings.');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [bookingId]: 'cancelling' }));

    try {
      const result = await cancelBooking(bookingId);

      if (result.success) {
        showSuccess('🚫 Booking cancelled successfully');
        
        // Update booking status in local state
        setBookings(prev => prev.map(booking => 
          (booking._id || booking.id) === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        ));
      } else {
        showError(result.error || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Cancel booking error:', error);
      showError('An unexpected error occurred while cancelling the booking.');
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[bookingId];
        return newState;
      });
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: 'updating' }));

    try {
      const result = await updateBookingStatus(bookingId, newStatus);

      if (result.success) {
        const statusMessages = {
          'in_progress': '🚀 Journey started successfully!',
          'completed': '✅ Journey completed successfully!',
          'confirmed': '✅ Booking confirmed!'
        };
        showSuccess(statusMessages[newStatus] || 'Booking status updated successfully');
        
        // Update booking status in local state
        setBookings(prev => prev.map(booking => 
          (booking._id || booking.id) === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        ));
      } else {
        showError(result.error || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Update booking status error:', error);
      showError('An unexpected error occurred while updating the booking status.');
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[bookingId];
        return newState;
      });
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to permanently delete this booking? This action cannot be undone.')) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [bookingId]: 'deleting' }));

    try {
      const result = await deleteBooking(bookingId);

      if (result.success) {
        showSuccess('🗑️ Booking deleted successfully');
        
        // Remove booking from local state
        setBookings(prev => prev.filter(booking => 
          (booking._id || booking.id) !== bookingId
        ));
      } else {
        showError(result.error || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Delete booking error:', error);
      showError('An unexpected error occurred while deleting the booking.');
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[bookingId];
        return newState;
      });
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canCancelBooking = (booking) => {
    const now = new Date();
    const startTime = new Date(booking.startTime);
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    
    return ['pending', 'confirmed'].includes(booking.status) && startTime > oneHourFromNow;
  };

  const canDeleteBooking = (booking) => {
    return ['completed', 'cancelled'].includes(booking.status);
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const filterOptions = [
    { value: 'all', label: 'All Bookings' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings Management</h1>
          <p className="text-gray-600">
            Manage and track all your vehicle bookings.
          </p>
        </div>
        <Card>
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading bookings..." />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings Management</h1>
          <p className="text-gray-600">
            Manage and track all your vehicle bookings.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="outline"
            onClick={fetchBookings}
            startIcon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
          >
            Refresh
          </Button>
        </div>
      </div>


      {/* Filter Bar */}
      <Card padding="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  filter === option.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {option.label}
                {option.value !== 'all' && (
                  <span className="ml-1">
                    ({bookings.filter(b => b.status === option.value).length})
                  </span>
                )}
                {option.value === 'all' && (
                  <span className="ml-1">({bookings.length})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="mt-2 text-gray-500">
              {filter === 'all' 
                ? "You don't have any bookings yet." 
                : `No bookings with status "${statusLabels[filter]}" found.`}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking._id || booking.id} className="hover:shadow-md transition-shadow">
              <div className="space-y-4">
                {/* Booking Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-600 text-white p-2 rounded-lg">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Booking #{(booking._id || booking.id)?.slice(-8)}
                        </h3>
                      <p className="text-sm text-gray-600">
                        Created: {formatDateTime(booking.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                      {statusLabels[booking.status]}
                    </span>
                  </div>
                </div>

                {/* Booking Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Vehicle Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Vehicle</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Name:</strong> {booking.vehicleId?.name || 'N/A'}</p>
                      <p><strong>Capacity:</strong> {booking.vehicleId?.capacityKg?.toLocaleString() || 'N/A'} kg</p>
                      <p><strong>Tyres:</strong> {booking.vehicleId?.tyres || 'N/A'}</p>
                      {booking.vehicleId?.vehicleType && (
                        <p><strong>Type:</strong> {booking.vehicleId.vehicleType}</p>
                      )}
                    </div>
                  </div>

                  {/* Route Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Route</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>From:</strong> {booking.fromPincode}</p>
                      <p><strong>To:</strong> {booking.toPincode}</p>
                      <p><strong>Customer:</strong> {booking.customerId}</p>
                    </div>
                  </div>

                  {/* Timing Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Schedule</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Start:</strong> {formatDateTime(booking.startTime)}</p>
                      <p><strong>End:</strong> {formatDateTime(booking.endTime)}</p>
                      <p><strong>Duration:</strong> {booking.estimatedRideDurationHours}h</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {booking.notes}
                    </p>
                  </div>
                )}

                 {/* Action Buttons */}
                 <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                   {/* Cancel Button */}
                   {canCancelBooking(booking) && (
                     <Button
                       variant="danger"
                       size="sm"
                       loading={actionLoading[booking._id || booking.id] === 'cancelling'}
                       onClick={() => handleCancelBooking(booking._id || booking.id)}
                       startIcon={
                         !actionLoading[booking._id || booking.id] && (
                           <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                           </svg>
                         )
                       }
                     >
                       Cancel Booking
                     </Button>
                   )}

                   {/* Status Update Buttons */}
                   {booking.status === 'confirmed' && (
                     <Button
                       variant="primary"
                       size="sm"
                       loading={actionLoading[booking._id || booking.id] === 'updating'}
                       onClick={() => handleUpdateStatus(booking._id || booking.id, 'in_progress')}
                     >
                       Start Journey
                     </Button>
                   )}

                   {booking.status === 'in_progress' && (
                     <Button
                       variant="success"
                       size="sm"
                       loading={actionLoading[booking._id || booking.id] === 'updating'}
                       onClick={() => handleUpdateStatus(booking._id || booking.id, 'completed')}
                     >
                       Complete Journey
                     </Button>
                   )}

                   {/* Delete Button - Only for completed or cancelled bookings */}
                   {canDeleteBooking(booking) && (
                     <Button
                       variant="danger"
                       size="sm"
                       loading={actionLoading[booking._id || booking.id] === 'deleting'}
                       onClick={() => handleDeleteBooking(booking._id || booking.id)}
                       startIcon={
                         !actionLoading[booking._id || booking.id] && (
                           <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                           </svg>
                         )
                       }
                     >
                       Delete Booking
                     </Button>
                   )}
                 </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
