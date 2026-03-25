import { apiFetch } from "../../../shared/api/client";

export function fetchAdminGroupMeetings(groupId) {
  return apiFetch(`/api/admin/groups/${groupId}/meetings`);
}

export function createAdminGroupMeeting(groupId, payload) {
  return apiFetch(`/api/admin/groups/${groupId}/meetings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function updateAdminGroupMeeting(groupId, meetingId, payload) {
  return apiFetch(`/api/admin/groups/${groupId}/meetings/${meetingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function deleteAdminGroupMeeting(groupId, meetingId) {
  return apiFetch(`/api/admin/groups/${groupId}/meetings/${meetingId}`, {
    method: "DELETE",
  });
}
