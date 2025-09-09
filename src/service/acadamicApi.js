import ApiService from "@/service/ApiService";
const api = new ApiService();

export function submitAcademicRequest(userUuid, data) {
  // Ensure the payload keys match backend expectations exactly
  // If backend expects 'description', 'questionStatus', 'responseUrgency', send them as is
  return api
    .addAuthenticationHeader()
    .post(`/academic/create/${userUuid}`, {
      description: data.description,
      questionStatus: data.questionStatus,
      responseUrgency: data.responseUrgency
    });
}
