import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils.js";

// Use the specific backend URL for this API
const api = new ApiService();
const path = "/question";
const answerPath = "/answers";

// Get all inquiries by user UUID
export function getAllInquiries(userUuid, query = {}) {
  const qr = getQueryFormObject(query);
  return api
    .addAuthenticationHeader()
    .get(`${path}/by-user/${userUuid}`)
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to fetch inquiries.",
        data: null,
      };
    });
}

// Delete inquiry
export function deleteInquiry(questionUuid) {
  return api
    .addAuthenticationHeader()
    .delete(`${path}/details/${questionUuid}`)
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to delete inquiry.",
        data: null,
      };
    });
}

// Update inquiry status
export function updateInquiryStatus(questionUuid, status) {
  return api
    .addAuthenticationHeader()
    .put(`${path}/${questionUuid}/status`, { questionStatus: status })
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to update inquiry status.",
        data: null,
      };
    });
}

// Create answer for an inquiry
export function createAnswer(answerData) {
  const formData = new FormData();
  
  // Add required fields as per backend controller
  formData.append('answerDescription', answerData.answerDescription);
  formData.append('userUuid', answerData.userUuid);
  formData.append('questionUuid', answerData.questionUuid);
  
  // Add file if provided
  if (answerData.answerDetailFile) {
    formData.append('answerDetailFile', answerData.answerDetailFile);
  }

  return api
    .addAuthenticationHeader()
    .post(`${answerPath}/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to create answer.",
        data: null,
      };
    });
}

// Get specific inquiry by questionUuid - alternative endpoint
export function getInquiryById(questionUuid) {
  return api
    .addAuthenticationHeader()
    .get(`${path}/details/${questionUuid}`) 
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to fetch inquiry.",
        data: null,
      };
    });
}

// Get answers for a specific question
export function getAnswersByQuestionId(questionUuid) {
  return api
    .addAuthenticationHeader()
    .get(`${path}/details/${questionUuid}`)
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to fetch answers.",
        data: null,
      };
    });
}






