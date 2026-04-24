import type { AxiosInstance } from 'axios';

export class OfficeGroupContactApi {
  client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  // 사용되지 않음 (레거시 경로 — 백엔드에 해당 엔드포인트 없음)
  // async updateContact(groupId: number, payload: Record<string, unknown>) { ... }
  // async resetPostalInfo(groupId: number) { ... }

  // --- useGroupEditor에서 사용하는 메서드 ---

  /** GET /api/office/group-contacts?groupId={id} */
  async getGroupContacts(groupId: number) {
    return this.client.get('/api/office/group-contacts', { params: { groupId } });
  }

  /** POST /api/office/group-contacts */
  async createGroupContact(payload: { groupId: number } & Record<string, unknown>) {
    return this.client.post('/api/office/group-contacts', payload);
  }

  /** PUT /api/office/group-contacts/{id} */
  async updateGroupContact(contactId: number, payload: Record<string, unknown>) {
    return this.client.put(`/api/office/group-contacts/${contactId}`, payload);
  }
}
