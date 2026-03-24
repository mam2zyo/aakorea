import { apiFetch } from './client'

export function fetchAdminDistricts() {
  return apiFetch('/api/admin/districts')
}

export function createAdminDistrict(payload) {
  return apiFetch('/api/admin/districts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export function updateAdminDistrict(districtId, payload) {
  return apiFetch(`/api/admin/districts/${districtId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export function deleteAdminDistrict(districtId) {
  return apiFetch(`/api/admin/districts/${districtId}`, {
    method: 'DELETE',
  })
}
