export interface CreateNewsRequest {
  title: string;
  content: string;
  coverImage?: string;
  categoryIds?: number[];
  eventIds?: number[];
  tourIds?: number[];
}

export interface UpdateNewsRequest {
  title: string;
  content: string;
  coverImage?: string;
  isActive: boolean;
  categoryIds?: number[];
  eventIds?: number[];
  tourIds?: number[];
}

export interface NewsRouteParams {
  newsId: number;
}

export interface NewsAuthor {
  userId: number;
  email: string | null;
  usersCustomers: {
    firstName: string | null;
    lastName: string | null;
  } | null;
}

export interface NewsCategoryItem {
  categories: {
    categoryId: number;
    name: string | null;
  };
}

export interface NewsEventItem {
  events: {
    eventId: number;
    name: string | null;
    coverImageUrl: string | null;
  };
}

export interface NewsTourItem {
  tours: {
    tourId: number;
    name: string | null;
  };
}

export interface NewsItem {
  newsId: number;
  title: string | null;
  slug: string | null;
  content: string | null;
  coverImage: string | null;
  authorId: number | null;
  isActive: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  users: NewsAuthor | null;
  newsCategories: NewsCategoryItem[];
  newsEvents: NewsEventItem[];
  newsTours: NewsTourItem[];
}

export interface NewsListResponse {
  news: NewsItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
