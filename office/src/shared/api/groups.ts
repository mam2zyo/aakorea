import type { AxiosInstance } from 'axios';

export class OfficeGroupApi {
  client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async getGroups() {
    return this.client.get('/api/office/groups');
  }

  async getGroup(id: number) {
    return this.client.get(`/api/office/groups/${id}`);
  }

  async createGroupBulk(payload: Record<string, unknown>[]) {
    return this.client.post('/api/office/groups/bulk', payload);
  }

  async updateGroup(id: number, payload: Record<string, unknown>) {
    return this.client.put(`/api/office/groups/${id}`, payload);
  }

  async deleteGroup(id: number) {
    return this.client.delete(`/api/office/groups/${id}`);
  }
}
