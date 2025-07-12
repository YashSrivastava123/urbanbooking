import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking, useUpdateBooking, useCancelBooking } from '../hooks/useBookings';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { SuccessMessage } from '../components/SuccessMessage';
import { BookingStatus } from '../types';

export const ReviewBookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch booking details
  const { 
    data: booking, 
    isLoading: bookingLoading, 
    error: bookingError 
  } = useBooking(id || '');

  // Update booking mutation
  const { 
    mutate: updateBooking, 
    isPending: isUpdating,
    error: updateError 
  } = useUpdateBooking();

  // Cancel booking mutation
  const { 
    mutate: cancelBooking, 
    isPending: isCancelling,
    error: cancelError 
  } = useCancelBooking();

  // Handle confirm booking
  const handleConfirmBooking = useCallback(() => {
    if (id) {
      updateBooking({ id, status: BookingStatus.CONFIRMED });
    }
  }, [id, updateBooking]);

  // Handle cancel booking
  const handleCancelBooking = useCallback(() => {
    if (id) {
      cancelBooking(id);
    }
  }, [id, cancelBooking]);

  // Format time for display
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusBadgeColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case BookingStatus.CONFIRMED:
        return 'bg-success-100 text-success-800 border-success-200';
      case BookingStatus.CANCELLED:
        return 'bg-danger-100 text-danger-800 border-danger-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (bookingLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (bookingError || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage 
            message="Failed to load booking details. Please check the booking ID and try again." 
          />
          <button
            onClick={() => navigate('/')}
            className="btn-primary mt-4"
          >
            Back to Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Details
          </h1>
          <p className="text-gray-600">
            Review and manage your booking
          </p>
        </div>

        {/* Error Messages */}
        {updateError && (
          <ErrorMessage 
            message="Failed to update booking. Please try again." 
            className="mb-6"
          />
        )}

        {cancelError && (
          <ErrorMessage 
            message="Failed to cancel booking. Please try again." 
            className="mb-6"
          />
        )}

        {/* Booking Details Card */}
        <div className="card mb-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Booking #{booking.id.slice(0, 8)}
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>

          <div className="space-y-4">
            {/* Slot Information */}
            {booking.slot && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Slot Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Date:</span> {formatDate(booking.slot.start_time)}
                  </p>
                  <p>
                    <span className="font-medium">Time:</span> {formatTime(booking.slot.start_time)} - {formatTime(booking.slot.end_time)}
                  </p>
                  {booking.slot.provider && (
                    <p>
                      <span className="font-medium">Provider:</span> {booking.slot.provider.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Customer Information */}
            {booking.customer && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Customer Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Name:</span> {booking.customer.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {booking.customer.email}
                  </p>
                </div>
              </div>
            )}

            {/* Booking Metadata */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Booking Information</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Created:</span> {formatDate(booking.created_at)}
                </p>
                <p>
                  <span className="font-medium">Last Updated:</span> {formatDate(booking.updated_at)}
                </p>
                <p>
                  <span className="font-medium">Version:</span> {booking.version}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {booking.status === BookingStatus.PENDING && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Booking Actions
            </h3>
            
            <div className="flex gap-4">
              <button
                onClick={handleConfirmBooking}
                disabled={isUpdating}
                className="btn-success flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Confirming...
                  </div>
                ) : (
                  'Confirm Booking'
                )}
              </button>
              
              <button
                onClick={handleCancelBooking}
                disabled={isCancelling}
                className="btn-danger flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCancelling ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Cancelling...
                  </div>
                ) : (
                  'Cancel Booking'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Back to Booking
          </button>
        </div>
      </div>
    </div>
  );
}; 