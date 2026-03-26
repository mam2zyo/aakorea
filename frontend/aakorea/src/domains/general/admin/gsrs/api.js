import { apiFetch } from "../../../../shared/api/client";

export function fetchAdminGsrs() {
  return apiFetch("/api/admin/service/gsrs");
}

export function createAdminGsr(payload) {
  return apiFetch("/api/admin/service/gsrs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function updateAdminGsr(gsrId, payload) {
  return apiFetch(`/api/admin/service/gsrs/${gsrId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function deleteAdminGsr(gsrId) {
  return apiFetch(`/api/admin/service/gsrs/${gsrId}`, {
    method: "DELETE",
  });
}
