import { request } from '../../../../shared/lib/request'

export const adminMeetingImportApi = {
  normalizeImport(payload) {
    return request('/api/admin/meeting-imports/normalize', {
      method: 'POST',
      body: payload,
    })
  },
  previewImport(payload) {
    return request('/api/admin/meeting-imports/preview', {
      method: 'POST',
      body: payload,
    })
  },
  applyImport(payload) {
    return request('/api/admin/meeting-imports/apply', {
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
