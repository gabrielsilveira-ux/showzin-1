"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  primaryButtonStyles,
  secondaryButtonStyles,
  actionButtonClasses,
} from "@/styles/styles";
import { formatDate, formatCepDisplay } from "@/utils/formats";
import { COLORS } from "@/styles/colors";
import {
  LocalizationDetails,
  UpdateLocalizationRequest,
} from "@/types/localizations";
import CitiesServer, { City } from "@/server/cities";

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

interface LocationFormProps {
  initialData: LocalizationDetails;
  onSubmit: (data: UpdateLocalizationRequest) => void;
  onDelete: () => void;
  isSaving: boolean;
  isDeleting: boolean;
  feedback: FeedbackState;
  setFeedback: (feedback: FeedbackState) => void;
}

export default function LocationForm({
  initialData,
  onSubmit,
  onDelete,
  isSaving,
  isDeleting,
  feedback,
  setFeedback,
}: LocationFormProps) {
  const [name, setName] = useState(initialData.name ?? "");
  const [zipCode, setZipCode] = useState(initialData.zipCode ?? "");
  const [address, setAddress] = useState(initialData.address ?? "");
  const [cityId, setCityId] = useState(
    initialData.cityId ? String(initialData.cityId) : ""
  );
  const [citySearch, setCitySearch] = useState(
    initialData.localizationsCities?.name ?? ""
  );
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [debouncedCitySearch, setDebouncedCitySearch] = useState("");
  const [isActive, setIsActive] = useState(initialData.isActive ?? true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCitySearch(citySearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [citySearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: citiesData } = useQuery({
    queryKey: ["cities", debouncedCitySearch],
    queryFn: async () => {
      if (debouncedCitySearch.length < 3) return { cities: [] };
      const response = await CitiesServer.getCities({
        name: debouncedCitySearch,
      });
      if (response.isSuccess && response.data) {
        return response.data;
      }
      return { cities: [] };
    },
    enabled: debouncedCitySearch.length >= 3,
  });

  const cities = citiesData?.cities ?? [];

  const handleCitySelect = (city: City) => {
    setCityId(String(city.cityId));
    const stateSuffix = city.localizationsStates
      ? ` - ${city.localizationsStates.abbreviation}`
      : "";
    setCitySearch(`${city.name}${stateSuffix}`);
    setShowCityDropdown(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      setFeedback({
        type: "error",
        message: "Informe o nome do local.",
      });
      return;
    }
    if (!zipCode.trim()) {
      setFeedback({
        type: "error",
        message: "Informe o CEP.",
      });
      return;
    }
    if (!address.trim()) {
      setFeedback({
        type: "error",
        message: "Informe o endereço.",
      });
      return;
    }
    if (!cityId) {
      setFeedback({
        type: "error",
        message: "Selecione uma cidade.",
      });
      return;
    }

    setFeedback(null);
    onSubmit({
      name: name.trim(),
      zipCode: zipCode.replace(/\D/g, ""),
      address: address.trim(),
      cityId: Number(cityId),
      isActive,
    });
  };

  return (
    <div
      className="mx-auto w-full max-w-4xl space-y-8"
      style={{ color: COLORS.textSecondary }}
    >
      <div
        className="rounded-3xl border px-6 py-8"
        style={{
          backgroundColor: COLORS.inputBackground,
          borderColor: COLORS.borderSubtle,
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-xs font-semibold uppercase tracking-[0.26em]"
              style={{ color: COLORS.textMuted }}
            >
              Nome do local
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Digite o nome do local"
              className="rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-(--input-ring)"
              style={{
                backgroundColor: "rgba(15,13,35,0.7)",
                borderColor: COLORS.borderSubtle,
              }}
              disabled={isSaving}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="zipCode"
                className="text-xs font-semibold uppercase tracking-[0.26em]"
                style={{ color: COLORS.textMuted }}
              >
                CEP
              </label>
              <input
                id="zipCode"
                type="text"
                value={zipCode}
                onChange={(event) =>
                  setZipCode(formatCepDisplay(event.target.value))
                }
                placeholder="00000-000"
                maxLength={9}
                className="rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-(--input-ring)"
                style={{
                  backgroundColor: "rgba(15,13,35,0.7)",
                  borderColor: COLORS.borderSubtle,
                }}
                disabled={isSaving}
              />
            </div>

            <div className="relative flex flex-col gap-2" ref={dropdownRef}>
              <label
                htmlFor="city"
                className="text-xs font-semibold uppercase tracking-[0.26em]"
                style={{ color: COLORS.textMuted }}
              >
                Cidade
              </label>
              <input
                id="city"
                type="text"
                value={citySearch}
                onChange={(e) => {
                  setCitySearch(e.target.value);
                  setShowCityDropdown(true);
                  if (!e.target.value) {
                    setCityId("");
                  }
                }}
                onFocus={() => setShowCityDropdown(true)}
                placeholder="Busque a cidade..."
                className="rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-(--input-ring)"
                style={{
                  backgroundColor: "rgba(15,13,35,0.7)",
                  borderColor: COLORS.borderSubtle,
                }}
                disabled={isSaving}
              />
              {showCityDropdown &&
                (cities.length > 0 || citySearch.length >= 3) && (
                  <div
                    className="absolute top-full z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border py-1 shadow-lg"
                    style={{
                      backgroundColor: COLORS.inputBackground,
                      borderColor: COLORS.borderSubtle,
                    }}
                  >
                    {cities.length > 0 ? (
                      cities.map((city) => (
                        <button
                          key={city.cityId}
                          type="button"
                          onClick={() => handleCitySelect(city)}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10"
                        >
                          {city.name}
                          {city.localizationsStates &&
                            ` - ${city.localizationsStates.abbreviation}`}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-white/60">
                        Nenhuma cidade encontrada
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="address"
              className="text-xs font-semibold uppercase tracking-[0.26em]"
              style={{ color: COLORS.textMuted }}
            >
              Endereço completo
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Rua, número, bairro..."
              className="rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-(--input-ring)"
              style={{
                backgroundColor: "rgba(15,13,35,0.7)",
                borderColor: COLORS.borderSubtle,
              }}
              disabled={isSaving}
            />
          </div>

          <div
            className="flex flex-col gap-2 rounded-2xl border px-4 py-4 text-sm"
            style={{
              borderColor: COLORS.borderSubtle,
              backgroundColor: "rgba(15,13,35,0.5)",
              color: COLORS.textSecondary,
            }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-[0.26em]"
              style={{ color: COLORS.textMuted }}
            >
              Informações adicionais
            </span>
            <div className="grid gap-2 md:grid-cols-2">
              <span>
                <strong className="text-white">Criado em:</strong>{" "}
                {formatDate(initialData.createdAt)}
              </span>
              <span>
                <strong className="text-white">Atualizado em:</strong>{" "}
                {formatDate(initialData.updatedAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="h-5 w-5 rounded border border-white/30 bg-transparent text-indigo-500 focus:ring-indigo-400"
              disabled={isSaving}
            />
            <label htmlFor="isActive" className="text-sm text-white">
              Local ativo
            </label>
          </div>

          {feedback && (
            <div
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{
                borderColor:
                  feedback.type === "success"
                    ? "rgba(72, 255, 168, 0.3)"
                    : "rgba(255, 92, 135, 0.3)",
                backgroundColor:
                  feedback.type === "success"
                    ? "rgba(15, 43, 35, 0.6)"
                    : "rgba(42, 13, 31, 0.6)",
                color:
                  feedback.type === "success"
                    ? COLORS.successText
                    : COLORS.errorText ?? "#ff8faf",
              }}
            >
              {feedback.message}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/localizacoes"
              className={actionButtonClasses}
              style={secondaryButtonStyles}
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] transition disabled:opacity-60"
              style={primaryButtonStyles}
            >
              {isSaving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>

      <div
        className="rounded-3xl border p-8"
        style={{
          backgroundColor: "rgba(220,38,38,0.1)",
          borderColor: "rgba(220,38,38,0.3)",
        }}
      >
        <p className="mb-6 text-sm" style={{ color: COLORS.textSecondary }}>
          Esta ação é irreversível. Todos os dados relacionados a este local
          serão removidos permanentemente.
        </p>

        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-2xl border border-red-500/50 bg-red-500/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-red-400 transition hover:bg-red-500/20"
          >
            Excluir Local
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onDelete}
              disabled={isDeleting}
              className="rounded-2xl border border-red-500 bg-red-500 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-red-600 disabled:opacity-50"
            >
              {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
              className="rounded-2xl px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] transition"
              style={secondaryButtonStyles}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
