import { apiRequest } from "@/server/httpClient";
import { PaginationParams, RequestResponse } from "@/types/interfaces";
import {
  CreateEventRequest,
  EventsListResponse,
  UpdateEventRequest,
} from "@/types/events";

type GetEventsParams = PaginationParams & {
  producerId?: string;
};

export default class EventsServer {
  static async getEvents(
    params?: GetEventsParams
  ): Promise<RequestResponse<EventsListResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.isActive !== undefined) {
      searchParams.set("isActive", params.isActive.toString());
    }
    if (params?.categoryId) {
      searchParams.set("categoryId", params.categoryId);
    }
    if (params?.producerId) {
      searchParams.set("producerId", params.producerId);
    }

    const query = searchParams.toString();
    const url = query ? `/api/events?${query}` : "/api/events";

    return apiRequest<EventsListResponse>(url);
  }

  static async getEvent(eventId: string): Promise<RequestResponse<unknown>> {
    return apiRequest<unknown>(`/api/events/${eventId}`);
  }

  static async createEvent(
    data: CreateEventRequest
  ): Promise<RequestResponse<unknown>> {
    return apiRequest<unknown>("/api/events", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateEvent(
    eventId: string,
    data: UpdateEventRequest
  ): Promise<RequestResponse<unknown>> {
    return apiRequest<unknown>(`/api/events/${eventId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async deleteEvent(eventId: string): Promise<RequestResponse<unknown>> {
    return apiRequest<unknown>(`/api/events/${eventId}`, {
      method: "DELETE",
    });
  }
}
