import { NextRequest } from "next/server";
import { generateToken, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthResponse, RegisterRequest } from "@/types/auth";
import { successResponse, errorResponse } from "@/server/apiResponse";

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { email, password, firstName, lastName } = body;

    // Validation
    if (!email) {
      return errorResponse("Email é obrigatório", 400);
    }

    if (!password) {
      return errorResponse("Senha é obrigatória", 400);
    }

    if (!firstName || !lastName) {
      return errorResponse("Nome completo é obrigatório", 400);
    }

    if (password.length < 8) {
      return errorResponse("A senha deve ter no mínimo 8 caracteres", 400);
    }

    // Validate if email already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse("Email já cadastrado", 409);
    }

    // Password hash
    const passwordHash = await hashPassword(password);

    const now = new Date();

    const newUser = await prisma.users.create({
      data: {
        email,
        type: "admin",
        isActive: true,
        createdAt: now,
        updatedAt: now,
        usersCredentials: {
          create: {
            passwordHash,
            isActive: true,
            createdAt: now,
            updatedAt: now,
          },
        },
        usersAdmins: {
          create: {
            createdAt: now,
            updatedAt: now,
          },
        },
      },
    });

    const accessToken = await generateToken({
      userId: newUser.userId,
      email,
      type: "admin",
    });

    const response: AuthResponse = {
      accessToken,
      user: {
        userId: newUser.userId,
        email,
        type: "admin",
      },
    };

    return successResponse<AuthResponse>(response, 201);
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse("Erro ao criar administrador", 500);
  }
}
