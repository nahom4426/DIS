import { ref } from 'vue';
import { useApiRequest } from '@/composables/useApiRequest';
import { 
  getAllDrugInformationRequests, 
  submitDrugInformationRequest,
  updateDrugInformationRequestStatus,
  deleteDrugInformationRequest 
} from '../api/drugInformationApi';
import { toasted } from '@/utils/utils';

export function useDrugInformationRequests() {
  const requests = ref([]);
  const loading = ref(false);
  const apiReq = useApiRequest();

  const fetchRequests = (query = {}) => {
    loading.value = true;
    apiReq.send(
      () => getAllDrugInformationRequests(query),
      (response) => {
        if (response.success) {
          requests.value = response.data;
        } else {
          toasted(false, "Failed to fetch requests", response.error);
        }
        loading.value = false;
      }
    );
  };

  const submitRequest = (data) => {
    return new Promise((resolve, reject) => {
      apiReq.send(
        () => submitDrugInformationRequest(data),
        (response) => {
          if (response.success) {
            requests.value.unshift(response.data);
            toasted(true, "Request submitted successfully");
            resolve(response.data);
          } else {
            toasted(false, "Failed to submit request", response.error);
            reject(response.error);
          }
        }
      );
    });
  };

  const updateStatus = (id, status) => {
    apiReq.send(
      () => updateDrugInformationRequestStatus(id, status),
      (response) => {
        if (response.success) {
          const index = requests.value.findIndex(req => req.id === id);
          if (index !== -1) {
            requests.value[index] = { ...requests.value[index], status };
          }
          toasted(true, "Status updated successfully");
        } else {
          toasted(false, "Failed to update status", response.error);
        }
      }
    );
  };

  return {
    requests,
    loading,
    fetchRequests,
    submitRequest,
    updateStatus
  };
}/