import { apiFetch } from "../../../../shared/api/client";

export function fetchAdminDistricts() {
  return apiFetch("/api/admin/service/districts");
}

export function createAdminDistrict(payload) {
  return apiFetch("/api/admin/service/districts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function updateAdminDistrict(districtId, payload) {
  return apiFetch(`/api/admin/service/districts/${districtId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function deleteAdminDistrict(districtId) {
  return apiFetch(`/api/admin/service/districts/${districtId}`, {
    method: "DELETE",
  });
}
