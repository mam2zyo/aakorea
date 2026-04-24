export class OfficeDistrictApi {
  client: any;
  constructor(client: any) {
    this.client = client;
  }

  async getDistricts() {
    return this.client.get('/api/office/districts');
  }

  async createDistrict(payload: any) {
    return this.client.post('/api/office/districts', payload);
  }

  async updateDistrict(id: number, payload: any) {
    return this.client.put(`/api/office/districts/${id}`, payload);
  }

  async deleteDistrict(id: number) {
    return this.client.delete(`/api/office/districts/${id}`);
  }
}
