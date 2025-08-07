import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils.js";

const api = new ApiService();
const path = "/privilege";

export function getAllPrivilege(query = {}) {
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`${path}/privileges${qr}`);
}
export function createPrivilege(data) {
  return api.addAuthenticationHeader().post(`${path}`, data);
}

export function deletePrivilege(id) {
  return api.addAuthenticationHeader().delete(`${path}${id}`);
}
export function getPrivilegeById(id) {
  return api.addAuthenticationHeader().get(`${path}${id}`);
}
export function updatePrivilege(id, data) {
  return api.addAuthenticationHeader().put(`${path}${id}`, data);
}

export function changePrivilegeStatus(privilegeId, status) {
  return api
    .addAuthenticationHeader()
    .put(`${path}/${privilegeId}/status`, null, {
      params: { status },
    });
}
