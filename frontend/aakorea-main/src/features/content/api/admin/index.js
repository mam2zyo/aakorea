import { request } from '../../../../shared/lib/request'

export const adminContentApi = {
  getContentPages() {
    return request(`/api/admin/content-pages?_t=${Date.now()}`)
  },
  getContentPage(id) {
    return request(`/api/admin/content-pages/${id}`)
  },
  uploadContentPage(data) {
    const formData = new FormData()
    formData.append('key', data.key)
    formData.append('title', data.title)
    formData.append('published', data.published)
    if (data.file) {
      formData.append('file', data.file)
    }
    return request('/api/admin/content-pages/upload', {
      method: 'POST',
      body: formData,
    })
  },
  updateContentMetadata(key, data) {
    return request(`/api/admin/content-pages/${key}/metadata`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },
  deleteContentPage(key) {
    return request(`/api/admin/content-pages/${key}`, {
      method: 'DELETE',
    })
  },
  publishContentPage(key) {
    return request(`/api/admin/content-pages/${key}/publish`, {
      method: 'PUT',
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
  deleteNotice(id) {
    return request(`/api/admin/notices/${id}`, {
      method: 'DELETE',
    })
  },
}
