import type { AxiosInstance } from 'axios';
import type { components } from './api';

type AssetUploadResponse = components['schemas']['AssetUploadResponse'];

export class OfficeAssetApi {
  client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async uploadAsset(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.client.post('/api/office/assets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }) as unknown as Promise<AssetUploadResponse>;
  }
}
