import { request } from '@/shared/lib/request'

export const publicDistrictApi = {
  getDistricts() {
    return request('/api/public/districts')
  },
}
