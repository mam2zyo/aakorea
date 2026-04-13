import { request } from '../../../../shared/lib/request'
import { withQuery } from '../query'

export const publicMeetingApi = {
  getMeetings(filters = {}) {
    return request(withQuery('/api/public/meetings', filters))
  },
}
