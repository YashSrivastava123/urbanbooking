import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { CreateBookingRequest, UpdateBookingRequest, BookingStatus } from '../types';

// Query keys for React Query
export const queryKeys = {
  slots: ['slots'] as const,
  bookings: ['bookings'] as const,
  booking: (id: string) => ['booking', id] as const,
};

// Hook to get available slots
export const useAvailableSlots = (date?: string, providerId?: string, limit: number = 6, offset: number = 0) => {
  return useQuery({
    queryKey: [...queryKeys.slots, date, providerId, limit, offset],
    queryFn: () => apiService.getAvailableSlots({ date, providerId, limit, offset }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 3000, // Poll every 3 seconds for real-time updates
  });
};

// Hook to get a specific booking
export const useBooking = (id: string) => {
  return useQuery({
    queryKey: queryKeys.booking(id),
    queryFn: () => apiService.getBooking(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get all providers
export const useProviders = () => {
  return useQuery({
    queryKey: ['providers'],
    queryFn: () => apiService.getProviders(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get all slots (including booked/unavailable) for a provider and date
export const useAllSlotsForProviderAndDate = (date: string, providerId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['all-slots', date, providerId],
    queryFn: () => apiService.getAllSlotsForProviderAndDate(date, providerId),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 3000,
  });
};

// Hook to create a booking
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingData: CreateBookingRequest) => 
      apiService.createBooking(bookingData),
    onSuccess: () => {
      // Invalidate slots query to refresh available slots
      queryClient.invalidateQueries({ queryKey: queryKeys.slots });
    },
    onError: (error: any) => {
      console.error('Failed to create booking:', error);
    },
  });
};

// Hook to update booking status
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      apiService.updateBooking(id, { status }),
    onSuccess: (updatedBooking) => {
      // Update the specific booking in cache
      queryClient.setQueryData(
        queryKeys.booking(updatedBooking.id),
        updatedBooking
      );
      // Invalidate slots query to refresh availability
      queryClient.invalidateQueries({ queryKey: queryKeys.slots });
    },
    onError: (error: any) => {
      console.error('Failed to update booking:', error);
    },
  });
};

// Hook to cancel booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.cancelBooking(id),
    onSuccess: (cancelledBooking) => {
      // Update the specific booking in cache
      queryClient.setQueryData(
        queryKeys.booking(cancelledBooking.id),
        cancelledBooking
      );
      // Invalidate slots query to refresh availability
      queryClient.invalidateQueries({ queryKey: queryKeys.slots });
    },
    onError: (error: any) => {
      console.error('Failed to cancel booking:', error);
    },
  });
}; 