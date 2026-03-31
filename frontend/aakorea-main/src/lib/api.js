const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status ?? 500
    this.fields = options.fields ?? null
  }
}

async function request(path, options = {}) {
  const { method = 'GET', body } = options
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  const payload = await readJson(response)
  if (!response.ok) {
    throw new ApiError(payload?.error?.message ?? '요청을 처리하지 못했습니다.', {
      status: response.status,
      fields: payload?.error?.fields ?? null,
    })
  }

  return payload?.data ?? null
}

async function readJson(response) {
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return null
  }

  return response.json()
}

function queryString(params) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const authApi = {
  login(credentials) {
    return request('/api/auth/login', { method: 'POST', body: credentials })
  },
  logout() {
    return request('/api/auth/logout', { method: 'POST' })
  },
  me() {
    return request('/api/auth/me')
  },
}

export const adminOrgApi = {
  getDistricts() {
    return request('/api/admin/districts')
  },
  createDistrict(payload) {
    return request('/api/admin/districts', { method: 'POST', body: payload })
  },
  updateDistrict(id, payload) {
    return request(`/api/admin/districts/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },
  getGroups(filters = {}) {
    return request(`/api/admin/groups${queryString(filters)}`)
  },
  createGroup(payload) {
    return request('/api/admin/groups', { method: 'POST', body: payload })
  },
  updateGroup(id, payload) {
    return request(`/api/admin/groups/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },
  getGroupContacts(filters = {}) {
    return request(`/api/admin/group-contacts${queryString(filters)}`)
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
    return request(`/api/admin/meetings${queryString(filters)}`)
  },
  createMeeting(payload) {
    return request('/api/admin/meetings', { method: 'POST', body: payload })
  },
  updateMeeting(id, payload) {
    return request(`/api/admin/meetings/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },
}

export const adminContentApi = {
  getContentPages() {
    return request('/api/admin/content-pages')
  },
  getContentPage(id) {
    return request(`/api/admin/content-pages/${id}`)
  },
  createContentPage(payload) {
    return request('/api/admin/content-pages', { method: 'POST', body: payload })
  },
  updateContentPage(id, payload) {
    return request(`/api/admin/content-pages/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },
  getNotices() {
    return request('/api/admin/notices')
  },
  getNotice(id) {
    return request(`/api/admin/notices/${id}`)
  },
  createNotice(payload) {
    return request('/api/admin/notices', { method: 'POST', body: payload })
  },
  updateNotice(id, payload) {
    return request(`/api/admin/notices/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },
}

export const publicMeetingApi = {
  getMeetings(filters) {
    return request(`/api/public/meetings${queryString(filters)}`)
  },
  getMeeting(id) {
    return request(`/api/public/meetings/${id}`)
  },
}

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
