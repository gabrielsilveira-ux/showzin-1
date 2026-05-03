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
import NewsServer from "@/server/news";
import { UpdateNewsRequest } from "@/types/news";
import {
  actionButtonClasses,
  primaryButtonStyles,
  secondaryButtonStyles,
} from "@/styles/styles";
import NewsForm from "@/components/news/NewsForm";

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

export default function NewsDetailsContainer() {
  const { newsId } = useParams<{ newsId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["news-details", newsId],
    enabled: Boolean(newsId),
    queryFn: async () => {
      const response = await NewsServer.getNewsItem(newsId);
      if (!response.isSuccess || !response.data) {
        throw new Error(
          response.error?.message ?? "Não foi possível carregar a notícia."
        );
      }
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: UpdateNewsRequest) => {
      if (!newsId) throw new Error("Notícia inválida.");
      const response = await NewsServer.updateNews(newsId, payload);
      if (!response.isSuccess || !response.data) {
        throw new Error(
          response.error?.message ?? "Não foi possível atualizar a notícia."
        );
      }
      return response.data;
    },
    onSuccess: async () => {
      setFeedback({
        type: "success",
        message: "Notícia atualizada com sucesso.",
      });
      await refetch();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao atualizar a notícia.";
      setFeedback({
        type: "error",
        message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!newsId) throw new Error("Notícia inválida.");
      const response = await NewsServer.deleteNews(newsId);
      if (!response.isSuccess) {
        throw new Error(
          response.error?.message ?? "Não foi possível excluir a notícia."
        );
      }
      return response.data;
    },
    onSuccess: () => {
      setFeedback({
        type: "success",
        message: "Notícia excluída com sucesso.",
      });
      setTimeout(() => {
        router.push("/noticias");
      }, 1500);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao excluir a notícia.";
      setFeedback({
        type: "error",
        message,
      });
    },
  });

  const isSaving = mutation.isPending;
  const isDeleting = deleteMutation.isPending;
  const newsTitle = useMemo(() => data?.title ?? "Notícia", [data?.title]);
  const authorName = useMemo(() => {
    if (!data?.users) return "Não informado";
    const firstName = data.users.usersCustomers?.firstName ?? "";
    const lastName = data.users.usersCustomers?.lastName ?? "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || data.users.email || "Não informado";
  }, [data]);

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
                Painel Administrativo / Notícias / Detalhes
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{newsTitle}</h1>
                <p className="text-sm" style={{ color: COLORS.textMuted }}>
                  Atualize as informações da notícia selecionada.
                </p>
              </div>
            </div>
          }
          actions={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/news"
                className={actionButtonClasses}
                style={secondaryButtonStyles}
              >
                Voltar para lista
              </Link>
              <div
                className="flex items-center gap-3 rounded-2xl border px-4 py-2 text-sm"
                style={{
                  borderColor: COLORS.borderSubtle,
                  color: COLORS.textSecondary,
                  backgroundColor: COLORS.inputBackground,
                }}
              >
                <span>{authorName}</span>
                <div
                  className="h-8 w-8 rounded-xl"
                  style={{ background: COLORS.brandGradient }}
                />
              </div>
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
                Não foi possível carregar os dados da notícia.
              </p>
              <p className="text-sm">
                Tente novamente em instantes ou retorne para a lista de
                notícias.
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
                  href="/news"
                  className={actionButtonClasses}
                  style={secondaryButtonStyles}
                >
                  Voltar
                </Link>
              </div>
            </div>
          ) : (
            <NewsForm
              key={data.newsId}
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
