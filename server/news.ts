import { apiRequest } from "@/server/httpClient";
import { PaginationParams, RequestResponse } from "@/types/interfaces";
import {
  CreateNewsRequest,
  NewsItem,
  NewsListResponse,
  UpdateNewsRequest,
} from "@/types/news";

export default class NewsServer {
  static async getNews(
    params?: PaginationParams
  ): Promise<RequestResponse<NewsListResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.isActive !== undefined) {
      searchParams.set("isActive", params.isActive.toString());
    }
    if (params?.categoryId) {
      searchParams.set("categoryId", params.categoryId);
    }

    const query = searchParams.toString();
    const url = query ? `/api/news?${query}` : "/api/news";

    return apiRequest<NewsListResponse>(url);
  }

  static async getNewsItem(newsId: string): Promise<RequestResponse<NewsItem>> {
    return apiRequest<NewsItem>(`/api/news/${newsId}`);
  }

  static async createNews(
    data: CreateNewsRequest
  ): Promise<RequestResponse<NewsItem>> {
    return apiRequest<NewsItem>("/api/news", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateNews(
    newsId: string,
    data: UpdateNewsRequest
  ): Promise<RequestResponse<NewsItem>> {
    return apiRequest<NewsItem>(`/api/news/${newsId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async deleteNews(
    newsId: string
  ): Promise<RequestResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(`/api/news/${newsId}`, {
      method: "DELETE",
    });
  }
}
