import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { CreatorProfile, ApiResponse, CreateCreatorProfileRequest } from '../types';

export function useCreatorProfile() {
  return useQuery({
    queryKey: ['creator-profile'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<CreatorProfile>>('/creator/profile/me');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch creator profile');
    },
    retry: false,
  });
}

export function useCreateCreatorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCreatorProfileRequest) => {
      const response = await api.post<ApiResponse<CreatorProfile>>('/creator/profile', data);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to create creator profile');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-profile'] });
    },
  });
}

