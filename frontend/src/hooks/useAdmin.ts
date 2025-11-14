import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { CreatorProfile, ApiResponse } from '../types';

export function usePendingCreators() {
  return useQuery({
    queryKey: ['pending-creators'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<CreatorProfile[]>>('/admin/creators/pending');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch pending creators');
    },
  });
}

export function useApproveCreator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (creatorId: string) => {
      const response = await api.patch<ApiResponse<CreatorProfile>>(
        `/admin/creators/${creatorId}/approve`
      );
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to approve creator');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-creators'] });
      queryClient.invalidateQueries({ queryKey: ['creator-profile'] });
    },
  });
}

