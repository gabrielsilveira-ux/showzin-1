"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/common/Sidebar";
import Loading from "@/components/common/Loading";
import PageHeader from "@/components/common/PageHeader";
import { COLORS } from "@/styles/colors";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/auth";
import LocalizationsServer from "@/server/localizations";
import { UpdateLocalizationRequest } from "@/types/localizations";
import {
  actionButtonClasses,
  primaryButtonStyles,
  secondaryButtonStyles,
} from "@/styles/styles";
import LocationForm from "@/components/locations/LocationForm";

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

export default function LocationDetailsContainer() {
  const { locationId } = useParams<{ locationId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["location-details", locationId],
    enabled: Boolean(locationId),
    queryFn: async () => {
      const response = await LocalizationsServer.getLocalization(locationId);
      if (!response.isSuccess || !response.data) {
        throw new Error(
          response.error?.message ?? "Não foi possível carregar o local."
        );
      }
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: UpdateLocalizationRequest) => {
      if (!locationId) throw new Error("Local inválido.");
      const response = await LocalizationsServer.updateLocalization(
        locationId,
        payload
      );
      if (!response.isSuccess || !response.data) {
        throw new Error(
          response.error?.message ?? "Não foi possível atualizar o local."
        );
      }
      return response.data;
    },
    onSuccess: async () => {
      setFeedback({
        type: "success",
        message: "Local atualizado com sucesso.",
      });
      await refetch();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao atualizar o local.";
      setFeedback({
        type: "error",
        message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!locationId) throw new Error("Local inválido.");
      const response = await LocalizationsServer.deleteLocalization(locationId);
      if (!response.isSuccess) {
        throw new Error(
          response.error?.message ?? "Não foi possível excluir o local."
        );
      }
      return response.data;
    },
    onSuccess: () => {
      setFeedback({
        type: "success",
        message: "Local excluído com sucesso.",
      });
      setTimeout(() => {
        router.push("/localizacoes");
      }, 1500);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao excluir o local.";
      setFeedback({
        type: "error",
        message,
      });
    },
  });

  const isSaving = mutation.isPending;
  const isDeleting = deleteMutation.isPending;
  const locationName = useMemo(() => data?.name ?? "Local", [data?.name]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: COLORS.backgroundBase, color: "white" }}
    >
      <Sidebar />

      <main className="flex flex-1 flex-col">
        <PageHeader
          headerContent={
            <div className="space-y-2">
              <div
                className="text-xs uppercase tracking-[0.26em]"
                style={{ color: COLORS.textMuted }}
              >
                Painel Administrativo / Localizações / Detalhes
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{locationName}</h1>
                <p className="text-sm" style={{ color: COLORS.textMuted }}>
                  Atualize as informações do local selecionado.
                </p>
              </div>
            </div>
          }
          actions={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/localizacoes"
                className={actionButtonClasses}
                style={secondaryButtonStyles}
              >
                Voltar para lista
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] transition hover:bg-(--btn-hover) focus:outline-none focus:ring-4 focus:ring-(--btn-ring)"
                style={secondaryButtonStyles}
              >
                Sair
              </button>
            </div>
          }
        />

        <section className="flex-1 overflow-y-auto px-6 py-10 md:px-10">
          {isLoading ? (
            <Loading fullscreen={false} />
          ) : isError || !data ? (
            <div
              className="flex flex-col items-center justify-center gap-4 rounded-3xl border px-6 py-12 text-center"
              style={{
                backgroundColor: COLORS.inputBackground,
                borderColor: COLORS.borderSubtle,
                color: COLORS.textSecondary,
              }}
            >
              <p className="text-lg font-semibold text-white">
                Não foi possível carregar os dados do local.
              </p>
              <p className="text-sm">
                Tente novamente em instantes ou retorne para a lista de locais.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] transition hover:bg-(--btn-hover) focus:outline-none focus:ring-4 focus:ring-(--btn-ring)"
                  style={primaryButtonStyles}
                >
                  Tentar novamente
                </button>
                <Link
                  href="/localizacoes"
                  className={actionButtonClasses}
                  style={secondaryButtonStyles}
                >
                  Voltar
                </Link>
              </div>
            </div>
          ) : (
            <LocationForm
              key={data.localizationId}
              initialData={data}
              onSubmit={(data) => mutation.mutate(data)}
              onDelete={() => deleteMutation.mutate()}
              isSaving={isSaving}
              isDeleting={isDeleting}
              feedback={feedback}
              setFeedback={setFeedback}
            />
          )}
        </section>
      </main>
    </div>
  );
}
