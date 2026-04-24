import type { AxiosInstance } from 'axios';

export class OfficeGroupContactApi {
  client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async updateContact(groupId: number, payload: Record<string, unknown>) {
    return this.client.put(`/api/office/groups/${groupId}/contact`, payload);
  }

  async resetPostalInfo(groupId: number) {
    return this.client.post(`/api/office/groups/${groupId}/contact/reset-postal`);
  }

  // --- useGroupEditor에서 사용하는 메서드 ---

  async getGroupContacts(groupId: number) {
    return this.client.get(`/api/office/groups/${groupId}/contacts`);
  }

  async createGroupContact(payload: { groupId: number } & Record<string, unknown>) {
    return this.client.post(`/api/office/groups/${payload.groupId}/contacts`, payload);
  }

  async updateGroupContact(contactId: number, payload: Record<string, unknown>) {
    return this.client.put(`/api/office/contacts/${contactId}`, payload);
  }
}
