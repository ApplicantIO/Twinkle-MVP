import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Video, ApiResponse, CreateVideoRequest } from '../types';

export function useVideos() {
  return useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Video[]>>('/videos');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch videos');
    },
  });
}

export function useMyVideos() {
  return useQuery({
    queryKey: ['my-videos'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Video[]>>('/creator/videos/me');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch videos');
    },
  });
}

export function useCreateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVideoRequest) => {
      const response = await api.post<ApiResponse<Video>>('/creator/videos', data);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to create video');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-videos'] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}

