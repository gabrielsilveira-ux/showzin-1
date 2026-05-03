import { authenticate, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateNewsRequest } from "@/types/news";
import { toSlug } from "@/utils/formats";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/server/apiResponse";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ newsId: string }> }
) {
  try {
    const { newsId } = await params;
    const numericNewsId = Number(newsId);

    if (!Number.isInteger(numericNewsId)) {
      return errorResponse("Identificador inválido", 400);
    }

    const newsItem = await prisma.news.findUnique({
      where: { newsId: numericNewsId },
      include: {
        users: {
          select: {
            userId: true,
            email: true,
            usersCustomers: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        newsCategories: {
          include: {
            categories: true,
          },
        },
        newsTours: {
          include: {
            tours: {
              select: {
                tourId: true,
                name: true,
              },
            },
          },
        },
        newsEvents: {
          include: {
            events: {
              select: {
                eventId: true,
                name: true,
                coverImageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!newsItem) {
      return errorResponse("Notícia não encontrada", 404);
    }

    return successResponse(newsItem);
  } catch (error) {
    console.error("Get news details error:", error);
    return errorResponse("Erro ao buscar notícia", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ newsId: string }> }
) {
  try {
    const user = await authenticate(request);
    if (!user || !isAdmin(user)) {
      return errorResponse("Não autorizado", 401);
    }

    const { newsId } = await params;
    const numericNewsId = Number(newsId);

    if (!Number.isInteger(numericNewsId)) {
      return errorResponse("Identificador inválido", 400);
    }

    const existingNews = await prisma.news.findUnique({
      where: { newsId: numericNewsId },
    });

    if (!existingNews) {
      return errorResponse("Notícia não encontrada", 404);
    }

    const body: UpdateNewsRequest = await request.json();
    const {
      title,
      content,
      coverImage,
      isActive,
      categoryIds = [],
      eventIds = [],
      tourIds = [],
    } = body;

    if (!title) {
      return errorResponse("Título é obrigatório", 400);
    }
    if (!content) {
      return errorResponse("Conteúdo é obrigatório", 400);
    }

    const now = new Date();
    const slug = toSlug(title);

    await prisma.newsCategories.deleteMany({
      where: { newsId: numericNewsId },
    });

    await prisma.newsEvents.deleteMany({
      where: { newsId: numericNewsId },
    });

    await prisma.newsTours.deleteMany({
      where: { newsId: numericNewsId },
    });

    const newsItem = await prisma.news.update({
      where: { newsId: numericNewsId },
      data: {
        title,
        slug,
        content,
        coverImage,
        isActive,
        updatedAt: now,
        newsCategories: {
          create: categoryIds.map((categoryId: number) => ({
            categoryId,
            createdAt: now,
            updatedAt: now,
          })),
        },
        newsEvents: {
          create: eventIds.map((eventId: number) => ({
            eventId,
            createdAt: now,
            updatedAt: now,
          })),
        },
        newsTours: {
          create: tourIds.map((tourId: number) => ({
            tourId,
            createdAt: now,
            updatedAt: now,
          })),
        },
      },
    });

    return successResponse(newsItem);
  } catch (error) {
    console.error("Update news error:", error);
    return errorResponse("Erro ao atualizar notícia", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ newsId: string }> }
) {
  try {
    const user = await authenticate(request);
    if (!user || !isAdmin(user)) {
      return errorResponse("Não autorizado", 401);
    }

    const { newsId } = await params;
    const numericNewsId = Number(newsId);

    if (!Number.isInteger(numericNewsId)) {
      return errorResponse("Identificador inválido", 400);
    }

    const existingNews = await prisma.news.findUnique({
      where: { newsId: numericNewsId },
    });

    if (!existingNews) {
      return errorResponse("Notícia não encontrada", 404);
    }

    await prisma.news.delete({
      where: { newsId: numericNewsId },
    });

    return successResponse({ message: "Notícia excluída com sucesso" });
  } catch (error) {
    console.error("Delete news error:", error);
    return errorResponse("Erro ao excluir notícia", 500);
  }
}
