import axios from "axios";
import { responseHandler } from "./ApiResponseHandler";
import type { AsyncResponse } from "@/types/interface";
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { useAuthStore } from "@/stores/auth";
import { onUnmounted } from 'vue'
import { useSignal } from "@/composables/useSignal";

export const backendApi = import.meta.env?.v_API_URI

export default class ApiService {

  api: AxiosInstance

  constructor(baseURL?: string) {
    const apiUrl = baseURL || import.meta.env.v_API_URI;
    
    console.log('🔧 Initializing API with URL:', apiUrl); // Debug log
    
    this.api = axios.create({
      baseURL: apiUrl,
      validateStatus: (status: number) => {
        return status < 300 && status >= 200;
      },
    });
  }

  async get<T>(url: string, config: AxiosRequestConfig = {}): Promise<AsyncResponse<T>> {
    const signal = useSignal()
    return await responseHandler<T>(
      this.api({
        signal: signal.signal.value,
        ...config,
        headers: {
          ...(config?.headers || {}),
        },
        url,
        method: "get",
      })
    );
  }

  async post<T, D = any>(url: string, data: D, config: AxiosRequestConfig = {}) {
    const signal = useSignal()
    return await responseHandler<T>(
      this.api({
        signal: signal.signal.value,
        ...config,
        headers: {
          ...(config?.headers || {}),
        },
        data,
        url,
        method: "post",
      })
    );
  }

  async put<T>(url: string, data: T, config: AxiosRequestConfig = {}) {
    const signal = useSignal()
    return await responseHandler(
      this.api({
        signal: signal.signal.value,
        ...config,
        headers: {
          ...(config?.headers || {}),
        },
        data,
        url,
        method: "put",
      })
    );
  }

  async patch<T>(url: string, data: T, config: AxiosRequestConfig = {}) {
    const signal = useSignal()
    return await responseHandler(
      this.api({
        signal: signal.signal.value,
        ...config,
        headers: {
          ...(config?.headers || {}),
        },
        data,
        url,
        method: "patch",
      })
    );
  }

  async delete<T>(url: string, config: AxiosRequestConfig = {}) {
    const signal = useSignal()
    return await responseHandler(
      this.api({
        signal: signal.signal.value,
        ...config,
        headers: {
          ...(config?.headers || {}),
        },
        url,
        method: "delete",
      })
    );
  }

  addAuthenticationHeader() {
    const auth = useAuthStore()
    this.api.defaults.headers.common.Authorization = `Bearer ${auth.auth.token}`;
    return this;
  }
}
