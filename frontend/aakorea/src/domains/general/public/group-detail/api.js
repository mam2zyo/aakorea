import { apiFetch } from "../../../../shared/api/client";

export function fetchGroupDetail(groupId) {
  return apiFetch(`/api/basic/groups/${groupId}`);
}
