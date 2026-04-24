export class OfficeGroupContactApi {
  client: any;
  constructor(client: any) {
    this.client = client;
  }

  async updateContact(groupId: number, payload: any) {
    return this.client.put(`/api/office/groups/${groupId}/contact`, payload);
  }

  async resetPostalInfo(groupId: number) {
    return this.client.post(`/api/office/groups/${groupId}/contact/reset-postal`);
  }

  // --- useGroupEditor에서 사용하는 메서드 ---

  async getGroupContacts(groupId: number) {
    return this.client.get(`/api/office/groups/${groupId}/contacts`);
  }

  async createGroupContact(payload: any) {
    return this.client.post(`/api/office/groups/${payload.groupId}/contacts`, payload);
  }

  async updateGroupContact(contactId: number, payload: any) {
    return this.client.put(`/api/office/contacts/${contactId}`, payload);
  }
}
