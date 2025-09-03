import ApiService from "@/service/ApiService";
const api = new ApiService();

export function getUserQuestions(userUuid) {
  return api
    .addAuthenticationHeader()
    .get(`/question/user/${userUuid}`);
}

export function updateQuestion(questionUuid, data) {
  // Use PUT or PATCH depending on your backend implementation
  return api
    .addAuthenticationHeader()
    .put(`/question/update/${questionUuid}`, data);
}

export function deleteQuestion(questionUuid) {
  return api
    .addAuthenticationHeader()
    .delete(`/question/delete/${questionUuid}`);
}

