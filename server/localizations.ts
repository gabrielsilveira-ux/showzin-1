import { apiRequest } from "@/server/httpClient";
import { RequestResponse } from "@/types/interfaces";
import {
  CreateLocalizationRequest,
  LocalizationDetails,
  LocalizationsListResponse,
  UpdateLocalizationRequest,
} from "@/types/localizations";

type GetLocalizationsParams = {
  name?: string;
};

export default class LocalizationsServer {
  static async getLocalizations(
    params?: GetLocalizationsParams
  ): Promise<RequestResponse<LocalizationsListResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.name) {
      searchParams.set("name", params.name);
    }

    const query = searchParams.toString();
    const url = query ? `/api/localizations?${query}` : "/api/localizations";

    return apiRequest<LocalizationsListResponse>(url);
  }

  static async getLocalization(
    localizationId: string
  ): Promise<RequestResponse<LocalizationDetails>> {
    return apiRequest<LocalizationDetails>(
      `/api/localizations/${localizationId}`
    );
  }

  static async createLocalization(
    data: CreateLocalizationRequest
  ): Promise<RequestResponse<LocalizationDetails>> {
    return apiRequest<LocalizationDetails>("/api/localizations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateLocalization(
    localizationId: string,
    data: UpdateLocalizationRequest
  ): Promise<RequestResponse<LocalizationDetails>> {
    return apiRequest<LocalizationDetails>(
      `/api/localizations/${localizationId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  }

  static async deleteLocalization(
    localizationId: string
  ): Promise<RequestResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(
      `/api/localizations/${localizationId}`,
      {
        method: "DELETE",
      }
    );
  }
}
