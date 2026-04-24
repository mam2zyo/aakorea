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

  async uploadContentPage(payload: any) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as any);
      }
    });
    return this.client.post('/api/office/content-pages', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  async deleteContentPage(id: string | number) {
    return this.client.delete(`/api/office/content-pages/${id}`);
  }

  async publishContentPage(id: string | number, payload: { published: boolean }) {
    return this.client.post(`/api/office/content-pages/${id}/publish`, payload);
  }
}
