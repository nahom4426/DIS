import ApiService from "@/service/ApiService";
const api = new ApiService();

export function getUserQuestions(userUuid) {
  return api
    .addAuthenticationHeader()
    .get(`/question/user/${userUuid}`);
}