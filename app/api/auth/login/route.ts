import { NextRequest } from "next/server";
import { generateToken, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthResponse, LoginRequest } from "@/types/auth";
import { successResponse, errorResponse } from "@/server/apiResponse";

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validation
    if (!email) {
      return errorResponse("Email é obrigatório", 400);
    }

    if (!password) {
      return errorResponse("Senha é obrigatória", 400);
    }

    const user = await prisma.users.findUnique({
      where: { email },
      include: {
        usersCredentials: {
          where: {
            isActive: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return errorResponse("Nenhum usuário encontrado", 401);
    }

    const credential = user.usersCredentials[0];

    if (!credential?.passwordHash) {
      return errorResponse("Credenciais faltando", 401);
    }

    const isValidPassword = await verifyPassword(
      password,
      credential.passwordHash
    );

    if (!isValidPassword) {
      return errorResponse("Credenciais inválidas", 401);
    }

    const accessToken = await generateToken({
      userId: user.userId,
      email: user.email,
      type: "admin",
    });

    const response: AuthResponse = {
      accessToken,
      user: {
        userId: user.userId,
        email: user.email,
        type: user.type,
      },
    };
    return successResponse<AuthResponse>(response);
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Erro ao realizar login", 500);
  }
}
