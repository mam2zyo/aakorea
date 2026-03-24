import { apiFetch } from './client'

export function fetchGroupDetail(groupId) {
  return apiFetch(`/api/groups/${groupId}`)
}

export function fetchAdminGroups() {
  return apiFetch('/api/admin/groups')
}

export function createAdminGroup(payload) {
  return apiFetch('/api/admin/groups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export function updateAdminGroup(groupId, payload) {
  return apiFetch(`/api/admin/groups/${groupId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export function deleteAdminGroup(groupId) {
  return apiFetch(`/api/admin/groups/${groupId}`, {
    method: 'DELETE',
  })
}


export function fetchAdminGroupMeetings(groupId) {
  return apiFetch(`/api/admin/groups/${groupId}/meetings`)
}

export function createAdminGroupMeeting(groupId, payload) {
  return apiFetch(`/api/admin/groups/${groupId}/meetings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export function updateAdminGroupMeeting(groupId, meetingId, payload) {
  return apiFetch(`/api/admin/groups/${groupId}/meetings/${meetingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export function deleteAdminGroupMeeting(groupId, meetingId) {
  return apiFetch(`/api/admin/groups/${groupId}/meetings/${meetingId}`, {
    method: 'DELETE',
  })
}
