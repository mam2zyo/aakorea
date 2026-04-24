import type { AxiosInstance } from 'axios';

export class OfficeDistrictApi {
  client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async getDistricts() {
    return this.client.get('/api/office/districts');
  }

  async createDistrict(payload: Record<string, unknown>) {
    return this.client.post('/api/office/districts', payload);
  }

  async updateDistrict(id: number, payload: Record<string, unknown>) {
    return this.client.put(`/api/office/districts/${id}`, payload);
  }

  async deleteDistrict(id: number) {
    return this.client.delete(`/api/office/districts/${id}`);
  }
}
