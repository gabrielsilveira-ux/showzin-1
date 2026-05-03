import { NextRequest } from "next/server";
import { authenticate, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateCategoryRequest } from "@/types/categories";
import { successResponse, errorResponse } from "@/server/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    const categories = await prisma.categories.findMany({
      where: {
        isActive: true,
        ...(name && {
          name: {
            contains: name,
            mode: "insensitive",
          },
        }),
      },
      select: {
        categoryId: true,
        name: true,
        isActive: true,
      },
      orderBy: { name: "asc" },
    });

    return successResponse({ categories });
  } catch (error) {
    console.error("Get categories error:", error);
    return errorResponse("Erro ao buscar categorias", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    if (!user || !isAdmin(user)) {
      return errorResponse("Não autorizado", 401);
    }

    const body: CreateCategoryRequest = await request.json();
    const { name } = body;

    if (!name) {
      return errorResponse("Nome é obrigatório", 400);
    }

    const now = new Date();

    const category = await prisma.categories.create({
      data: {
        name,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    });

    return successResponse(category, 201);
  } catch (error) {
    console.error("Create category error:", error);
    return errorResponse("Erro ao criar categoria", 500);
  }
}
