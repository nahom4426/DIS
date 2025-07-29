import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils.js";

const api = new ApiService(import.meta.env.VITE_API_URI);
const path = "/drug-information-requests";

// Submit a new drug information request
export function submitDrugInformationRequest(data) {
  return api
    .addAuthenticationHeader()
    .post(`${path}`, data)
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to submit drug information request.",
        data: null,
      };
    });
}

// Get all drug information requests with optional query filters
export function getAllDrugInformationRequests(query = {}) {
  const qr = getQueryFormObject(query);
  return api
    .addAuthenticationHeader()
    .get(`${path}${qr}`)
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to fetch drug information requests.",
        data: null,
      };
    });
}

// Get a specific drug information request by ID
export function getDrugInformationRequestById(requestId) {
  return api
    .addAuthenticationHeader()
    .get(`${path}/${requestId}`)
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to fetch drug information request.",
        data: null,
      };
    });
}

// Update request status (for pharmacists/admins)
export function updateDrugInformationRequestStatus(requestId, status, response = null) {
  const data = { status };
  if (response) {
    data.response = response;
    data.respondedAt = new Date().toISOString();
  }
  
  return api
    .addAuthenticationHeader()
    .put(`${path}/${requestId}/status`, data)
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to update request status.",
        data: null,
      };
    });
}

// Get requests by user (for user's own requests)
export function getUserDrugInformationRequests(userId, query = {}) {
  const qr = getQueryFormObject(query);
  return api
    .addAuthenticationHeader()
    .get(`${path}/user/${userId}${qr}`)
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to fetch user's drug information requests.",
        data: null,
      };
    });
}