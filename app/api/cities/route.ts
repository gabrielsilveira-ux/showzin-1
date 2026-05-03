import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/server/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

    if (!name || name.trim().length < 2) {
      return successResponse({ cities: [] });
    }

    const cities = await prisma.localizationsCities.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      select: {
        cityId: true,
        name: true,
        localizationsStates: {
          select: {
            name: true,
            abbreviation: true,
          },
        },
      },
      orderBy: { name: "asc" },
      take: limit,
    });

    return successResponse({ cities });
  } catch (error) {
    console.error("Get cities error:", error);
    return errorResponse("Erro ao buscar cidades", 500);
  }
}
