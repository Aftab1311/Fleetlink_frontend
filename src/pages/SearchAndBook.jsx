import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Card, Button, Input, LoadingSpinner } from '../components/UI';
import { searchAvailableVehicles, createBooking } from '../api';
import { useToastContext } from '../contexts/ToastContext';

const SearchAndBook = () => {
  const [searchForm, setSearchForm] = useState({
    capacityRequired: '',
    fromPincode: '',
    toPincode: '',
    startDateTime: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
  });
  
  const [searchResults, setSearchResults] = useState([]);
  const [searchErrors, setSearchErrors] = useState({});
  const [searching, setSearching] = useState(false);
  const [booking, setBooking] = useState(false);
  const { showSuccess, showError, showWarning } = useToastContext();

  const customerId = process.env.REACT_APP_DEFAULT_CUSTOMER_ID || 'demo-customer-001';

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (searchErrors[name]) {
      setSearchErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDateTimeChange = (date) => {
    setSearchForm(prev => ({
      ...prev,
      startDateTime: date
    }));
    
    if (searchErrors.startDateTime) {
      setSearchErrors(prev => ({
        ...prev,
        startDateTime: ''
      }));
    }
  };

  const validateSearchForm = () => {
    const newErrors = {};

    // Capacity validation
    if (!searchForm.capacityRequired) {
      newErrors.capacityRequired = 'Capacity required is mandatory';
    } else {
      const capacity = parseInt(searchForm.capacityRequired);
      if (isNaN(capacity) || capacity <= 0) {
        newErrors.capacityRequired = 'Capacity must be a positive number';
      }
    }

    // Pincode validation
    if (!searchForm.fromPincode) {
      newErrors.fromPincode = 'From pincode is required';
    } else if (!/^\d{6}$/.test(searchForm.fromPincode)) {
      newErrors.fromPincode = 'From pincode must be exactly 6 digits';
    }

    if (!searchForm.toPincode) {
      newErrors.toPincode = 'To pincode is required';
    } else if (!/^\d{6}$/.test(searchForm.toPincode)) {
      newErrors.toPincode = 'To pincode must be exactly 6 digits';
    }

    // Date validation
    if (!searchForm.startDateTime) {
      newErrors.startDateTime = 'Start date and time is required';
    } else {
      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
      if (searchForm.startDateTime <= fiveMinutesFromNow) {
        newErrors.startDateTime = 'Start date and time must be at least 5 minutes from now';
      }
    }

    setSearchErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!validateSearchForm()) {
      return;
    }

    setSearching(true);
    setSearchResults([]);

    try {
      const searchParams = {
        capacityRequired: parseInt(searchForm.capacityRequired),
        fromPincode: searchForm.fromPincode,
        toPincode: searchForm.toPincode,
        startTime: searchForm.startDateTime.toISOString()
      };


      const result = await searchAvailableVehicles(searchParams);

      if (result.success) {
        // Backend returns availableVehicles in the data object
        const vehicles = result.data.availableVehicles || [];
        setSearchResults(vehicles);
        
        if (vehicles.length === 0) {
          showWarning('No vehicles found matching your criteria. Please try different search parameters.');
        } else {
          showSuccess(`Found ${vehicles.length} available vehicle(s) for your search.`);
        }
      } else {
        showError(result.error || 'Failed to search vehicles');
      }
    } catch (error) {
      console.error('Search error:', error);
      showError('An unexpected error occurred while searching. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleBookVehicle = async (vehicle) => {
    setBooking(true);

    try {
      // Calculate estimated end time (assuming 2 hours minimum ride)
      const estimatedDurationHours = 2;
      const endTime = new Date(searchForm.startDateTime.getTime() + (estimatedDurationHours * 60 * 60 * 1000));

      const bookingData = {
        vehicleId: vehicle._id || vehicle.id, // Backend uses _id, not id
        customerId: customerId,
        fromPincode: searchForm.fromPincode,
        toPincode: searchForm.toPincode,
        startTime: searchForm.startDateTime.toISOString(),
        endTime: endTime.toISOString(),
        estimatedRideDurationHours: estimatedDurationHours
      };

      const result = await createBooking(bookingData);

      if (result.success) {
        showSuccess(`🎉 Booking confirmed! Vehicle "${vehicle.name}" has been booked successfully.`);
        
        // Remove the booked vehicle from search results
        setSearchResults(prev => prev.filter(v => (v._id || v.id) !== (vehicle._id || vehicle.id)));
      } else {
        showError(result.error || 'Failed to book vehicle. It may no longer be available.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      showError('An unexpected error occurred while booking. Please try again.');
    } finally {
      setBooking(false);
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

  return (
    <div className="max-w-6xl mx-auto flex flex-col justify-center">
      {/* Header */}
      <div className='mb-10'>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search & Book Vehicles</h1>
        <p className="text-gray-600">
          Find and book available vehicles for your logistics needs.
        </p>
      </div>


      {/* Search Form */}
      <Card title="Search Available Vehicles">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Capacity Required */}
            <Input
              label="Capacity Required (KG)"
              name="capacityRequired"
              type="number"
              value={searchForm.capacityRequired}
              onChange={handleSearchInputChange}
              placeholder="e.g., 500"
              error={searchErrors.capacityRequired}
              required
              min="1"
              startIcon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
            />

            {/* From Pincode */}
            <Input
              label="From Pincode"
              name="fromPincode"
              value={searchForm.fromPincode}
              onChange={handleSearchInputChange}
              placeholder="e.g., 400001"
              error={searchErrors.fromPincode}
              required
              maxLength="6"
              startIcon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />

            {/* To Pincode */}
            <Input
              label="To Pincode"
              name="toPincode"
              value={searchForm.toPincode}
              onChange={handleSearchInputChange}
              placeholder="e.g., 400002"
              error={searchErrors.toPincode}
              required
              maxLength="6"
              startIcon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />

            {/* Date Time Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time <span className="text-error-500 ml-1">*</span>
              </label>
              <DatePicker
                selected={searchForm.startDateTime}
                onChange={handleDateTimeChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                dateFormat="dd/MM/yyyy HH:mm"
                minDate={new Date(Date.now() + 5 * 60 * 1000)} // 5 minutes from now
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                placeholderText="Select date and time"
              />
              {searchErrors.startDateTime && (
                <p className="mt-1 text-sm text-error-600">
                  {searchErrors.startDateTime}
                </p>
              )}
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              variant="primary"
              loading={searching}
              size="lg"
              startIcon={
                !searching && (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )
              }
            >
              {searching ? 'Searching...' : 'Search Vehicles'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Search Results */}
      {searching && (
        <Card>
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" text="Searching for available vehicles..." />
          </div>
        </Card>
      )}

      {searchResults.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 my-6">
            Available Vehicles ({searchResults.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((vehicle) => (
              <Card key={vehicle._id || vehicle.id} className="hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  {/* Vehicle Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {vehicle.name}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {vehicle.vehicleType}
                      </p>
                    </div>
                    <div className="bg-primary-100 text-primary-800 px-2 py-1 rounded-lg text-xs font-medium">
                      Available
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span className="text-sm text-gray-700">
                        Capacity: <strong>{vehicle.capacityKg.toLocaleString()} kg</strong>
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-sm text-gray-700">
                        Tyres: <strong>{vehicle.tyres}</strong>
                      </span>
                    </div>

                    {vehicle.estimatedRideDurationHours && (
                      <div className="flex items-center space-x-3">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-700">
                          Est. Duration: <strong>{vehicle.estimatedRideDurationHours}h</strong>
                        </span>
                      </div>
                    )}

                    {vehicle.registrationNumber && (
                      <div className="flex items-center space-x-3">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="text-sm text-gray-700">
                          Reg: <strong>{vehicle.registrationNumber}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Booking Details */}
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="text-xs text-gray-600">
                      <strong>Route:</strong> {searchForm.fromPincode} → {searchForm.toPincode}
                    </div>
                    <div className="text-xs text-gray-600">
                      <strong>Start Time:</strong> {formatDateTime(searchForm.startDateTime)}
                    </div>
                  </div>

                  {/* Book Button */}
                  <Button
                    variant="success"
                    fullWidth
                    loading={booking}
                    onClick={() => handleBookVehicle(vehicle)}
                    startIcon={
                      !booking && (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )
                    }
                  >
                    {booking ? 'Booking...' : 'Book Now'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndBook;
