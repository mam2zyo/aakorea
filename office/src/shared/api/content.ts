import type { AxiosInstance } from 'axios';

export class OfficeContentApi {
  client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async getNotices() {
    return this.client.get('/api/office/notices');
  }

  async getContentPages() {
    return this.client.get('/api/office/content-pages');
  }

  async updateContentPage(id: string, payload: Record<string, unknown>) {
    return this.client.put(`/api/office/content-pages/${id}`, payload);
  }

  async uploadContentPage(payload: Record<string, unknown>) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string | Blob);
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
