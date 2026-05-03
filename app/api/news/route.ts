import { NextRequest } from "next/server";
import { authenticate, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateNewsRequest } from "@/types/news";
import { toSlug } from "@/utils/formats";
import { successResponse, errorResponse } from "@/server/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const isActive = searchParams.get("isActive");
    const categoryIdParam = searchParams.get("categoryId");

    const skip = (page - 1) * limit;

    const where: {
      isActive?: boolean;
      newsCategories?: { some: { categoryId: number } };
    } = {};
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }
    if (categoryIdParam) {
      const categoryId = parseInt(categoryIdParam, 10);
      where.newsCategories = {
        some: { categoryId },
      };
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        skip,
        take: limit,
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
        orderBy: { createdAt: "desc" },
      }),
      prisma.news.count({ where }),
    ]);

    return successResponse({
      news,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get news error:", error);
    return errorResponse("Erro ao buscar notícias", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    if (!user || !isAdmin(user)) {
      return errorResponse("Não autorizado", 401);
    }

    const userExists = await prisma.users.findUnique({
      where: { userId: user.userId },
    });

    if (!userExists) {
      return errorResponse("Usuário não encontrado", 404);
    }

    const body: CreateNewsRequest = await request.json();
    const {
      title,
      content,
      coverImage,
      categoryIds = [],
      eventIds = [],
      tourIds = [],
    } = body;

    if (!title || !content) {
      return errorResponse("Título e conteúdo são obrigatórios", 400);
    }

    const now = new Date();

    const newsItem = await prisma.news.create({
      data: {
        title,
        slug: toSlug(title),
        content,
        coverImage,
        authorId: user.userId,
        isActive: true,
        createdAt: now,
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

    return successResponse(newsItem, 201);
  } catch (error) {
    console.error("Create news error:", error);
    return errorResponse("Erro ao criar notícia", 500);
  }
}
