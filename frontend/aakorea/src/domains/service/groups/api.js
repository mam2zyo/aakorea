import { apiFetch } from "../../../shared/api/client";

export function fetchAdminGroups() {
  return apiFetch("/api/admin/groups");
}

export function createAdminGroup(payload) {
  return apiFetch("/api/admin/groups", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function updateAdminGroup(groupId, payload) {
  return apiFetch(`/api/admin/groups/${groupId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function deleteAdminGroup(groupId) {
  return apiFetch(`/api/admin/groups/${groupId}`, {
    method: "DELETE",
  });
}
