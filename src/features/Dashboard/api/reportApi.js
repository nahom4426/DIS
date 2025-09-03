import ApiService from "@/service/ApiService";
const api = new ApiService();


export function getGeneralReport() {
  return api
    .addAuthenticationHeader()
    .get(`/report/`);
}