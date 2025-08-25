import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils.js";

const api = new ApiService(import.meta.env.VITE_API_URI);
const path = "/auth/users";

function normalizeBackendResponse(res) {
  // Support both shapes: { data: { content... } } or { content... }
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
    userStatus: (request.userStatus || '').toLowerCase(),
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
    .put(`${path}/${userUuid}/approve`, body)
    .then((res) => ({ success: true, data: res?.data ?? res, error: null }))
    .catch((error) => ({
      success: false,
      error: error?.message || "Failed to approve registration request.",
      data: null,
    }));
}

export function rejectRegistrationRequest(userUuid, reason = "") {
  return api
    .addAuthenticationHeader()
    .put(`${path}/${userUuid}/reject`, { reason })
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
      error: error?.message || "Failed to fetch document.",
      data: null,
    };
  }
}
