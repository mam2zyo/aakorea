import { request } from '../../../../shared/lib/request'

export const adminContentApi = {
  getContentPages() {
    return request('/api/admin/content-pages')
  },
  getContentPage(id) {
    return request(`/api/admin/content-pages/${id}`)
  },
  createContentPage(payload) {
    return request('/api/admin/content-pages', {
      method: 'POST',
      body: payload,
    })
  },
  updateContentPage(id, payload) {
    return request(`/api/admin/content-pages/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },
  getNotices() {
    return request('/api/admin/notices')
  },
  getNotice(id) {
    return request(`/api/admin/notices/${id}`)
  },
  createNotice(payload) {
    return request('/api/admin/notices', {
      method: 'POST',
      body: payload,
    })
  },
  updateNotice(id, payload) {
    return request(`/api/admin/notices/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },
}
