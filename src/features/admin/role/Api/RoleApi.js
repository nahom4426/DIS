import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils.js";

const api = new ApiService();
const path = "/auth/role";

export function getAllRoles(query = {}) {
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`${path}/getAll${qr}`)
    .then(response => {
      console.log('🔍 Raw getAllRoles API Response:', response);
      
      // Check if response has the expected structure
      if (response && response.data && response.data.content) {
        const result = {
          success: true,
          data: response.data.content, // Extract the roles array
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 1,
          pageNumber: response.data.pageNumber || 0
        };
        console.log('✅ Processed getAllRoles Response:', result);
        return result;
      }
      
      // Fallback if structure is different
      return {
        success: false,
        data: [],
        error: "Invalid response structure"
      };
    })
    .catch(error => {
      console.error('❌ getAllRoles API Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch roles',
        data: []
      };
    });
}
export function getAllHospitals(query = {}) {
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`/provider/list/all${qr}`);
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
