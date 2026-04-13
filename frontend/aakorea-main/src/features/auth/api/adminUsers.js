import { request } from '../../../shared/lib/request'

export const adminUserApi = {
  getWorkspace() {
    return request('/api/admin/admin-users')
  },
  createUser(payload) {
    return request('/api/admin/admin-users', {
      method: 'POST',
      body: payload,
    })
  },
  updateUser(id, payload) {
    return request(`/api/admin/admin-users/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },
}
