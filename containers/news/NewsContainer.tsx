"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/common/Sidebar";
import Loading from "@/components/common/Loading";
import PageHeader from "@/components/common/PageHeader";
import { COLORS } from "@/styles/colors";
import {
  actionButtonClasses,
  primaryButtonStyles,
  secondaryButtonStyles,
} from "@/styles/styles";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/auth";
import NewsServer from "@/server/news";
import { NewsItem } from "@/types/news";
import { formatDate } from "@/utils/formats";

type StatusFilter = "all" | "active" | "inactive";

export default function NewsContainer() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["news-list", statusFilter],
    staleTime: 1000 * 60,
    queryFn: async () => {
      const response = await NewsServer.getNews({
        limit: 24,
        ...(statusFilter !== "all"
          ? { isActive: statusFilter === "active" }
          : {}),
      });

      if (!response.isSuccess || !response.data) {
        throw new Error(
          response.error?.message ?? "Não foi possível carregar as notícias."
        );
      }

      return response.data;
    },
  });

  const newsList = data?.news ?? [];
  const totalNews = data?.pagination.total ?? newsList.length;

  const emptyMessage = useMemo(() => {
    switch (statusFilter) {
      case "active":
        return "Nenhuma notícia ativa encontrada.";
      case "inactive":
        return "Nenhuma notícia inativa encontrada.";
      default:
        return "Nenhuma notícia cadastrada no momento.";
    }
  }, [statusFilter]);

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
                Painel Administrativo / Notícias
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold">
                    Notícias publicadas
                  </h1>
                  <p className="text-sm" style={{ color: COLORS.textMuted }}>
                    Gerencie as notícias divulgadas na plataforma.
                  </p>
                </div>
                <span
                  className="text-xs uppercase tracking-[0.26em]"
                  style={{ color: COLORS.textMuted }}
                >
                  {totalNews} notícias
                </span>
              </div>
            </div>
          }
          actions={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/noticias/novo"
                className={actionButtonClasses}
                style={primaryButtonStyles}
              >
                Nova notícia
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
          <div
            className="flex flex-col gap-3 rounded-3xl border px-6 py-5 text-sm md:flex-row md:items-center md:justify-between"
            style={{
              backgroundColor: COLORS.inputBackground,
              borderColor: COLORS.borderSubtle,
              color: COLORS.textSecondary,
            }}
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
              <span className="text-xs uppercase tracking-[0.24em]">
                Filtrar por status
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className="rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition focus:outline-none focus:ring-4 focus:ring-(--btn-ring)"
                  style={{
                    backgroundColor:
                      statusFilter === "all"
                        ? COLORS.inputBackground
                        : "transparent",
                    border: `1px solid ${
                      statusFilter === "all"
                        ? COLORS.borderSubtle
                        : COLORS.borderFaint
                    }`,
                    color: "white",
                  }}
                >
                  Todas
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("active")}
                  className="rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition focus:outline-none focus:ring-4 focus:ring-(--btn-ring)"
                  style={{
                    backgroundColor:
                      statusFilter === "active"
                        ? COLORS.inputBackground
                        : "transparent",
                    border: `1px solid ${
                      statusFilter === "active"
                        ? COLORS.borderSubtle
                        : COLORS.borderFaint
                    }`,
                    color: "white",
                  }}
                >
                  Ativas
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("inactive")}
                  className="rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition focus:outline-none focus:ring-4 focus:ring-(--btn-ring)"
                  style={{
                    backgroundColor:
                      statusFilter === "inactive"
                        ? COLORS.inputBackground
                        : "transparent",
                    border: `1px solid ${
                      statusFilter === "inactive"
                        ? COLORS.borderSubtle
                        : COLORS.borderFaint
                    }`,
                    color: "white",
                  }}
                >
                  Inativas
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition hover:bg-(--btn-hover) focus:outline-none focus:ring-4 focus:ring-(--btn-ring)"
                style={secondaryButtonStyles}
              >
                Atualizar
              </button>
            </div>
          </div>

          <div className="mt-8">
            {isLoading ? (
              <Loading fullscreen={false} />
            ) : isError ? (
              <div
                className="flex flex-col items-center justify-center gap-4 rounded-3xl border px-6 py-12 text-center"
                style={{
                  backgroundColor: COLORS.inputBackground,
                  borderColor: COLORS.borderSubtle,
                  color: COLORS.textSecondary,
                }}
              >
                <p className="text-lg font-semibold text-white">
                  Não foi possível carregar as notícias.
                </p>
                <p className="text-sm">
                  Tente novamente mais tarde ou atualize a página.
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] transition hover:bg-(--btn-hover) focus:outline-none focus:ring-4 focus:ring-(--btn-ring)"
                  style={primaryButtonStyles}
                >
                  Tentar novamente
                </button>
              </div>
            ) : newsList.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center gap-4 rounded-3xl border px-6 py-16 text-center"
                style={{
                  backgroundColor: COLORS.inputBackground,
                  borderColor: COLORS.borderSubtle,
                  color: COLORS.textSecondary,
                }}
              >
                <p className="text-lg font-semibold text-white">
                  {emptyMessage}
                </p>
                <Link
                  href="/noticias/novo"
                  className={actionButtonClasses}
                  style={primaryButtonStyles}
                >
                  Cadastrar notícia
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {newsList.map((newsItem: NewsItem) => {
                    const statusActive = newsItem.isActive ?? false;
                    const categories =
                      newsItem.newsCategories
                        ?.map((item) => item.categories.name)
                        .filter(Boolean) ?? [];
                    const tours =
                      newsItem.newsTours
                        ?.map((item) => item.tours.name)
                        .filter(Boolean) ?? [];
                    const events =
                      newsItem.newsEvents
                        ?.map((item) => item.events.name)
                        .filter(Boolean) ?? [];
                    const authorName = newsItem.users
                      ? `${newsItem.users.usersCustomers?.firstName ?? ""} ${
                          newsItem.users.usersCustomers?.lastName ?? ""
                        }`.trim() || newsItem.users.email
                      : "Não informado";

                    return (
                      <div
                        key={newsItem.newsId}
                        className="flex h-full flex-col justify-between rounded-3xl border p-6"
                        style={{
                          backgroundColor: COLORS.inputBackground,
                          borderColor: COLORS.borderSubtle,
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p
                            className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.24em]"
                            style={{
                              backgroundColor: statusActive
                                ? "rgba(72,255,168,0.16)"
                                : "rgba(255,214,102,0.16)",
                              color: statusActive
                                ? COLORS.successText
                                : "#ffd666",
                            }}
                          >
                            {statusActive ? "Ativa" : "Inativa"}
                          </p>
                          <span
                            className="text-xs font-semibold uppercase tracking-[0.2em]"
                            style={{ color: COLORS.textMuted }}
                          >
                            #{newsItem.newsId}
                          </span>
                        </div>

                        <div className="mt-6 space-y-3">
                          <h2 className="text-xl font-semibold text-white">
                            {newsItem.title ?? "Notícia sem título"}
                          </h2>
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: COLORS.textSecondary }}
                          >
                            {newsItem.content
                              ? `${newsItem.content.slice(0, 160)}${
                                  newsItem.content.length > 160 ? "..." : ""
                                }`
                              : "Esta notícia ainda não possui conteúdo cadastrado."}
                          </p>
                          <div className="space-y-2 text-sm">
                            <div
                              className="flex items-center gap-2"
                              style={{ color: COLORS.textSecondary }}
                            >
                              <span className="font-semibold text-white">
                                Autor:
                              </span>
                              <span>{authorName}</span>
                            </div>
                            <div
                              className="flex items-center gap-2"
                              style={{ color: COLORS.textSecondary }}
                            >
                              <span className="font-semibold text-white">
                                Publicada em:
                              </span>
                              <span>{formatDate(newsItem.createdAt)}</span>
                            </div>
                          </div>
                          {(categories.length > 0 ||
                            events.length > 0 ||
                            tours.length > 0) && (
                            <div
                              className="space-y-3 pt-2 text-xs uppercase tracking-[0.2em]"
                              style={{ color: COLORS.textMuted }}
                            >
                              {categories.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {categories.map((category) => (
                                    <span
                                      key={`${newsItem.newsId}-category-${category}`}
                                      className="rounded-full px-3 py-1 font-semibold"
                                      style={{
                                        backgroundColor: "rgba(79,70,229,0.15)",
                                        color: "#b4b8ff",
                                      }}
                                    >
                                      {category}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {events.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {events.map((event) => (
                                    <span
                                      key={`${newsItem.newsId}-event-${event}`}
                                      className="rounded-full px-3 py-1 font-semibold"
                                      style={{
                                        backgroundColor: "rgba(234,179,8,0.18)",
                                        color: "#fcd34d",
                                      }}
                                    >
                                      {event}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {tours.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {tours.map((tour) => (
                                    <span
                                      key={`${newsItem.newsId}-tour-${tour}`}
                                      className="rounded-full px-3 py-1 font-semibold"
                                      style={{
                                        backgroundColor:
                                          "rgba(16,185,129,0.18)",
                                        color: "#6ee7b7",
                                      }}
                                    >
                                      {tour}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                          <Link
                            href={`/noticias/${newsItem.newsId}`}
                            className="text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-80"
                          >
                            Ver detalhes →
                          </Link>
                          <div className="flex gap-3">
                            <Link
                              href={`/noticias/${newsItem.newsId}`}
                              className={actionButtonClasses}
                              style={secondaryButtonStyles}
                            >
                              Editar
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
