import { authenticate, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateProducerRequest } from "@/types/producers";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/server/apiResponse";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ producerId: string }> }
) {
  try {
    const { producerId } = await params;

    const producer = await prisma.producers.findUnique({
      where: { producerId: Number(producerId) },
      select: {
        producerId: true,
        name: true,
        documentNumber: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!producer) {
      return errorResponse("Produtora não encontrada", 404);
    }

    return successResponse(producer);
  } catch (error) {
    console.error("Get producer error:", error);
    return errorResponse("Erro ao buscar dados da produtora", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ producerId: string }> }
) {
  try {
    const user = await authenticate(request);
    if (!user || !isAdmin(user)) {
      return errorResponse("Não autorizado", 401);
    }

    const { producerId } = await params;

    const existingProducer = await prisma.producers.findUnique({
      where: { producerId: Number(producerId) },
    });

    if (!existingProducer) {
      return errorResponse("Produtora não encontrada", 404);
    }

    const body: UpdateProducerRequest = await request.json();
    const { name, documentNumber, isActive } = body;

    if (!name) {
      return errorResponse("Nome é obrigatório", 400);
    }
    if (!documentNumber) {
      return errorResponse("CNPJ é obrigatório", 400);
    }

    const producer = await prisma.producers.update({
      where: { producerId: Number(producerId) },
      data: {
        name,
        documentNumber,
        isActive,
        updatedAt: new Date(),
      },
    });

    return successResponse(producer);
  } catch (error) {
    console.error("Update producer error:", error);
    return errorResponse("Erro ao atualizar produtora", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ producerId: string }> }
) {
  try {
    const user = await authenticate(request);
    if (!user || !isAdmin(user)) {
      return errorResponse("Não autorizado", 401);
    }

    const { producerId } = await params;
    const numericProducerId = Number(producerId);

    if (!Number.isInteger(numericProducerId)) {
      return errorResponse("Identificador inválido", 400);
    }

    const existingProducer = await prisma.producers.findUnique({
      where: { producerId: numericProducerId },
    });

    if (!existingProducer) {
      return errorResponse("Produtora não encontrada", 404);
    }

    await prisma.producers.delete({
      where: { producerId: numericProducerId },
    });

    return successResponse({ message: "Produtora excluída com sucesso" });
  } catch (error) {
    console.error("Delete producer error:", error);
    return errorResponse("Erro ao excluir produtora", 500);
  }
}
