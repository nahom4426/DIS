import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils.js";

const api = new ApiService(import.meta.env.VITE_API_URI);
const path = "/auth/users";

export function getAllRegistrationRequests(query = {}) {
  const qr = getQueryFormObject(query);
  return api
    .addAuthenticationHeader()
    .get(`${path}/all${qr}`)
    .then(response => {
      if (response.success && response.data) {
        return {
          success: true,
          data: {
            requests: response.data.content || [],
            totalItems: response.data.totalElements || 0,
            totalPages: response.data.totalPages || 1,
            currentPage: response.data.pageNumber || 0
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
    .put(`${path}/${userUuid}/reject`, { reason })
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to reject registration request.",
        data: null,
      };
    });
}

export function getUserQuestions(userUuid, query = {}) {
  const qr = getQueryFormObject(query);
  return api
    .addAuthenticationHeader()
    .get(`/question/user/${userUuid}${qr}`)
    .then(response => {
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
          error: null
        };
      }
      return response;
    })
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to fetch user questions.",
        data: null,
      };
    });
}

export function getCurrentUserQuestions(query = {}) {
  const qr = getQueryFormObject(query);
  return api
    .addAuthenticationHeader()
    .get(`/question/user/current${qr}`)
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to fetch current user questions.",
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
    .then(response => {
      return {
        success: true,
        data: response,
        error: null
      };
    })
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to fetch document.",
        data: null,
      };
    });
}
