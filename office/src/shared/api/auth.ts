export class OfficeAuthApi {
  client: any;
  constructor(client: any) {
    this.client = client;
  }

  async login(credentials: any) {
    return this.client.post('/api/auth/login', credentials);
  }

  async logout() {
    return this.client.post('/api/auth/logout');
  }

  async me() {
    return this.client.get('/api/auth/me');
  }

  async register(payload: any) {
    return this.client.post('/api/auth/register', payload);
  }
}
