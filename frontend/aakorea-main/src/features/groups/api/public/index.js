import { request } from '../../../../shared/lib/request'

export const publicMeetingApi = {
  getMeetings(filters) {
    return request(withQuery('/api/public/meetings', filters))
  },
  getGroup(id) {
    return request(`/api/public/groups/${id}`)
  },
}

function withQuery(path, params) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  })

  const query = searchParams.toString()
  return query ? `${path}?${query}` : path
}
