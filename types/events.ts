export interface CreateEventRequest {
  producerId: number;
  localizationId: number;
  name: string;
  description?: string;
  coverImageUrl?: string;
  openDate?: string;
  startDate: string;
  endDate: string;
  categoryIds: number[];
}

export interface UpdateEventRequest {
  producerId: number;
  localizationId: number;
  name: string;
  description?: string;
  coverImageUrl?: string;
  openDate?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  categoryIds?: number[];
}

export interface EventRouteParams {
  eventId: number;
}

export interface EventCategory {
  categories: {
    categoryId: number;
    name: string | null;
  };
}

export interface EventListItem {
  eventId: number;
  producerId: number;
  localizationId: number;
  name: string | null;
  description: string | null;
  coverImageUrl: string | null;
  openDate: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  producers: {
    producerId: number;
    name: string | null;
  } | null;
  localizations: {
    localizationId: number;
    name: string | null;
    address: string | null;
  } | null;
  eventsCategories: EventCategory[];
}

export interface EventsListResponse {
  events: EventListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
