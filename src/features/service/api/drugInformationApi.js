import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils.js";

const api = new ApiService();
const Path = "/api/physician/questions";

// Submit drug information request
export function submitDrugInformationRequest(data) {
  const formattedData = {
    ...data,
    requestType: data.requestType?.toLowerCase(),
    submittedAt: new Date().toISOString(),
    status: 'PENDING_REVIEW'
  };

  return api
    .addAuthenticationHeader()
    .post(`${Path}`, formattedData)
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to submit drug information request. Server error.",
        data: null,
      };
    });
}

// Get all drug information requests with pagination
export function getAllDrugInformationRequests(query = {}) {
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`${Path}/questions${qr}`);
}

// Get drug information request by ID
export function getDrugInformationRequestById(id) {
  return api.addAuthenticationHeader().get(`${Path}/${id}`);
}

// Update drug information request status
export function updateDrugInformationRequestStatus(id, status) {
  return api
    .addAuthenticationHeader()
    .put(`${Path}/${id}/status`, { status })
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to update request status.",
        data: null,
      };
    });
}


// Delete drug information request
export function deleteDrugInformationRequest(id) {
  return api.addAuthenticationHeader().delete(`${Path}/${id}`);
}

// Get requests by user
export function getUserDrugInformationRequests(userId, query = {}) {
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`${Path}/user/${userId}${qr}`);
}