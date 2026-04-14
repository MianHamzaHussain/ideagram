import { apiClient } from './client';

export interface Division {
  id: number;
  name: string;
}

export interface SimpleUser {
  id: number;
  name: string;
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  position: string | null;
  employeeId: string | null;
  email: string;
  phone: string | null;
  division: number | null;
  divisionName: string | null;
  role: string | null;
  roleValue: number | null;
  profile: {
    bio: string | null;
    profilePhoto: string | null;
    coverPhoto: string | null;
  };
}

export interface UserProfileUpdatePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  position?: string;
  employeeId?: string;
  bio?: string;
  division?: number;
  profilePhoto?: string | File;
  coverPhoto?: string | File;
}

export interface UserProfileResponse {
  detail: string;
  user: UserProfile;
}

export const userApi = {
  fetchSimpleUsers: async (params: { 
    project_id?: string; 
    author_id?: number; 
    keyword?: string 
  }): Promise<SimpleUser[]> => {
    const queryParams = new URLSearchParams();
    if (params.project_id) queryParams.append('project_id', params.project_id);
    if (params.author_id) queryParams.append('author_id', params.author_id.toString());
    if (params.keyword) queryParams.append('keyword', params.keyword);

    return apiClient.get<SimpleUser[]>(`simple-user/list/?${queryParams.toString()}`);
  },

  fetchProfile: async (): Promise<UserProfileResponse> => {
    return apiClient.get<UserProfileResponse>('auth/user/');
  },

  fetchDivisions: async (): Promise<Division[]> => {
    return apiClient.get<Division[]>('division/');
  },

  updateProfile: async (data: UserProfileUpdatePayload): Promise<UserProfileResponse> => {
    // If we have a file, we should use FormData, otherwise JSON is fine.
    // apiClient.patch handles Content-Type if it's FormData.
    const hasFile = data.profilePhoto instanceof File || data.coverPhoto instanceof File;
    
    if (hasFile) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      return apiClient.patch<UserProfileResponse>('auth/user/', formData);
    }
    
    return apiClient.patch<UserProfileResponse>('auth/user/', data);
  },
};
