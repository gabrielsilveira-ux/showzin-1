"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/common/Sidebar";
import PageHeader from "@/components/common/PageHeader";
import { COLORS } from "@/styles/colors";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/auth";
import Loading from "@/components/common/Loading";
import EventsServer from "@/server/events";
import { EventListItem, EventsListResponse } from "@/types/events";
import {
  actionButtonClasses,
  primaryButtonStyles,
  secondaryButtonStyles,
} from "@/styles/styles";
import { formatDate } from "@/utils/formats";

export default function HomeContainer() {
  const dispatch = useAppDispatch();
  const { data, isLoading, isError, refetch } = useQuery<EventsListResponse>({
    queryKey: ["events-list"],
    staleTime: 1000 * 60,
    queryFn: async () => {
      const response = await EventsServer.getEvents({ limit: 24 });
      if (!response.isSuccess || !response.data) {
        throw new Error(
          response.error?.message ?? "Não foi possível carregar os eventos."
        );
      }
      return response.data;
    },
  });

  const events = data?.events ?? [];
  const totalEvents = data?.pagination.total ?? events.length;

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
                Painel Administrativo / Eventos
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold">
                    Eventos cadastrados
                  </h1>
                  <p className="text-sm" style={{ color: COLORS.textMuted }}>
                    Acompanhe todos os eventos salvos na plataforma.
                  </p>
                </div>
                <span
                  className="text-xs uppercase tracking-[0.26em]"
                  style={{ color: COLORS.textMuted }}
                >
                  {totalEvents} eventos
                </span>
              </div>
            </div>
          }
          actions={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/events/new"
                className={actionButtonClasses}
                style={primaryButtonStyles}
              >
                Criar evento
              </Link>
              <button
                type="button"
                onClick={() => dispatch(logout())}
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
                Não foi possível carregar os eventos.
              </p>
              <p className="text-sm">
                Tente novamente em instantes ou atualize a página.
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
          ) : events.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-4 rounded-3xl border px-6 py-16 text-center"
              style={{
                backgroundColor: COLORS.inputBackground,
                borderColor: COLORS.borderSubtle,
                color: COLORS.textSecondary,
              }}
            >
              <p className="text-lg font-semibold text-white">
                Nenhum evento cadastrado ainda.
              </p>
              <p className="text-sm">
                Crie um novo evento para começar a acompanhar os resultados por
                aqui.
              </p>
              <Link
                href="/events/new"
                className={actionButtonClasses}
                style={primaryButtonStyles}
              >
                Criar primeiro evento
              </Link>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {events.map((event: EventListItem) => {
                  const categories = event.eventsCategories
                    ?.map((item) => item.categories.name)
                    .filter(Boolean) as string[];
                  const statusActive = event.isActive ?? false;

                  return (
                    <div
                      key={event.eventId}
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
                          {statusActive ? "Ativo" : "Inativo"}
                        </p>
                        <span
                          className="text-xs font-semibold uppercase tracking-[0.2em]"
                          style={{ color: COLORS.textMuted }}
                        >
                          #{event.eventId}
                        </span>
                      </div>

                      <div className="mt-6 space-y-3">
                        <h2 className="text-xl font-semibold text-white">
                          {event.name ?? "Evento sem nome"}
                        </h2>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: COLORS.textSecondary }}
                        >
                          {event.description
                            ? event.description
                            : "Este evento ainda não possui descrição adicionada."}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div
                            className="flex items-center gap-2"
                            style={{ color: COLORS.textSecondary }}
                          >
                            <span className="font-semibold text-white">
                              Produtora:
                            </span>
                            <span>
                              {event.producers?.name ?? "Não informado"}
                            </span>
                          </div>
                          <div
                            className="flex items-center gap-2"
                            style={{ color: COLORS.textSecondary }}
                          >
                            <span className="font-semibold text-white">
                              Local:
                            </span>
                            <span>
                              {event.localizations?.name ??
                                event.localizations?.address ??
                                "Não informado"}
                            </span>
                          </div>
                          <div
                            className="flex flex-col gap-1"
                            style={{ color: COLORS.textSecondary }}
                          >
                            <span className="font-semibold text-white">
                              Agenda:
                            </span>
                            <span>Início: {formatDate(event.startDate)}</span>
                            <span>Término: {formatDate(event.endDate)}</span>
                          </div>
                        </div>
                        {categories.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {categories.map((category) => (
                              <span
                                key={`${event.eventId}-${category}`}
                                className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
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
                      </div>

                      <div className="mt-8 flex items-center justify-between">
                        <Link
                          href={`/events/${event.eventId}`}
                          className="text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-80"
                        >
                          Ver detalhes →
                        </Link>
                        <div className="flex gap-3">
                          <Link
                            href={`/events/${event.eventId}/edit`}
                            className={actionButtonClasses}
                            style={secondaryButtonStyles}
                          >
                            Editar
                          </Link>
                          <Link
                            href={`/events/${event.eventId}`}
                            className={actionButtonClasses}
                            style={primaryButtonStyles}
                          >
                            Visualizar
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
