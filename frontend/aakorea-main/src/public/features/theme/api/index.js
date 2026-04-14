import { request } from '@/shared/lib/request'

export const publicSiteThemeApi = {
  getPublicTheme() {
    return request('/api/public/theme')
  },
}
