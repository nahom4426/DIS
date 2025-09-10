import ApiService from "@/service/ApiService";

const api = new ApiService();
const basePath = "/auth/users/changePassword";

export function changePassword(userUuid, payload) {
  return api
    .addAuthenticationHeader()
    .put(`${basePath}/${userUuid}`, payload);
}