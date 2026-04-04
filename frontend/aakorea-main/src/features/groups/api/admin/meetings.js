import { request } from '../../../../shared/lib/request'
import { withQuery } from '../query'

export const adminMeetingApi = {
  getMeetings(filters = {}) {
    return request(withQuery('/api/admin/meetings', filters))
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
