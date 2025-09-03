import ApiService from "@/service/ApiService";
const api = new ApiService();

export function getDoctorCommReport(userUuid) {
  return api
    .addAuthenticationHeader()
    .get(`/report/${userUuid}`);
}