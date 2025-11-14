import { Role, VideoStatus } from '@prisma/client';

export interface UserPayload {
  id: string;
  email: string;
  role: Role;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateCreatorProfileRequest {
  bio?: string;
  platformLinks?: string;
  audienceSize?: number;
  category?: string;
}

export interface CreateVideoRequest {
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  tags?: string[];
  status?: VideoStatus;
}

export interface WaitlistRequest {
  userEmail: string;
  interestedIn: string;
  note?: string;
}

