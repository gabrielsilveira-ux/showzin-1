export interface PaginationParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  categoryId?: string;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type RequestResponse<T> = {
  isSuccess: boolean;
  data?: T;
  error?: RequestError;
};

export type RequestError = {
  message: string;
  error: {
    status: number;
    code?: number;
  };
  details?: Record<string, unknown>;
};

export interface ApiError {
  error: string;
  details?: Record<string, unknown>;
}

// Tipos para parâmetros de rota do Next.js 14+
export interface RouteParams<T = Record<string, string>> {
  params: Promise<T>;
}
