import { request } from '../../../../shared/lib/request'

export const publicContentApi = {
  getContentPage(key) {
    return request(`/api/public/content-pages/${encodeURIComponent(key)}`)
  },
  getNotices() {
    return request('/api/public/notices')
  },
  getNotice(id) {
    return request(`/api/public/notices/${id}`)
  },
}
