import { useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { ApiResponse, WaitlistInterest } from '../types';

interface WaitlistRequest {
  userEmail: string;
  interestedIn: string;
  note?: string;
}

export function useJoinWaitlist() {
  return useMutation({
    mutationFn: async (data: WaitlistRequest) => {
      const response = await api.post<ApiResponse<WaitlistInterest>>('/waitlist', data);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to join waitlist');
    },
  });
}

