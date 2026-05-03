"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
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
import LocalizationsServer from "@/server/localizations";
import { LocalizationsListResponse } from "@/types/localizations";
import { formatCepDisplay } from "@/utils/formats";

export default function LocationsContainer() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const { data, isLoading, isError, refetch } =
    useQuery<LocalizationsListResponse>({
      queryKey: ["locations-list", appliedSearch],
      staleTime: 1000 * 60,
      queryFn: async () => {
        const response = await LocalizationsServer.getLocalizations({
          name: appliedSearch || undefined,
        });
        if (!response.isSuccess || !response.data) {
          throw new Error(
            response.error?.message ?? "Não foi possível carregar os locais."
          );
        }
        return response.data;
      },
    });

  const locations = data?.localizations ?? [];
  const totalLocations = locations.length;

  const emptyMessage = useMemo(() => {
    if (appliedSearch) {
      return "Nenhum local encontrado para o filtro informado.";
    }
    return "Nenhum local cadastrado até o momento.";
  }, [appliedSearch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAppliedSearch(search.trim());
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
                Painel Administrativo / Locais
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold">Locais cadastrados</h1>
                  <p className="text-sm" style={{ color: COLORS.textMuted }}>
                    Gerencie os locais disponíveis para eventos.
                  </p>
                </div>
                <span
                  className="text-xs uppercase tracking-[0.26em]"
                  style={{ color: COLORS.textMuted }}
                >
                  {totalLocations} locais
                </span>
              </div>
            </div>
          }
          actions={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/locais/novo"
                className={actionButtonClasses}
                style={primaryButtonStyles}
              >
                Novo local
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
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 rounded-3xl border px-6 py-5 text-sm sm:flex-row sm:items-center sm:justify-between"
            style={{
              backgroundColor: COLORS.inputBackground,
              borderColor: COLORS.borderSubtle,
              color: COLORS.textSecondary,
            }}
          >
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <label
                htmlFor="search"
                className="text-xs uppercase tracking-[0.24em]"
              >
                Buscar por nome
              </label>
              <input
                id="search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Digite o nome do local"
                className="w-full rounded-xl border px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-(--input-ring)"
                style={{
                  backgroundColor: "rgba(15,13,35,0.7)",
                  borderColor: COLORS.borderSubtle,
                }}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setAppliedSearch("");
                }}
                className="rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition hover:bg-(--btn-hover) focus:outline-none focus:ring-4 focus:ring-(--btn-ring)"
                style={secondaryButtonStyles}
              >
                Limpar
              </button>
              <button
                type="submit"
                className="rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition hover:bg-(--btn-hover) focus:outline-none focus:ring-4 focus:ring-(--btn-ring)"
                style={primaryButtonStyles}
              >
                Filtrar
              </button>
            </div>
          </form>

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
                  Não foi possível carregar os locais.
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
            ) : locations.length === 0 ? (
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
                  href="/locais/novo"
                  className={actionButtonClasses}
                  style={primaryButtonStyles}
                >
                  Cadastrar local
                </Link>
              </div>
            ) : (
              <div
                className="overflow-hidden rounded-3xl border"
                style={{ borderColor: COLORS.borderSubtle }}
              >
                <table className="min-w-full divide-y divide-white/5 text-sm">
                  <thead
                    style={{
                      background: "rgba(15,13,35,0.6)",
                      color: COLORS.textMuted,
                    }}
                  >
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold uppercase tracking-[0.24em]">
                        Nome
                      </th>
                      <th className="px-6 py-4 text-left font-semibold uppercase tracking-[0.24em]">
                        CEP
                      </th>
                      <th className="px-6 py-4 text-left font-semibold uppercase tracking-[0.24em]">
                        Endereço
                      </th>
                      <th className="px-6 py-4 text-left font-semibold uppercase tracking-[0.24em]">
                        Cidade
                      </th>
                      <th className="px-6 py-4 text-right font-semibold uppercase tracking-[0.24em]">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {locations.map((location) => (
                      <tr
                        key={location.localizationId}
                        className="transition hover:bg-white/5"
                        onClick={() =>
                          router.push(`/locais/${location.localizationId}`)
                        }
                      >
                        <td className="px-6 py-4 text-white">
                          {location.name ?? "Sem nome"}
                        </td>
                        <td
                          className="px-6 py-4"
                          style={{ color: COLORS.textSecondary }}
                        >
                          {formatCepDisplay(location.zipCode)}
                        </td>
                        <td
                          className="px-6 py-4"
                          style={{ color: COLORS.textSecondary }}
                        >
                          {location.address ?? "Não informado"}
                        </td>
                        <td
                          className="px-6 py-4"
                          style={{ color: COLORS.textSecondary }}
                        >
                          {location.city ?? "Não informado"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/locais/${location.localizationId}`}
                              className="text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-80"
                              onClick={(event) => event.stopPropagation()}
                            >
                              Detalhes
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
