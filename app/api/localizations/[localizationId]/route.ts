import { authenticate, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateLocalizationRequest } from "@/types/localizations";
import { toSlug } from "@/utils/formats";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/server/apiResponse";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ localizationId: string }> }
) {
  try {
    const { localizationId } = await params;
    const numericLocalizationId = Number(localizationId);

    if (!Number.isInteger(numericLocalizationId)) {
      return errorResponse("Identificador inválido", 400);
    }

    const localization = await prisma.localizations.findUnique({
      where: { localizationId: numericLocalizationId },
      select: {
        localizationId: true,
        name: true,
        zipCode: true,
        address: true,
        cityId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        localizationsCities: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!localization) {
      return errorResponse("Local não encontrado", 404);
    }

    return successResponse(localization);
  } catch (error) {
    console.error("Get localization details error:", error);
    return errorResponse("Erro ao buscar local", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ localizationId: string }> }
) {
  try {
    const user = await authenticate(request);
    if (!user || !isAdmin(user)) {
      return errorResponse("Não autorizado", 401);
    }

    const { localizationId } = await params;
    const numericLocalizationId = Number(localizationId);

    if (!Number.isInteger(numericLocalizationId)) {
      return errorResponse("Identificador inválido", 400);
    }

    const existingLocalization = await prisma.localizations.findUnique({
      where: { localizationId: numericLocalizationId },
    });

    if (!existingLocalization) {
      return errorResponse("Local não encontrado", 404);
    }

    const body: UpdateLocalizationRequest = await request.json();
    const { name, zipCode, address, cityId, isActive } = body;

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

    const tag = toSlug(name);

    const localization = await prisma.localizations.update({
      where: { localizationId: numericLocalizationId },
      data: {
        name,
        tag,
        zipCode,
        address,
        cityId,
        isActive,
        updatedAt: new Date(),
      },
    });

    return successResponse(localization);
  } catch (error) {
    console.error("Update localization error:", error);
    return errorResponse("Erro ao atualizar local", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ localizationId: string }> }
) {
  try {
    const user = await authenticate(request);
    if (!user || !isAdmin(user)) {
      return errorResponse("Não autorizado", 401);
    }

    const { localizationId } = await params;
    const numericLocalizationId = Number(localizationId);

    if (!Number.isInteger(numericLocalizationId)) {
      return errorResponse("Identificador inválido", 400);
    }

    const existingLocalization = await prisma.localizations.findUnique({
      where: { localizationId: numericLocalizationId },
    });

    if (!existingLocalization) {
      return errorResponse("Local não encontrado", 404);
    }

    await prisma.localizations.delete({
      where: { localizationId: numericLocalizationId },
    });

    return successResponse({ message: "Local excluído com sucesso" });
  } catch (error) {
    console.error("Delete localization error:", error);
    return errorResponse("Erro ao excluir local", 500);
  }
}
