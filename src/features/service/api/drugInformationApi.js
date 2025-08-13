import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils.js";

// Use the correct base URL and path
const api = new ApiService(import.meta.env.VITE_API_URI || import.meta.env.v_API_URI);
const Path = "/question";

// Submit drug information request - fixed to match backend expectation
export function submitDrugInformationRequest(data) {
  const formattedData = {
    description: data.description,
    questionStatus: data.questionStatus || "UNANSWERED",
    patientAge: Number(data.patientAge) || 0,
    patientType: data.patientType || "PATIENT_SPECIFIC",
    patientGender: data.patientGender,
    weight: Number(data.weight) || 0,
    diagnosis: data.diagnosis || "",
    currentMedication: data.currentMedication || "",
    concurrentMedication: data.concurrentMedication || "",
    allergies: data.allergies || "",
    otherInformation: data.otherInformation || "",
    responseUrgency: data.responseUrgency || "",
    userUuid: data.userUuid || ""
  };

  console.log('Sending question data:', formattedData);

  return api
    .addAuthenticationHeader()
    .post(`${Path}/create`, formattedData)
    .then((response) => {
      console.log('Question created successfully:', response);
      return {
        success: true,
        data: response.data || response,
        error: null
      };
    })
    .catch((error) => {
      console.error('Question creation failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Failed to submit drug information request. Server error.",
        data: null,
      };
    });
}

// Get all drug information requests with filtering
export function getAllDrugInformationRequests(query = {}) {
  const qr = getQueryFormObject(query);
  return api
    .addAuthenticationHeader()
    .get(`${Path}/questions${qr}`)
    .then((response) => {
      console.log('API Response:', response);
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.content || response.data,
          error: null
        };
      }
      return response;
    })
    .catch((error) => {
      console.error('Failed to fetch requests:', error);
      return {
        success: false,
        error: error.message || "Failed to fetch drug information requests.",
        data: null,
      };
    });
}

// Get requests by status
export function getRequestsByStatus(status, query = {}) {
  const queryParams = {
    ...query,
    questionStatus: status
  };
  return getAllDrugInformationRequests(queryParams);
}

// Get unanswered requests specifically
export function getUnansweredRequests(query = {}) {
  return getRequestsByStatus('UNANSWERED', query);
}

// Get drug information request by ID
export function getDrugInformationRequestById(id) {
  return api.addAuthenticationHeader().get(`${Path}/${id}`);
}

export function createQuestion(data) {
  return api.addAuthenticationHeader().post(`${Path}/create`, data);
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



