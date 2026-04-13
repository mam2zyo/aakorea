import { request } from '../../../../shared/lib/request'

export const adminSiteThemeApi = {
  getPublicThemeState() {
    return request('/api/admin/public-theme')
  },
  savePublicThemeDraft(payload) {
    return request('/api/admin/public-theme/draft', {
      method: 'PUT',
      body: payload,
    })
  },
  publishPublicTheme() {
    return request('/api/admin/public-theme/publish', {
      method: 'POST',
    })
  },
  rollbackPublicTheme() {
    return request('/api/admin/public-theme/rollback', {
      method: 'POST',
    })
  },
}
