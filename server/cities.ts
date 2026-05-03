import { apiRequest } from "@/server/httpClient";
import { RequestResponse } from "@/types/interfaces";

export interface City {
  cityId: number;
  name: string;
  localizationsStates: {
    name: string;
    abbreviation: string;
  } | null;
}

export interface CitiesListResponse {
  cities: City[];
}

type GetCitiesParams = {
  name?: string;
};

export default class CitiesServer {
  static async getCities(
    params?: GetCitiesParams
  ): Promise<RequestResponse<CitiesListResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.name) {
      searchParams.set("name", params.name);
    }

    const query = searchParams.toString();
    const url = query ? `/api/cities?${query}` : "/api/cities";

    return apiRequest<CitiesListResponse>(url);
  }
}
