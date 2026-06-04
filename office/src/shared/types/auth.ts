export interface UserSession {
  authenticated: boolean;
  userId: number | null;
  email: string | null;
  username: string | null;
  displayName: string | null;
  role: string | null;
  status: string | null;
  permissions: string[];
}

export const UNAUTHENTICATED_SESSION: UserSession = {
  authenticated: false,
  userId: null,
  email: null,
  username: null,
  displayName: null,
  role: null,
  status: null,
  permissions: [],
};

export interface LoginCredentials {
  username?: string;
  email?: string;
  password?: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  displayName: string;
  phoneNumber?: string;
}
