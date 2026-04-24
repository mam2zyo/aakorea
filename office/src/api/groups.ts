export class OfficeGroupApi {
  client: any;
  constructor(client: any) {
    this.client = client;
  }

  async getGroups() {
    return this.client.get('/api/office/groups');
  }

  async getGroup(id: number) {
    return this.client.get(`/api/office/groups/${id}`);
  }

  async createGroupBulk(payload: any) {
    return this.client.post('/api/office/groups/bulk', payload);
  }

  async updateGroup(id: number, payload: any) {
    return this.client.put(`/api/office/groups/${id}`, payload);
  }

  async deleteGroup(id: number) {
    return this.client.delete(`/api/office/groups/${id}`);
  }
}
