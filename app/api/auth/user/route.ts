import { NextRequest } from "next/server";
import { authenticate } from "@/lib/auth";
import { errorResponse, successResponse } from "@/server/apiResponse";
import { AuthUserData } from "@/types/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);

    if (!user) {
      return errorResponse("Token inválido ou ausente", 401);
    }

    const data: AuthUserData = {
      userId: user.userId,
      email: user.email,
    };

    return successResponse<AuthUserData>(data);
  } catch (error) {
    console.error("User info error:", error);
    return errorResponse("Erro ao recuperar dados do usuário", 500);
  }
}
