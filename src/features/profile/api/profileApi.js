import ApiService from "@/service/ApiService";

const api = new ApiService();
const basePath = "/user";

export function getPersonalDetails(userId) {
  return api
    .addAuthenticationHeader()
 
 .get(`${basePath}/${userId}/details`);
}


export function uploadProfilePicture(formData) {
  return api
    .addAuthenticationHeader()
    .put(`/user/update/profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
}

export function changePassword(id,data) {
  return api
    .addAuthenticationHeader()
    .put(`${basePath}/changepassword/${id}`, data);
}

export function updateProfileData(id, data) {
  // Ensure 'lastName' is always present in FormData
  if (data instanceof FormData && !data.has('lastName')) {
    data.append('lastName', '');
  }
  return api
    .addAuthenticationHeader()
    .put(`/user/update/profile`, data);
}

