import { request } from '../../../../shared/lib/request'
import { withQuery } from '../query'

export const adminGroupApi = {
  getGroups(districtId) {
    return request(withQuery('/api/admin/groups', {
      districtId,
    }))
  },
  createGroup(payload) {
    return request('/api/admin/groups', {
      method: 'POST',
      body: payload,
    })
  },
  updateGroup(id, payload) {
    return request(`/api/admin/groups/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },
  deleteGroup(id) {
    return request(`/api/admin/groups/${id}`, {
      method: 'DELETE',
    })
  },
}
