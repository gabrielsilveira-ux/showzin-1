import { apiRequest } from "@/server/httpClient";
import { RequestResponse } from "@/types/interfaces";
import {
  CreateProducerRequest,
  Producer,
  ProducersListResponse,
  UpdateProducerRequest,
} from "@/types/producers";

type GetProducersParams = {
  name?: string;
};

export default class ProducersServer {
  static async getProducers(
    params?: GetProducersParams
  ): Promise<RequestResponse<ProducersListResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.name) {
      searchParams.set("name", params.name);
    }

    const query = searchParams.toString();
    const url = query ? `/api/producers?${query}` : "/api/producers";

    return apiRequest<ProducersListResponse>(url);
  }

  static async getProducer(
    producerId: string
  ): Promise<RequestResponse<Producer>> {
    return apiRequest<Producer>(`/api/producers/${producerId}`);
  }

  static async createProducer(
    data: CreateProducerRequest
  ): Promise<RequestResponse<Producer>> {
    return apiRequest<Producer>("/api/producers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateProducer(
    producerId: string,
    data: UpdateProducerRequest
  ): Promise<RequestResponse<Producer>> {
    return apiRequest<Producer>(`/api/producers/${producerId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async deleteProducer(
    producerId: string
  ): Promise<RequestResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(`/api/producers/${producerId}`, {
      method: "DELETE",
    });
  }
}
