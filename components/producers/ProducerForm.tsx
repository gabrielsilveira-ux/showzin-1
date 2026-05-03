"use client";

import { FormEvent, useState } from "react";
import {
  primaryButtonStyles,
  secondaryButtonStyles,
  inputStyles,
  alertErrorStyles,
  alertSuccessStyles,
} from "@/styles/styles";
import {
  formatCnpjToInput,
  formatCnpjDisplay,
  formatDate,
} from "@/utils/formats";
import { COLORS } from "@/styles/colors";
import { Producer, UpdateProducerRequest } from "@/types/producers";

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

interface ProducerFormProps {
  initialData: Producer;
  onSubmit: (data: UpdateProducerRequest) => void;
  onDelete: () => void;
  isSaving: boolean;
  isDeleting: boolean;
  feedback: FeedbackState;
  setFeedback: (feedback: FeedbackState) => void;
}

export default function ProducerForm({
  initialData,
  onSubmit,
  onDelete,
  isSaving,
  isDeleting,
  feedback,
  setFeedback,
}: ProducerFormProps) {
  const [name, setName] = useState(initialData.name ?? "");
  const [documentNumber, setDocumentNumber] = useState(
    formatCnpjToInput(initialData.documentNumber)
  );
  const [isActive, setIsActive] = useState(initialData.isActive ?? true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      setFeedback({
        type: "error",
        message: "Informe o nome da produtora.",
      });
      return;
    }
    const cleanCnpj = documentNumber.replace(/\D/g, "");
    if (cleanCnpj.length !== 14) {
      setFeedback({
        type: "error",
        message: "Informe um CNPJ válido com 14 dígitos.",
      });
      return;
    }
    setFeedback(null);
    onSubmit({
      name: name.trim(),
      documentNumber: cleanCnpj,
      isActive,
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div
        className="rounded-3xl border p-8"
        style={{
          backgroundColor: COLORS.inputBackground,
          borderColor: COLORS.borderSubtle,
        }}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Informações da Produtora</h2>
          <div className="flex gap-3">
            <span
              className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{
                backgroundColor: isActive
                  ? "rgba(72,255,168,0.16)"
                  : "rgba(255,214,102,0.16)",
                color: isActive ? COLORS.successText : "#ffd666",
              }}
            >
              {isActive ? "Ativa" : "Inativa"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: COLORS.textMuted }}
            >
              Nome da Produtora
            </label>
            <input
              id="name"
              type="text"
              className="mt-3 w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2"
              style={inputStyles}
              placeholder="Digite o nome da produtora"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSaving}
            />
          </div>

          <div>
            <label
              htmlFor="documentNumber"
              className="block text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: COLORS.textMuted }}
            >
              CNPJ
            </label>
            <input
              id="documentNumber"
              type="text"
              className="mt-3 w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2"
              style={inputStyles}
              placeholder="00.000.000/0000-00"
              value={documentNumber}
              onChange={(e) =>
                setDocumentNumber(formatCnpjToInput(e.target.value))
              }
              maxLength={18}
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={isSaving}
                className="h-5 w-5 rounded"
              />
              <span className="text-sm" style={{ color: COLORS.textSecondary }}>
                Produtora ativa
              </span>
            </label>
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
            <button
              type="submit"
              className="flex-1 rounded-2xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] transition disabled:opacity-50"
              style={primaryButtonStyles}
              disabled={isSaving}
            >
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>

      <div
        className="rounded-3xl border p-8"
        style={{
          backgroundColor: COLORS.inputBackground,
          borderColor: COLORS.borderSubtle,
        }}
      >
        <h2 className="mb-6 text-xl font-semibold">Informações do Sistema</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div
            className="flex flex-col gap-2 rounded-2xl border px-4 py-4"
            style={{
              borderColor: COLORS.borderSubtle,
              backgroundColor: "rgba(15,13,35,0.7)",
            }}
          >
            <span
              className="text-xs uppercase tracking-[0.24em]"
              style={{ color: COLORS.textMuted }}
            >
              ID da Produtora
            </span>
            <span className="text-sm text-white">
              #{initialData.producerId}
            </span>
          </div>

          <div
            className="flex flex-col gap-2 rounded-2xl border px-4 py-4"
            style={{
              borderColor: COLORS.borderSubtle,
              backgroundColor: "rgba(15,13,35,0.7)",
            }}
          >
            <span
              className="text-xs uppercase tracking-[0.24em]"
              style={{ color: COLORS.textMuted }}
            >
              CNPJ Formatado
            </span>
            <span className="text-sm text-white">
              {formatCnpjDisplay(initialData.documentNumber)}
            </span>
          </div>

          {initialData.createdAt && (
            <div
              className="flex flex-col gap-2 rounded-2xl border px-4 py-4"
              style={{
                borderColor: COLORS.borderSubtle,
                backgroundColor: "rgba(15,13,35,0.7)",
              }}
            >
              <span
                className="text-xs uppercase tracking-[0.24em]"
                style={{ color: COLORS.textMuted }}
              >
                Criado em
              </span>
              <span className="text-sm text-white">
                {formatDate(initialData.createdAt)}
              </span>
            </div>
          )}

          {initialData.updatedAt && (
            <div
              className="flex flex-col gap-2 rounded-2xl border px-4 py-4"
              style={{
                borderColor: COLORS.borderSubtle,
                backgroundColor: "rgba(15,13,35,0.7)",
              }}
            >
              <span
                className="text-xs uppercase tracking-[0.24em]"
                style={{ color: COLORS.textMuted }}
              >
                Última atualização
              </span>
              <span className="text-sm text-white">
                {formatDate(initialData.updatedAt)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        className="rounded-3xl border p-8"
        style={{
          backgroundColor: "rgba(220,38,38,0.1)",
          borderColor: "rgba(220,38,38,0.3)",
        }}
      >
        <p className="mb-6 text-sm" style={{ color: COLORS.textSecondary }}>
          Esta ação é irreversível. Todos os dados relacionados a esta produtora
          serão removidos permanentemente.
        </p>

        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-2xl border border-red-500/50 bg-red-500/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-red-400 transition hover:bg-red-500/20"
          >
            Excluir Produtora
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
