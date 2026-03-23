import { apiFetch } from './client'

export function fetchGroupDetail(groupId) {
  return apiFetch(`/api/groups/${groupId}`)
}