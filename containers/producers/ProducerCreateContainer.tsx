"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
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
import ProducersServer from "@/server/producers";
import { CreateProducerRequest } from "@/types/producers";
import { formatCnpjToInput } from "@/utils/formats";

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

export default function ProducerCreateContainer() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const mutation = useMutation({
    mutationFn: async (data: CreateProducerRequest) => {
      const response = await ProducersServer.createProducer(data);
      if (!response.isSuccess || !response.data) {
        throw new Error(
          response.error?.message || "Não foi possível criar a produtora."
        );
      }
      return response.data;
    },
    onSuccess: (data) => {
      setFeedback({
        type: "success",
        message: "Produtora criada com sucesso!",
      });
      setTimeout(() => {
        router.push(`/produtoras/${data.producerId}`);
      }, 1500);
    },
    onError: (error: Error) => {
      setFeedback({
        type: "error",
        message: error.message || "Erro ao criar produtora.",
      });
    },
  });

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!name.trim()) {
      setFeedback({ type: "error", message: "Nome é obrigatório" });
      return;
    }
    if (!documentNumber.trim()) {
      setFeedback({ type: "error", message: "CNPJ é obrigatório" });
      return;
    }

    const cleanCnpj = documentNumber.replace(/\D/g, "");
    if (cleanCnpj.length !== 14) {
      setFeedback({ type: "error", message: "CNPJ deve ter 14 dígitos" });
      return;
    }

    mutation.mutate({
      name: name.trim(),
      documentNumber: cleanCnpj,
    });
  };

  const isSaving = mutation.isPending;

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
                Painel Administrativo / Produtoras / Nova
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Criar nova produtora</h1>
                <p className="text-sm" style={{ color: COLORS.textMuted }}>
                  Preencha os dados para cadastrar uma nova produtora.
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
                  href="/produtoras"
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
                  {isSaving ? "Salvando..." : "Criar Produtora"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
