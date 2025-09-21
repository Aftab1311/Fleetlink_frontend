import React, { useState } from 'react';
import { Card, Button, Input } from '../components/UI';
import { addVehicle } from '../api';
import { useToastContext } from '../contexts/ToastContext';

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    name: '',
    capacityKg: '',
    tyres: '',
    vehicleType: 'truck',
    registrationNumber: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToastContext();

  const vehicleTypes = [
    { value: 'truck', label: 'Truck' },
    { value: 'van', label: 'Van' },
    { value: 'pickup', label: 'Pickup' },
    { value: 'trailer', label: 'Trailer' },
    { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Vehicle name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Vehicle name must be at least 2 characters';
    }

    // Capacity validation
    if (!formData.capacityKg) {
      newErrors.capacityKg = 'Capacity is required';
    } else {
      const capacity = parseInt(formData.capacityKg);
      if (isNaN(capacity) || capacity <= 0) {
        newErrors.capacityKg = 'Capacity must be a positive number';
      } else if (capacity > 100000) {
        newErrors.capacityKg = 'Capacity cannot exceed 100,000 kg';
      }
    }

    // Tyres validation
    if (!formData.tyres) {
      newErrors.tyres = 'Number of tyres is required';
    } else {
      const tyres = parseInt(formData.tyres);
      if (isNaN(tyres) || tyres < 2) {
        newErrors.tyres = 'Vehicle must have at least 2 tyres';
      } else if (tyres > 20) {
        newErrors.tyres = 'Vehicle cannot have more than 20 tyres';
      }
    }

    // Registration number validation (optional but if provided, should be valid)
    if (formData.registrationNumber && !/^[A-Z0-9\-\s]+$/i.test(formData.registrationNumber)) {
      newErrors.registrationNumber = 'Registration number can only contain letters, numbers, hyphens and spaces';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
      const vehicleData = {
        name: formData.name.trim(),
        capacityKg: parseInt(formData.capacityKg),
        tyres: parseInt(formData.tyres),
        vehicleType: formData.vehicleType,
        ...(formData.registrationNumber && { 
          registrationNumber: formData.registrationNumber.trim().toUpperCase() 
        })
      };

      const result = await addVehicle(vehicleData);

      if (result.success) {
        showSuccess(result.message || 'Vehicle added successfully!');
        
        // Reset form
        setFormData({
          name: '',
          capacityKg: '',
          tyres: '',
          vehicleType: 'truck',
          registrationNumber: ''
        });
      } else {
        showError(result.error || 'Failed to add vehicle');
      }
    } catch (error) {
      console.error('Add vehicle error:', error);
      showError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      capacityKg: '',
      tyres: '',
      vehicleType: 'truck',
      registrationNumber: ''
    });
    setErrors({});
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Vehicle</h1>
        <p className="text-gray-600">
          Add a new vehicle to your fleet for booking and logistics management.
        </p>
      </div>


      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Name */}
          <Input
            label="Vehicle Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Tata Ace, Mahindra Bolero"
            error={errors.name}
            required
            startIcon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Capacity */}
            <Input
              label="Capacity (KG)"
              name="capacityKg"
              type="number"
              value={formData.capacityKg}
              onChange={handleInputChange}
              placeholder="e.g., 1000"
              error={errors.capacityKg}
              required
              min="1"
              max="100000"
              startIcon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
            />

            {/* Number of Tyres */}
            <Input
              label="Number of Tyres"
              name="tyres"
              type="number"
              value={formData.tyres}
              onChange={handleInputChange}
              placeholder="e.g., 4"
              error={errors.tyres}
              required
              min="2"
              max="20"
              startIcon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Type <span className="text-error-500 ml-1">*</span>
            </label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            >
              {vehicleTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Registration Number (Optional) */}
          <Input
            label="Registration Number"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleInputChange}
            placeholder="e.g., MH12AB1234 (Optional)"
            error={errors.registrationNumber}
            helperText="Optional: Vehicle registration number for identification"
            startIcon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            }
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="sm:flex-1"
              startIcon={
                !loading && (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )
              }
            >
              {loading ? 'Adding Vehicle...' : 'Add Vehicle'}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              disabled={loading}
              className="sm:flex-1"
            >
              Reset Form
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddVehicle;
