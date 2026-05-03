"use client";

import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/common/Sidebar";
import PageHeader from "@/components/common/PageHeader";
import { COLORS } from "@/styles/colors";
import {
  actionButtonClasses,
  primaryButtonStyles,
  secondaryButtonStyles,
  inputStyles,
  alertErrorStyles,
  alertSuccessStyles,
} from "@/styles/styles";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/auth";
import LocalizationsServer from "@/server/localizations";
import CitiesServer, { City } from "@/server/cities";
import { CreateLocalizationRequest } from "@/types/localizations";
import { formatCepToInput, formatCepDisplay } from "@/utils/formats";

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

export default function LocationCreateContainer() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [cityId, setCityId] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [debouncedCitySearch, setDebouncedCitySearch] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCitySearch(citySearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [citySearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#citySearch") && !target.closest(".city-dropdown")) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const { data: citiesData, isLoading: isLoadingCities } = useQuery({
    queryKey: ["cities-search", debouncedCitySearch],
    queryFn: async () => {
      if (!debouncedCitySearch || debouncedCitySearch.trim().length < 2) {
        return { cities: [] };
      }
      const response = await CitiesServer.getCities({
        name: debouncedCitySearch,
      });
      if (!response.isSuccess || !response.data) {
        throw new Error("Não foi possível carregar as cidades.");
      }
      return response.data;
    },
    enabled: debouncedCitySearch.trim().length >= 2,
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateLocalizationRequest) => {
      const response = await LocalizationsServer.createLocalization(data);
      if (!response.isSuccess || !response.data) {
        throw new Error(
          response.error?.message || "Não foi possível criar o local."
        );
      }
      return response.data;
    },
    onSuccess: (data) => {
      setFeedback({
        type: "success",
        message: "Local criado com sucesso!",
      });
      setTimeout(() => {
        router.push(`/locais/${data.localizationId}`);
      }, 1500);
    },
    onError: (error: Error) => {
      setFeedback({
        type: "error",
        message: error.message || "Erro ao criar local.",
      });
    },
  });

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleCitySelect = (city: City) => {
    setCityId(city.cityId.toString());
    setCitySearch(
      `${city.name}${
        city.localizationsStates
          ? ` - ${city.localizationsStates.abbreviation}`
          : ""
      }`
    );
    setShowCityDropdown(false);
  };

  const handleCityInputChange = (value: string) => {
    setCitySearch(value);
    setShowCityDropdown(true);
    if (!value.trim()) {
      setCityId("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!name.trim()) {
      setFeedback({ type: "error", message: "Nome é obrigatório" });
      return;
    }
    if (!zipCode.trim()) {
      setFeedback({ type: "error", message: "CEP é obrigatório" });
      return;
    }
    if (!address.trim()) {
      setFeedback({ type: "error", message: "Endereço é obrigatório" });
      return;
    }
    if (!cityId) {
      setFeedback({ type: "error", message: "Cidade é obrigatória" });
      return;
    }

    const cleanZipCode = zipCode.replace(/\D/g, "");

    mutation.mutate({
      name: name.trim(),
      zipCode: cleanZipCode,
      address: address.trim(),
      cityId: Number(cityId),
    });
  };

  const isSaving = mutation.isPending;
  const cities = citiesData?.cities ?? [];

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
                Painel Administrativo / Locais / Novo
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Criar novo local</h1>
                <p className="text-sm" style={{ color: COLORS.textMuted }}>
                  Preencha os dados para cadastrar um novo local.
                </p>
              </div>
            </div>
          }
          actions={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/locais"
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
          <div
            className="mx-auto max-w-3xl rounded-3xl border p-8"
            style={{
              backgroundColor: COLORS.inputBackground,
              borderColor: COLORS.borderSubtle,
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold uppercase tracking-[0.3em]"
                  style={{ color: COLORS.textMuted }}
                >
                  Nome do Local
                </label>
                <input
                  id="name"
                  type="text"
                  className="mt-3 w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2"
                  style={inputStyles}
                  placeholder="Digite o nome do local"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div>
                <label
                  htmlFor="zipCode"
                  className="block text-xs font-semibold uppercase tracking-[0.3em]"
                  style={{ color: COLORS.textMuted }}
                >
                  CEP
                </label>
                <input
                  id="zipCode"
                  type="text"
                  className="mt-3 w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2"
                  style={inputStyles}
                  placeholder="00000-000"
                  value={formatCepDisplay(zipCode)}
                  onChange={(e) => setZipCode(formatCepToInput(e.target.value))}
                  maxLength={9}
                  disabled={isSaving}
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-xs font-semibold uppercase tracking-[0.3em]"
                  style={{ color: COLORS.textMuted }}
                >
                  Endereço
                </label>
                <input
                  id="address"
                  type="text"
                  className="mt-3 w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2"
                  style={inputStyles}
                  placeholder="Digite o endereço completo"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="citySearch"
                  className="block text-xs font-semibold uppercase tracking-[0.3em]"
                  style={{ color: COLORS.textMuted }}
                >
                  Cidade
                </label>
                <input
                  id="citySearch"
                  type="text"
                  className="mt-3 w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2"
                  style={inputStyles}
                  placeholder="Digite o nome da cidade"
                  value={citySearch}
                  onChange={(e) => handleCityInputChange(e.target.value)}
                  onFocus={() => setShowCityDropdown(true)}
                  disabled={isSaving}
                  autoComplete="off"
                />
                {showCityDropdown && citySearch.trim().length >= 2 && (
                  <div
                    className="city-dropdown absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border"
                    style={{
                      backgroundColor: COLORS.inputBackground,
                      borderColor: COLORS.borderSubtle,
                    }}
                  >
                    {isLoadingCities ? (
                      <div className="px-4 py-3 text-center text-sm text-white">
                        Buscando cidades...
                      </div>
                    ) : cities.length > 0 ? (
                      cities.map((city: City) => (
                        <button
                          key={city.cityId}
                          type="button"
                          onClick={() => handleCitySelect(city)}
                          className="w-full px-4 py-3 text-left text-sm text-white transition hover:bg-white/10"
                        >
                          {city.name}
                          {city.localizationsStates && (
                            <span style={{ color: COLORS.textMuted }}>
                              {" "}
                              - {city.localizationsStates.abbreviation}
                            </span>
                          )}
                        </button>
                      ))
                    ) : (
                      <div
                        className="px-4 py-3 text-center text-sm"
                        style={{ color: COLORS.textMuted }}
                      >
                        {debouncedCitySearch.trim().length >= 2
                          ? "Nenhuma cidade encontrada"
                          : "Digite pelo menos 2 caracteres"}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {feedback && (
                <div
                  className="rounded-2xl border px-4 py-3 text-sm"
                  style={
                    feedback.type === "error"
                      ? alertErrorStyles
                      : alertSuccessStyles
                  }
                >
                  {feedback.message}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Link
                  href="/locais"
                  className="flex-1 rounded-2xl px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.25em] transition"
                  style={secondaryButtonStyles}
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] transition disabled:opacity-50"
                  style={primaryButtonStyles}
                  disabled={isSaving}
                >
                  {isSaving ? "Salvando..." : "Criar Local"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
