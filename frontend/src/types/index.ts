export interface User {
  id: string;
  email: string;
  role: 'USER' | 'CREATOR' | 'ADMIN';
  isVerified: boolean;
  createdAt: string;
}

export interface CreatorProfile {
  id: string;
  bio?: string;
  platformLinks?: string;
  audienceSize: number;
  category?: string;
  approvedByAdmin: boolean;
  createdAt: string;
  user: User;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: string;
  creator: User;
}

export interface WaitlistInterest {
  id: string;
  userEmail: string;
  interestedIn: string;
  note?: string;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
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
  status?: 'DRAFT' | 'PUBLISHED';
}
