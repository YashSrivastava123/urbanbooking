import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAvailableSlots, useProviders, useAllSlotsForProviderAndDate } from '../hooks/useBookings';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { CreateBookingRequest, Slot } from '../types';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { SuccessMessage } from '../components/SuccessMessage';
import { Modal } from '../components/Modal';
import { SuccessAnimation } from '../components/SuccessAnimation';

export const SlotBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [page, setPage] = useState(0);
  const limit = 6;
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all providers
  const { data: providers, isLoading: providersLoading, error: providersError } = useProviders();

  // Fetch all slots (including booked/unavailable) for modal
  const {
    data: slots,
    isLoading: slotsLoading,
    error: slotsError,
    refetch: refetchSlots
  } = useAllSlotsForProviderAndDate(selectedDate, selectedProvider || '', !!selectedProvider);

  // Create booking mutation using useMutation directly
  const {
    mutate: createBooking,
    isPending: isCreating,
    error: bookingError,
    isSuccess: bookingSuccess
  }: UseMutationResult<any, unknown, CreateBookingRequest> = useMutation({
    mutationFn: (bookingData: CreateBookingRequest) => apiService.createBooking(bookingData),
    onSuccess: (booking) => {
      setCreatedBooking(booking);
    }
  });

  // Handle slot selection
  const handleSlotSelect = useCallback((slot: Slot) => {
    setSelectedSlot(slot);
  }, []);

  // Handle booking submission
  const handleBookingSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSlot || !user?.id) {
      return;
    }

    createBooking({
      slotId: selectedSlot.id,
      customerId: user.id
    });
  }, [selectedSlot, user?.id, createBooking]);

  // Handle date change
  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setSelectedSlot(null); // Reset selection when date changes
  }, []);

  // Format time for display
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Handle successful booking
  React.useEffect(() => {
    if (bookingSuccess && createdBooking) {
      // Navigate to review page after a short delay
      const timer = setTimeout(() => {
        navigate(`/booking/${createdBooking.id}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [bookingSuccess, createdBooking, navigate]);

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to book slots
          </h2>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header with user info and My Bookings button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Book Your Slot
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user.name}!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.email}
            </span>
            <button
              onClick={() => navigate('/my-bookings')}
              className="btn-primary text-sm"
            >
              See My Bookings
            </button>
            <button
              onClick={logout}
              className="btn-secondary text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Date Selection */}
        <div className="card mb-6">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            className="input max-w-xs"
          />
        </div>

        {/* Providers List */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select a Provider</h2>
          {providersLoading ? (
            <LoadingSpinner size="lg" className="py-8" />
          ) : providersError ? (
            <ErrorMessage message="Failed to load providers. Please try again." className="mb-6" />
          ) : providers && providers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-colors ${
                    selectedProvider === provider.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-700 mb-2">
                    {provider.name.charAt(0)}
                  </div>
                  <div className="font-medium text-gray-900">{provider.name}</div>
                  <div className="text-sm text-gray-600 mb-2">{provider.email}</div>
                  <button
                    className="btn-primary mt-2"
                    onClick={() => {
                      setSelectedProvider(provider.id);
                      setPage(0);
                      setIsModalOpen(true);
                    }}
                  >
                    View Slots
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No providers found.
            </div>
          )}
        </div>

        {/* Slot Selection Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProvider(null);
            setSelectedSlot(null);
            setPage(0);
          }}
          title={selectedProvider ? `Book with ${providers?.find(p => p.id === selectedProvider)?.name}` : ''}
        >
          {/* Date Picker in Modal */}
          <div className="mb-4">
            <label htmlFor="modal-date" className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              id="modal-date"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]}
              className="input max-w-xs"
            />
          </div>

          {/* Provider Info */}
          {selectedProvider && (
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-xl font-bold text-primary-700">
                {providers?.find(p => p.id === selectedProvider)?.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-gray-900">{providers?.find(p => p.id === selectedProvider)?.name}</div>
                <div className="text-sm text-gray-600">{providers?.find(p => p.id === selectedProvider)?.email}</div>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {(slotsError as any) && selectedProvider && (
            <ErrorMessage 
              message="Failed to load available slots. Please try again." 
              className="mb-6"
            />
          )}

          {bookingError && selectedProvider && (
            (() => {
              const err = bookingError as any;
              let msg = 'Failed to create booking. Please try again.';
              if (typeof err === 'string') msg = err;
              else if (err?.response?.data?.message) msg = err.response.data.message;
              return <ErrorMessage message={msg} className="mb-6" />;
            })()
          )}

          {/* Success Animation */}
          {bookingSuccess && selectedProvider && (
            <SuccessAnimation message="Booking created successfully! Redirecting to review page..." />
          )}

          {/* All Slots for Selected Provider (including booked) */}
          {selectedProvider && !bookingSuccess && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                All Slots on {new Date(selectedDate).toLocaleDateString()}
              </h3>
              {slotsLoading ? (
                <LoadingSpinner size="lg" className="py-8" />
              ) : slots && slots.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {slots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`p-4 border rounded-lg transition-colors flex flex-col items-center justify-center ${
                          slot.is_available
                            ? (selectedSlot?.id === slot.id
                                ? 'border-primary-500 bg-primary-50 cursor-pointer'
                                : 'border-gray-200 hover:border-primary-300 cursor-pointer')
                            : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                        }`}
                        onClick={() => slot.is_available && handleSlotSelect(slot)}
                        tabIndex={slot.is_available ? 0 : -1}
                        aria-disabled={!slot.is_available}
                      >
                        <div className="text-center">
                          <div className="text-lg font-medium">
                            {formatTime(slot.start_time)}
                          </div>
                          <div className="text-sm">
                            to {formatTime(slot.end_time)}
                          </div>
                          {!slot.is_available && (
                            <div className="mt-2 text-xs font-semibold text-danger-600">Booked</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    <button
                      className="btn-secondary"
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                    >
                      Previous
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!slots || slots.length < limit}
                    >
                      Next
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No slots for the selected date.
                </div>
              )}
            </div>
          )}

          {/* Booking Form */}
          {selectedSlot && !bookingSuccess && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Complete Your Booking
              </h2>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Selected Slot:</h3>
                  <p className="text-gray-600">
                    {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Booking as:</h3>
                  <p className="text-blue-700">
                    {user.name} ({user.email})
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" className="mr-2" />
                        Creating Booking...
                      </div>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSlot(null)}
                    className="btn-secondary"
                  >
                    Change Slot
                  </button>
                </div>
              </form>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}; 