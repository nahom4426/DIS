import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils.js";

const api = new ApiService();
const path = "auth/users/privilege";

export async function getAllPrivilege(query = {}) {
  const qr = getQueryFormObject(query);
  const response = await api.addAuthenticationHeader().get(`${path}/list${qr}`);
  
  console.log('🔍 Raw API Response:', response);
  
  // Transform the response to match expected structure
  if (response && response.data && response.data.response) {
    const transformed = {
      success: true,
      data: response.data.response, // Extract the privileges array
      totalPages: response.data.totalPages || 1,
      error: null
    };
    console.log('✅ Transformed API Response:', transformed);
    return transformed;
  }
  
  // Fallback if structure is different
  return {
    success: false,
    data: [],
    totalPages: 1,
    error: "Invalid response structure"
  };
}

export function createPrivilege(data) {
  return api.addAuthenticationHeader().post(`${path}/createPrivilege`, data);
}

export function deletePrivilege(id) {
  return api.addAuthenticationHeader().delete(`${path}/${id}`);
}

export function getPrivilegeById(id) {
  return api.addAuthenticationHeader().get(`${path}/${id}`);
}

export function updatePrivilege(id, data) {
  return api.addAuthenticationHeader().put(`${path}/${id}`, data);
}

export function changePrivilegeStatus(privilegeId, status) {
  return api
    .addAuthenticationHeader()
    .put(`${path}/${privilegeId}/status`, null, {
      params: { status },
    });
}
