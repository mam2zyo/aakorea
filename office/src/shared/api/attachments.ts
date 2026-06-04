import type { AxiosInstance } from 'axios';

export class OfficeAttachmentApi {
  client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async uploadAttachment(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await this.client.post('/api/office/attachments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }
}
