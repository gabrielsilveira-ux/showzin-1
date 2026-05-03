import { NextRequest } from "next/server";
import { authenticate, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateEventRequest } from "@/types/events";
import { successResponse, errorResponse } from "@/server/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const isActive = searchParams.get("isActive");
    const producerIdParam = searchParams.get("producerId");
    const categoryIdParam = searchParams.get("categoryId");

    const skip = (page - 1) * limit;

    // Construir where clause com tipos corretos
    const where: {
      isActive?: boolean;
      producerId?: number;
      eventsCategories?: { some: { categoryId: number } };
    } = {};

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    if (producerIdParam) {
      const producerId = Number(producerIdParam);
      if (isNaN(Number(producerId))) {
        return errorResponse("ID do produtor inválido", 400);
      }
      where.producerId = producerId;
    }

    if (categoryIdParam) {
      const categoryId = parseInt(categoryIdParam, 10);
      if (isNaN(categoryId)) {
        return errorResponse("ID da categoria inválido", 400);
      }
      where.eventsCategories = {
        some: { categoryId },
      };
    }

    const [events, total] = await Promise.all([
      prisma.events.findMany({
        where,
        skip,
        take: limit,
        include: {
          producers: {
            select: {
              producerId: true,
              name: true,
            },
          },
          localizations: {
            select: {
              localizationId: true,
              name: true,
              address: true,
            },
          },
          eventsCategories: {
            include: {
              categories: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.events.count({ where }),
    ]);

    const eventsFormatted = events.map((event) => ({
      ...event,
      producerId: event.producerId,
      producers: event.producers
        ? {
            ...event.producers,
            producerId: event.producers.producerId.toString(),
          }
        : null,
    }));

    return successResponse({
      events: eventsFormatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get events error:", error);
    return errorResponse("Erro ao buscar eventos", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    if (!user || !isAdmin(user)) {
      return errorResponse("Não autorizado", 401);
    }

    const body: CreateEventRequest = await request.json();
    const {
      producerId,
      localizationId,
      name,
      description,
      coverImageUrl,
      openDate,
      startDate,
      endDate,
      categoryIds,
    } = body;

    // Validações
    if (!name) {
      return errorResponse("Nome é obrigatório", 400);
    }
    if (!producerId) {
      return errorResponse("Produtor é obrigatório", 400);
    }
    if (!localizationId) {
      return errorResponse("Localização é obrigatória", 400);
    }
    if (!startDate) {
      return errorResponse("Data de início é obrigatória", 400);
    }
    if (!endDate) {
      return errorResponse("Data de término é obrigatória", 400);
    }
    if (!categoryIds || categoryIds.length === 0) {
      return errorResponse("Pelo menos uma categoria é obrigatória", 400);
    }

    // Converter e validar IDs
    const localizationIdInt = parseInt(localizationId.toString(), 10);
    const categoryIdsInt = categoryIds.map((id: string | number) =>
      parseInt(id.toString(), 10)
    );

    // Validar conversões
    if (isNaN(Number(producerId))) {
      return errorResponse("ID do produtor inválido", 400);
    }
    if (isNaN(localizationIdInt)) {
      return errorResponse("ID da localização inválido", 400);
    }
    if (categoryIdsInt.some((id) => isNaN(id))) {
      return errorResponse("IDs de categorias inválidos", 400);
    }

    // Verificar se produtor existe
    const producerExists = await prisma.producers.findUnique({
      where: { producerId: producerId },
    });
    if (!producerExists) {
      return errorResponse("Produtor não encontrado", 404);
    }

    // Verificar se localização existe
    const localizationExists = await prisma.localizations.findUnique({
      where: { localizationId: localizationIdInt },
    });
    if (!localizationExists) {
      return errorResponse("Localização não encontrada", 404);
    }

    // Verificar se categorias existem
    const categoriesExist = await prisma.categories.findMany({
      where: { categoryId: { in: categoryIdsInt } },
    });
    if (categoriesExist.length !== categoryIdsInt.length) {
      return errorResponse("Uma ou mais categorias não encontradas", 404);
    }

    const now = new Date();

    // Criar evento
    const event = await prisma.events.create({
      data: {
        producerId: producerId,
        localizationId: localizationIdInt,
        name,
        description,
        coverImageUrl,
        openDate: openDate ? new Date(openDate) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
        eventsCategories: {
          create: categoryIdsInt.map((categoryId: number) => ({
            categoryId,
            createdAt: now,
            updatedAt: now,
          })),
        },
      },
      include: {
        producers: true,
        localizations: true,
        eventsCategories: {
          include: {
            categories: true,
          },
        },
      },
    });

    // Converter BigInt para string na resposta
    const eventFormatted = {
      ...event,
      producerId: event.producerId.toString(),
      producers: event.producers
        ? {
            ...event.producers,
            producerId: event.producers.producerId.toString(),
          }
        : null,
    };

    return successResponse(eventFormatted, 201);
  } catch (error) {
    console.error("Create event error:", error);
    return errorResponse("Erro ao criar evento", 500);
  }
}
