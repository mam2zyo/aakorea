import { apiFetch } from './client'

export function fetchAdminGroupNotices(groupId) {
  return apiFetch(`/api/admin/groups/${groupId}/notices`)
}

export function createAdminGroupNotice(groupId, payload) {
  return apiFetch(`/api/admin/groups/${groupId}/notices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export function updateAdminGroupNotice(groupId, noticeId, payload) {
  return apiFetch(`/api/admin/groups/${groupId}/notices/${noticeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export function deleteAdminGroupNotice(groupId, noticeId) {
  return apiFetch(`/api/admin/groups/${groupId}/notices/${noticeId}`, {
    method: 'DELETE',
  })
}
