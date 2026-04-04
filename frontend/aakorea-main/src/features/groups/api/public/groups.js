import { request } from '../../../../shared/lib/request'

export const publicGroupApi = {
  getGroup(id) {
    return request(`/api/public/groups/${id}`)
  },
}
