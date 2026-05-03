import { authenticate, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateProducerRequest } from "@/types/producers";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/server/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    const producers = await prisma.producers.findMany({
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
        producerId: true,
        name: true,
        documentNumber: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse({ producers });
  } catch (error) {
    console.error("Get producers error:", error);
    return errorResponse("Erro ao buscar produtoras", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    if (!user || !isAdmin(user)) {
      return errorResponse("Não autorizado", 401);
    }

    const body: CreateProducerRequest = await request.json();
    const { name, documentNumber } = body;

    if (!name) {
      return errorResponse("Nome é obrigatório", 400);
    }
    if (!documentNumber) {
      return errorResponse("CNPJ é obrigatório", 400);
    }

    const now = new Date();

    const producer = await prisma.producers.create({
      data: {
        name,
        documentNumber,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    });

    return successResponse(producer, 201);
  } catch (error) {
    console.error("Create producer error", error);
    return errorResponse("Erro ao criar produtora", 500);
  }
}
