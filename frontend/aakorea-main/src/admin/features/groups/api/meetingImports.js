import { request } from '@/shared/lib/request'

export const adminMeetingImportApi = {
  applyImportHtml(payload) {
    return request('/api/admin/meeting-imports/apply-html', {
      method: 'POST',
      body: payload,
    })
  },
  resetImportData() {
    return request('/api/admin/meeting-imports/reset', {
      method: 'POST',
    })
  },
}
