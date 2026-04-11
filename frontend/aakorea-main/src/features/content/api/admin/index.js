import { request } from '../../../../shared/lib/request'

export const adminContentApi = {
  getContentPages() {
    return request(`/api/admin/content-pages?_t=${Date.now()}`)
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
  updateContentPage(id, data) {
    const formData = new FormData()
    formData.append('key', data.key)
    formData.append('title', data.title)
    formData.append('published', data.published)
    if (data.file) {
      formData.append('file', data.file)
    }
    return request(`/api/admin/content-pages/${id}`, {
      method: 'POST',
      body: formData,
    })
  },
  updateContentMetadata(id, data) {
    return request(`/api/admin/content-pages/${id}/metadata`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },
  deleteContentPage(id) {
    return request(`/api/admin/content-pages/${id}`, {
      method: 'DELETE',
    })
  },
  publishContentPage(id, data) {
    return request(`/api/admin/content-pages/${id}/publish?published=${data.published}`, {
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
