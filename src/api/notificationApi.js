import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils";

const api = new ApiService();
const Path = "api/notifications"; 

export function getNotifications(id) {
  return api.addAuthenticationHeader().get(`${Path}/${id}`);
}


