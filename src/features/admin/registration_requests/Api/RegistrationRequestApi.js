import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils.js";

const api = new ApiService(import.meta.env.VITE_API_URI);
const path = "/auth/users"; // Updated to match actual endpoint

export function getAllRegistrationRequests(query = {}) {
  const qr = getQueryFormObject(query);
  return api
    .addAuthenticationHeader()
    .get(`${path}/all${qr}`)
    .then(response => {
      if (response.success && response.data) {
        // Transform the response to match expected format
        const transformedRequests = (response.data.content || []).map(request => ({
          ...request,
          requestId: request.userUuid,
          fullName: `${request.firstName || ''} ${request.fatherName || ''}`.trim(),
          role: request.roleName,
          submittedDate: request.createdAt,
          status: request.userStatus.toLowerCase()
        }));
        
        return {
          success: true,
          data: {
            requests: transformedRequests,
            totalItems: response.data.totalElements || 0,
            totalPages: response.data.totalPages || 1,
            currentPage: response.data.pageNumber || 0,
          }
        };
      }
      return response;
    })
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to fetch registration requests.",
        data: null,
      };
    });
}

export function approveRegistrationRequest(userUuid, data = {}) {
  return api
    .addAuthenticationHeader()
    .put(`${path}/${userUuid}/approve`, data)
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to approve registration request.",
        data: null,
      };
    });
}

export function rejectRegistrationRequest(userUuid, reason = "") {
  return api
    .addAuthenticationHeader()
    .put(`${path}/${userUuid}`/reject, { reason })
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to reject registration request.",
        data: null,
      };
    });
}

export function getRegistrationRequestDocumentView(fileName) {
  return api
    .addAuthenticationHeader()
    .get(`${path}/document/${fileName}`, {
      responseType: 'blob'
    })
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to fetch document.",
        data: null,
      };
    });
}



