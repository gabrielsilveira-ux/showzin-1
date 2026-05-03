import { store } from "@/store";
import { ApiError, RequestResponse } from "@/types/interfaces";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

type RequestHeaders = HeadersInit | undefined;

function buildHeaders(optionsHeaders: RequestHeaders): Headers {
  const headers = new Headers(optionsHeaders);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const state = store.getState();
  const token = state.auth.data?.accessToken;
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

async function parseResponseBody<T>(
  response: Response
): Promise<T | undefined> {
  if (response.status === 204) {
    return undefined;
  }

  try {
    return (await response.json()) as T;
  } catch {
    return undefined;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<RequestResponse<T>> {
  try {
    const headers = buildHeaders(options.headers);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorBody = (await parseResponseBody<ApiError>(response)) || {
        error: "Erro de comunicação com o servidor",
      };

      return {
        isSuccess: false,
        error: {
          message: errorBody.error,
          details: errorBody.details,
          error: {
            status: response.status,
          },
        },
      };
    }

    const data = await parseResponseBody<unknown>(response);

    if (data && typeof data === "object" && "isSuccess" in data) {
      return data as RequestResponse<T>;
    }

    return {
      isSuccess: true,
      data: data as T,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao processar a requisição";

    return {
      isSuccess: false,
      error: {
        message,
        error: {
          status: 500,
        },
      },
    };
  }
}
