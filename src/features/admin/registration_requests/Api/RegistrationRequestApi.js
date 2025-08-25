import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils.js";

const api = new ApiService(import.meta.env.VITE_API_URI);
const path = "/auth/users";
function normalizeStatus(status) {
  if (!status) return "Unknown";
  switch (status.toUpperCase()) {
    case "PENDING": return "Pending";
    case "APPROVED": return "Active";
    case "REJECTED": return "Rejected";
    case "DEACTIVATED": return "Deactivated";
    default: return status;
  }
}

// ✅ then your normalizeBackendResponse
function normalizeBackendResponse(res) {
  const raw = res?.data?.content ? res.data : res;
  if (!raw?.content) return null;

  const transformedRequests = raw.content.map(request => ({
    userUuid: request.userUuid,
    requestId: request.userUuid,
    fullName: `${request.title || ''} ${request.firstName || ''} ${request.fatherName || ''}`.trim(),
    email: request.email,
    roleName: request.roleName,
    providerName: request.providerName,
    mobilePhone: request.mobilePhone,
    createdAt: request.createdAt,
    userStatus: normalizeStatus(request.userStatus), // 👈 used here
    userType: request.userType,
    gender: request.gender,
    profilePicture: request.profilePicture
  }));

  return {
    requests: transformedRequests,
    totalItems: raw.totalElements ?? 0,
    totalPages: raw.totalPages ?? 1,
    currentPage: raw.pageNumber ?? 0,
    pageSize: raw.pageSize ?? 25,
  };
}


export function getAllRegistrationRequests(query = {}) {
  const qr = getQueryFormObject(query);
  return api
    .addAuthenticationHeader()
    .get(`${path}/get/inactive/users${qr}`)
    .then((res) => {
      const data = normalizeBackendResponse(res);
      if (!data) {
        return { success: false, error: "Invalid response format", data: null };
      }
      return { success: true, data, error: null };
    })
    .catch((error) => ({
      success: false,
      error: error?.message || "Failed to fetch registration requests.",
      data: null,
    }));
}

export function approveRegistrationRequest(userUuid, body = {}) {
  return api
    .addAuthenticationHeader()
    .put(`${path}/update/status/${userUuid}`)
    .then((res) => ({ success: true, data: res?.data ?? res, error: null }))
    .catch((error) => ({
      success: false,
      error: error?.message ||  "Failed to approve registration request.",
      data: null,
    }));
}

export function rejectRegistrationRequest(userUuid, reason = "") {
  return api
    .addAuthenticationHeader()
    .put(`${path}/delete/${userUuid}`)
    .then((res) => ({ success: true, data: res?.data ?? res, error: null }))
    .catch((error) => ({
      success: false,
      error: error?.message || "Failed to reject registration request.",
      data: null,
    }));
}

export async function getRegistrationRequestDocumentView(query = {}) {
  const qr = getQueryFormObject(query);
  try {
    const res = await api
      .addAuthenticationHeader()
      .get(`${path}/get/inactive/users${qr}`, { responseType: "json" });

    return { success: true, data: res?.data ?? res, error: null };
  } catch (error) {
    return {
      success: false,
      error: error?.message ||  "Failed to fetch document.",
      data: null,
    };}
  }
    export function deactivateRegistrationRequest(userUuid) {
  return api
    .addAuthenticationHeader()
    .put(`${path}/delete/${userUuid}`)
    .then((res) => ({ success: true, data: res?.data ?? res, error: null }))
    .catch((error) => ({
      success: false,
      error: error?.message || "Failed to deactivate user.",
      data: null,
    }));
   
    

}

  
