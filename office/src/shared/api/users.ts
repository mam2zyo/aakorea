import type { AxiosInstance } from 'axios';

export class OfficeUserApi {
  client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async getWorkspace() {
    return this.client.get('/api/office/workspace');
  }

  async approveUser(id: number) {
    return this.client.post(`/api/office/users/${id}/approve`);
  }

  async rejectUser(id: number) {
    return this.client.post(`/api/office/users/${id}/reject`);
  }
}
