import type { AxiosInstance } from 'axios';
import type { LoginCredentials, RegisterPayload } from '@/shared/types/auth';

export class OfficeAuthApi {
  client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async login(credentials: LoginCredentials) {
    return this.client.post('/api/auth/login', credentials);
  }

  async logout() {
    return this.client.post('/api/auth/logout');
  }

  async me() {
    return this.client.get('/api/auth/me');
  }

  async register(payload: RegisterPayload) {
    return this.client.post('/api/auth/register', payload);
  }
}
