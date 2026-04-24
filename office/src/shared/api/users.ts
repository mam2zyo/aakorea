import type { AxiosInstance } from 'axios';

export interface CreateUserPayload {
  email: string;
  displayName: string;
  role: string;
  password?: string;
  grantedPermissions?: string[];
}

export interface UpdateUserPayload {
  displayName: string;
  role: string;
  status: string;
  password?: string;
  grantedPermissions?: string[];
}

export class OfficeUserApi {
  client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async getWorkspace() {
    return this.client.get('/api/office/admin-users');
  }

  async createUser(data: CreateUserPayload) {
    return this.client.post('/api/office/admin-users', data);
  }

  async updateUser(id: number, data: UpdateUserPayload) {
    return this.client.put(`/api/office/admin-users/${id}`, data);
  }
}
