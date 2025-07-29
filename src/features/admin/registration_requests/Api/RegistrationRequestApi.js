import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils.js";

const api = new ApiService(import.meta.env.v_API_URI);
const path = "/registration-requests";

export function getAllRegistrationRequests(query = {}) {
  const qr = getQueryFormObject(query);
  // For demo purposes, return mock data
  return Promise.resolve({
    success: true,
    data: {
      requests: [
        {
          requestId: "REQ001",
          fullName: "Dr. Sarah Johnson",
          email: "sarah.johnson@email.com",
          phoneNumber: "+251911234567",
          userType: "doctor",
          licenseNumber: "MD-2024-001",
          specialization: "Cardiology",
          submittedDate: "2024-01-15T10:30:00Z",
          status: "pending"
        },
        {
          requestId: "REQ002", 
          fullName: "John Smith",
          email: "john.smith@pharmacy.com",
          phoneNumber: "+251922345678",
          userType: "pharmacist",
          licenseNumber: "PH-2024-002",
          specialization: "Clinical Pharmacy",
          submittedDate: "2024-01-14T14:20:00Z",
          status: "approved"
        },
        {
          requestId: "REQ003",
          fullName: "Dr. Michael Brown",
          email: "m.brown@hospital.com", 
          phoneNumber: "+251933456789",
          userType: "doctor",
          licenseNumber: "MD-2024-003",
          specialization: "Pediatrics",
          submittedDate: "2024-01-13T09:15:00Z",
          status: "rejected"
        },
        {
          requestId: "REQ004",
          fullName: "Lisa Wilson",
          email: "lisa.wilson@pharma.com",
          phoneNumber: "+251944567890",
          userType: "pharmacist", 
          licenseNumber: "PH-2024-004",
          specialization: "Hospital Pharmacy",
          submittedDate: "2024-01-12T16:45:00Z",
          status: "pending"
        }
      ],
      totalItems: 4,
      totalPages: 1,
      currentPage: 1
    }
  });
}

export function approveRegistrationRequest(requestId, data = {}) {
  return api
    .addAuthenticationHeader()
    .put(`${path}/${requestId}/approve`, data)
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to approve registration request.",
        data: null,
      };
    });
}

export function rejectRegistrationRequest(requestId, reason = "") {
  return api
    .addAuthenticationHeader()
    .put(`${path}/${requestId}/reject`, { reason })
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to reject registration request.",
        data: null,
      };
    });
}

export function getRegistrationRequestById(requestId) {
  return api.addAuthenticationHeader().get(`${path}/${requestId}`);
}

export function getRegistrationRequestDocumentView(fileName) {
  return api
    .addAuthenticationHeader()
    .get(`${path}/documents/${fileName}`, { responseType: 'blob' })
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to fetch document.",
        data: null,
      };
    });
}




