import { request } from '@/shared/lib/request'
import { withQuery } from '@/shared/utils/query'

export const adminMeetingApi = {
  getMeetings(filters = {}) {
    return request(withQuery('/api/admin/meetings', filters))
  },
  backfillCoordinates(dryRun = true) {
    return request(withQuery('/api/admin/meetings/backfill-coordinates', { dryRun }), {
      method: 'POST',
    })
  },
  createMeeting(payload) {
    return request('/api/admin/meetings', {
      method: 'POST',
      body: payload,
    })
  },
  updateMeeting(id, payload) {
    return request(`/api/admin/meetings/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },
  deleteMeeting(id) {
    return request(`/api/admin/meetings/${id}`, {
      method: 'DELETE',
    })
  },
}
