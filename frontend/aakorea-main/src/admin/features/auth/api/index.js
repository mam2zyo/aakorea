import { request } from '../../../../shared/lib/request'

export const authApi = {
  login(credentials) {
    return request('/api/auth/login', {
      method: 'POST',
      body: credentials,
    })
  },
  register(payload) {
    return request('/api/auth/register', {
      method: 'POST',
      body: payload,
    })
  },
  logout() {
    return request('/api/auth/logout', {
      method: 'POST',
    })
  },
  me() {
    return request('/api/auth/me')
  },
}
