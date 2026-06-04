import type { AxiosInstance } from 'axios';
import type { components } from './api';

type AttachmentData = components['schemas']['AttachmentData'];

export class OfficeAttachmentApi {
  client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async uploadAttachment(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.client.post('/api/office/attachments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }) as unknown as Promise<AttachmentData>;
  }
}
