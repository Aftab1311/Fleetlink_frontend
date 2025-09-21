import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import SearchAndBook from './pages/SearchAndBook';
import AddVehicle from './pages/AddVehicle';
import Bookings from './pages/Bookings';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          
          {/* Main content area that grows to fill available space */}
          <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<SearchAndBook />} />
              <Route path="/add-vehicle" element={<AddVehicle />} />
              <Route path="/bookings" element={<Bookings />} />
            </Routes>
          </main>
        
          {/* Footer - always at bottom after all content */}
          <footer className="bg-white border-t border-gray-200 mt-auto w-full">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-600 text-white p-2 rounded-lg">
                    <span className="text-sm font-bold">FL</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">FleetLink</p>
                    <p className="text-xs text-gray-500">Logistics Vehicle Booking System</p>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <p className="text-xs text-gray-500">
                    © 2024 FleetLink. Built with React & TailwindCSS.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
