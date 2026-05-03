import { NextResponse } from "next/server";
import { RequestError, RequestResponse } from "@/types/interfaces";

type ErrorOptions = {
  code?: number;
  details?: Record<string, unknown>;
};

export function successResponse<T>(data: T, status = 200) {
  const payload: RequestResponse<T> = {
    isSuccess: true,
    data,
  };

  return NextResponse.json(payload, { status });
}

export function errorResponse(
  message: string,
  status: number,
  options: ErrorOptions = {}
) {
  const { code, details } = options;

  const error: RequestError = {
    message,
    error: {
      status,
      ...(code !== undefined ? { code } : {}),
    },
    ...(details ? { details } : {}),
  };

  const payload: RequestResponse<never> = {
    isSuccess: false,
    error,
  };

  return NextResponse.json(payload, { status });
}
