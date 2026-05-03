import { authenticate, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  CreateLocalizationRequest,
  LocalizationListItem,
  LocalizationRaw,
} from "@/types/localizations";
import { toSlug } from "@/utils/formats";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/server/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    const localizationsRaw = await prisma.localizations.findMany({
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
        localizationId: true,
        name: true,
        zipCode: true,
        address: true,
        localizationsCities: {
          select: { name: true },
        },
      },
    });

    const localizations: LocalizationListItem[] = localizationsRaw.map(
      (loc: LocalizationRaw) => ({
        localizationId: loc.localizationId,
        name: loc.name,
        zipCode: loc.zipCode,
        address: loc.address,
        city: loc.localizationsCities?.name ?? null,
      })
    );

    return successResponse({ localizations });
  } catch (error) {
    console.error("Get localizations error:", error);
    return errorResponse("Erro ao buscar locais", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    if (!user || !isAdmin(user)) {
      return errorResponse("Não autorizado", 401);
    }

    const body: CreateLocalizationRequest = await request.json();
    const { name, zipCode, address, cityId } = body;

    if (!name) {
      return errorResponse("Nome é obrigatório", 400);
    }
    if (!zipCode) {
      return errorResponse("CEP é obrigatório", 400);
    }
    if (!address) {
      return errorResponse("Endereço é obrigatório", 400);
    }
    if (!cityId) {
      return errorResponse("Cidade é obrigatória", 400);
    }

    const now = new Date();
    const tag = toSlug(name);

    const localization = await prisma.localizations.create({
      data: {
        name,
        tag,
        zipCode,
        address,
        cityId,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    });

    return successResponse(localization, 201);
  } catch (error) {
    console.error("Create localization error", error);
    return errorResponse("Erro ao criar local", 500);
  }
}
