"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/common/Sidebar";
import PageHeader from "@/components/common/PageHeader";
import Loading from "@/components/common/Loading";
import { COLORS } from "@/styles/colors";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/auth";
import ProducersServer from "@/server/producers";
import { UpdateProducerRequest } from "@/types/producers";
import {
  primaryButtonStyles,
  secondaryButtonStyles,
  actionButtonClasses,
} from "@/styles/styles";
import ProducerForm from "@/components/producers/ProducerForm";

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

export default function ProducerDetailsContainer() {
  const { producerId } = useParams<{ producerId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["producer-details", producerId],
    enabled: Boolean(producerId),
    queryFn: async () => {
      const response = await ProducersServer.getProducer(producerId);
      if (!response.isSuccess || !response.data) {
        throw new Error(
          response.error?.message ?? "Não foi possível carregar a produtora."
        );
      }
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: UpdateProducerRequest) => {
      if (!producerId) throw new Error("Produtora inválida.");
      const response = await ProducersServer.updateProducer(
        producerId,
        payload
      );
      if (!response.isSuccess || !response.data) {
        throw new Error(
          response.error?.message ?? "Não foi possível atualizar a produtora."
        );
      }
      return response.data;
    },
    onSuccess: async () => {
      setFeedback({
        type: "success",
        message: "Produtora atualizada com sucesso.",
      });
      await refetch();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao atualizar a produtora.";
      setFeedback({
        type: "error",
        message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!producerId) throw new Error("Produtora inválida.");
      const response = await ProducersServer.deleteProducer(producerId);
      if (!response.isSuccess) {
        throw new Error(
          response.error?.message ?? "Não foi possível excluir a produtora."
        );
      }
      return response.data;
    },
    onSuccess: () => {
      setFeedback({
        type: "success",
        message: "Produtora excluída com sucesso.",
      });
      setTimeout(() => {
        router.push("/produtoras");
      }, 1500);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao excluir a produtora.";
      setFeedback({
        type: "error",
        message,
      });
    },
  });

  const isSaving = mutation.isPending;
  const isDeleting = deleteMutation.isPending;
  const producerName = useMemo(() => data?.name ?? "Produtora", [data?.name]);

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
                Painel Administrativo / Produtoras / Detalhes
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{producerName}</h1>
                <p className="text-sm" style={{ color: COLORS.textMuted }}>
                  Atualize as informações da produtora selecionada.
                </p>
              </div>
            </div>
          }
          actions={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/produtoras"
                className={actionButtonClasses}
                style={secondaryButtonStyles}
              >
                Voltar
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
                Não foi possível carregar os dados da produtora.
              </p>
              <p className="text-sm">
                Tente novamente em instantes ou retorne para a lista.
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
                  href="/produtoras"
                  className={actionButtonClasses}
                  style={secondaryButtonStyles}
                >
                  Voltar
                </Link>
              </div>
            </div>
          ) : (
            <ProducerForm
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
