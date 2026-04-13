import { request } from '../../../../shared/lib/request'

export const adminDistrictApi = {
  getDistricts() {
    return request('/api/admin/districts')
  },
  createDistrict(payload) {
    return request('/api/admin/districts', {
      method: 'POST',
      body: payload,
    })
  },
  updateDistrict(id, payload) {
    return request(`/api/admin/districts/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },
  deleteDistrict(id) {
    return request(`/api/admin/districts/${id}`, {
      method: 'DELETE',
    })
  },
}
