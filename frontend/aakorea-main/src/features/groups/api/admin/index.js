import { request } from '../../../../shared/lib/request'

export const adminGroupApi = {
  getGroups(districtId) {
    return request(withQuery('/api/admin/groups', {
      districtId,
    }))
  },
  createGroup(payload) {
    return request('/api/admin/groups', {
      method: 'POST',
      body: payload,
    })
  },
  updateGroup(id, payload) {
    return request(`/api/admin/groups/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },
  deleteGroup(id) {
    return request(`/api/admin/groups/${id}`, {
      method: 'DELETE',
    })
  },
  getGroupContacts(groupId) {
    return request(withQuery('/api/admin/group-contacts', {
      groupId,
    }))
  },
  createGroupContact(payload) {
    return request('/api/admin/group-contacts', {
      method: 'POST',
      body: payload,
    })
  },
  updateGroupContact(id, payload) {
    return request(`/api/admin/group-contacts/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },
}

export const adminMeetingApi = {
  getMeetings(filters = {}) {
    return request(withQuery('/api/admin/meetings', filters))
  },
  createMeeting(payload) {
    return request('/api/admin/meetings', {
      method: 'POST',
      body: payload,
    })
  },
  updateMeeting(id, payload) {
    return request(`/api/admin/meetings/${id}`, {
      method: 'PUT',
      body: payload,
    })
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
