import { Role } from '@/prisma/prisma/client';

export interface User {
  id: string;
  country_code?: string;
  phone_number: string;
  role?: Role;

  is_active?: boolean;
  is_verified?: boolean;

  created_at?: Date;
  updated_at?: Date;
}

export interface UserLogin {
  cookie: string; 
  user: UserResponse
}


export interface UserResponse {
  id: string;
  email: string;
  is_active?: boolean;
  is_verified?: boolean;
  access_token: string;
}

