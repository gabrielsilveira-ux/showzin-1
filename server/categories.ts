import { apiRequest } from "@/server/httpClient";
import { RequestResponse } from "@/types/interfaces";
import { CreateCategoryRequest } from "@/types/categories";

type CategoriesResponse = {
  categories: unknown[];
};

export default class CategoriesServer {
  static async getCategories(
    isActive?: boolean
  ): Promise<RequestResponse<CategoriesResponse>> {
    const params = new URLSearchParams();
    if (isActive !== undefined) {
      params.set("isActive", isActive.toString());
    }

    const query = params.toString();
    const url = query ? `/api/categories?${query}` : "/api/categories";

    return apiRequest<CategoriesResponse>(url);
  }

  static async createCategory(
    data: CreateCategoryRequest
  ): Promise<RequestResponse<unknown>> {
    return apiRequest<unknown>("/api/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
