import type { AxiosInstance } from 'axios';

export class OfficeMeetingApi {
  client: AxiosInstance;
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async backfillCoordinates(dryRun: boolean = false) {
    return this.client.post('/api/office/meetings/backfill-coordinates', { dryRun });
  }

  async getMeetings(params?: { groupId?: number }) {
    return this.client.get('/api/office/meetings', { params });
  }

  // --- useGroupEditor에서 사용하는 메서드 ---

  async createMeeting(payload: Record<string, unknown>) {
    return this.client.post('/api/office/meetings', payload);
  }

  async updateMeeting(meetingId: number, payload: Record<string, unknown>) {
    return this.client.put(`/api/office/meetings/${meetingId}`, payload);
  }

  async deleteMeeting(meetingId: number) {
    return this.client.delete(`/api/office/meetings/${meetingId}`);
  }
}
