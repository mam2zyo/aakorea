export class OfficeContentApi {
  client: any;
  constructor(client: any) {
    this.client = client;
  }

  async getNotices() {
    return this.client.get('/api/office/notices');
  }

  async getContentPages() {
    return this.client.get('/api/office/content-pages');
  }

  async updateContentPage(id: string, payload: any) {
    return this.client.put(`/api/office/content-pages/${id}`, payload);
  }
}
