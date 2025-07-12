import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Booking } from '../types';
import { useNavigate } from 'react-router-dom';

export const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['my-bookings', user?.id],
    queryFn: () => user ? apiService.getBookingsByCustomer(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="Please log in to view your bookings." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Bookings</h1>
        {isLoading ? (
          <LoadingSpinner size="lg" className="py-8" />
        ) : error ? (
          <ErrorMessage message="Failed to load bookings. Please try again." />
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking: Booking) => (
              <div key={booking.id} className="card flex flex-col md:flex-row md:items-center md:justify-between p-4">
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    {booking.slot?.provider?.name || 'Provider'} — {new Date(booking.slot?.start_time || '').toLocaleDateString()} {new Date(booking.slot?.start_time || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-sm text-gray-600">
                    Status: <span className="capitalize">{booking.status}</span>
                  </div>
                </div>
                <button
                  className="btn-primary mt-2 md:mt-0"
                  onClick={() => navigate(`/booking/${booking.id}`)}
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            You have no bookings yet.
          </div>
        )}
      </div>
    </div>
  );
}; 