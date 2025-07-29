import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils.js";

const api = new ApiService();
const path = "/role";

export function getAllRole(query = {}) {
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`${path}/roles${qr}`);
}
export function getAllHospitals(query = {}) {
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`/hospital/hospitals${qr}`);
}
export function createRole(data) {
  return api.addAuthenticationHeader().post(`${path}`, data);
}
export function getRoleById(id) {
  return api.addAuthenticationHeader().get(`${path}/${id}`);
}
export function updateRolebyId(id, data) {
  return api.addAuthenticationHeader().put(`${path}/${id}`, data);
}
export function removeRoleById(id) {
  return api.addAuthenticationHeader().delete(`${path}/${id}`);
}
export function changeRoleStatus(roleId, status) {
  return api.addAuthenticationHeader().put(`${path}/${roleId}/status`, null, {
    params: { status },
  });
}
