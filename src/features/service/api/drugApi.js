import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils";

const api = new ApiService();
const Path = "/Drug"; // Keep uppercase 'Drug' to match your API

// Or try these alternative paths:
// const Path = "/drugs"; // plural form
// const Path = "/api/drug"; // with api prefix
// const Path = "/service/drug"; // under service module

export function getAllDrugs(providerUuid, query = {}) {
  return api
    .addAuthenticationHeader()
    .get(`${Path}/get/all`, {
      params: query,
    });
}

// Function to get a service by ID
export function getDrugById(id) {
  return api.addAuthenticationHeader().get(`${Path}/${id}`);
}

// Function to create a new service
export function createDrug(id, data) {
  return api.addAuthenticationHeader().post(`${Path}/${id}`, data);
}

// Function to update a service
export async function updateDrug(uuid, data) {
  return api.addAuthenticationHeader().put(`${Path}/${uuid}`, data);
}

// Function to delete a service
export function removeDrug(id) {
  return api.addAuthenticationHeader().delete(`${Path}/${id}`);
}

// Function to import drugs
export function importDrug(id, data, config) {
  const qr = getQueryFormObject(id);
  return api
    .addAuthenticationHeader()
    .post(`${Path}/upload${qr}`, data, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
}
