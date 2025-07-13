import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  Slot, 
  Booking, 
  CreateBookingRequest, 
  UpdateBookingRequest, 
  GetSlotsParams,
  ApiResponse,
  User
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://ec2-65-0-61-0.ap-south-1.compute.amazonaws.com:3000',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Add auth token to requests if available
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Request interceptor for logging
    this.api.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ API Response Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  // Slots API
  async getAvailableSlots(params?: GetSlotsParams & { limit?: number; offset?: number }): Promise<Slot[]> {
    const response = await this.api.get<Slot[]>('/api/slots', { params });
    return response.data;
  }

  async getAllSlotsForProviderAndDate(date: string, providerId: string): Promise<Slot[]> {
    const response = await this.api.get<Slot[]>('/api/slots/all', { params: { date, providerId } });
    return response.data;
  }

  // Bookings API
  async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    const response = await this.api.post<Booking>('/api/bookings', bookingData);
    return response.data;
  }

  async getBooking(id: string): Promise<Booking> {
    const response = await this.api.get<Booking>(`/api/bookings/${id}`);
    return response.data;
  }

  async updateBooking(id: string, updateData: UpdateBookingRequest): Promise<Booking> {
    const response = await this.api.put<Booking>(`/api/bookings/${id}`, updateData);
    return response.data;
  }

  async cancelBooking(id: string): Promise<Booking> {
    const response = await this.api.delete<Booking>(`/api/bookings/${id}`);
    return response.data;
  }

  async getProviders(): Promise<User[]> {
    const response = await this.api.get<User[]>('/api/providers');
    return response.data;
  }

  async getBookingsByCustomer(customerId: string): Promise<Booking[]> {
    const response = await this.api.get<Booking[]>(`/api/bookings/customer/${customerId}`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService; 