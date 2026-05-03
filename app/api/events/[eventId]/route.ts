import { authenticate, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateEventRequest } from "@/types/events";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/server/apiResponse";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await authenticate(request);
    if (!user || !isAdmin(user)) {
      return errorResponse("Não autorizado", 401);
    }

    const { eventId } = await params;

    const existingEvent = await prisma.events.findUnique({
      where: { eventId: Number(eventId) },
    });

    if (!existingEvent) {
      return errorResponse("Evento não encontrado", 404);
    }

    const body: UpdateEventRequest = await request.json();
    const {
      producerId,
      localizationId,
      name,
      description,
      coverImageUrl,
      openDate,
      startDate,
      endDate,
      isActive,
      categoryIds = [],
    } = body;

    if (!name) {
      return errorResponse("Nome é obrigatório", 400);
    }
    if (!producerId) {
      return errorResponse("Produtor é obrigatório", 400);
    }
    if (!localizationId) {
      return errorResponse("Localização é obrigatória", 400);
    }

    const now = new Date();

    await prisma.eventsCategories.deleteMany({
      where: { eventId: Number(eventId) },
    });

    const event = await prisma.events.update({
      where: { eventId: Number(eventId) },
      data: {
        producerId,
        localizationId,
        name,
        description,
        coverImageUrl,
        openDate: openDate ? new Date(openDate) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isActive,
        updatedAt: now,
        eventsCategories: {
          create: categoryIds.map((categoryId: number) => ({
            categoryId,
            createdAt: now,
            updatedAt: now,
          })),
        },
      },
    });

    return successResponse(event);
  } catch (error) {
    console.error("Update event error:", error);
    return errorResponse("Erro ao atualizar evento", 500);
  }
}
