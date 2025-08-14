import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils.js";

// Use the specific backend URL for drug lookup
const api = new ApiService("http://192.168.100.57:8280");
const path = "/api/medco-EDIS/v1/Drug/search";

// Search drugs
export function searchDrugs(query = {}) {
  const qr = getQueryFormObject(query);
  return api
    .addAuthenticationHeader()
    .get(`${path}${qr}`)
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to search drugs.",
        data: null,
      };
    });
}

// Get drug details by ID
export function getDrugDetails(drugId) {
  return api
    .addAuthenticationHeader()
    .get(`/api/medco-EDIS/v1/Drug/${drugId}`)
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to fetch drug details.",
        data: null,
      };
    });
}