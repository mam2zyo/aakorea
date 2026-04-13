import { request } from '../../../../shared/lib/request'
import { withQuery } from '../query'

export const adminGroupContactApi = {
  getGroupContacts(groupId) {
    return request(withQuery('/api/admin/group-contacts', {
      groupId,
    }))
  },
  createGroupContact(payload) {
    return request('/api/admin/group-contacts', {
      method: 'POST',
      body: payload,
    })
  },
  updateGroupContact(id, payload) {
    return request(`/api/admin/group-contacts/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },
}
