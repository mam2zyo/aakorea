export class OfficeAssetApi {
  client: any;
  constructor(client: any) {
    this.client = client;
  }

  async uploadAsset(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await this.client.post('/api/office/assets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }
}
