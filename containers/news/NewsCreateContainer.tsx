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
import NewsServer from "@/server/news";
import { CreateNewsRequest } from "@/types/news";

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

export default function NewsCreateContainer() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const mutation = useMutation({
    mutationFn: async (data: CreateNewsRequest) => {
      const response = await NewsServer.createNews(data);
      if (!response.isSuccess || !response.data) {
        throw new Error(
          response.error?.message || "Não foi possível criar a notícia."
        );
      }
      return response.data;
    },
    onSuccess: (data) => {
      setFeedback({
        type: "success",
        message: "Notícia criada com sucesso!",
      });
      setTimeout(() => {
        router.push(`/noticias/${data.newsId}`);
      }, 1500);
    },
    onError: (error: Error) => {
      setFeedback({
        type: "error",
        message: error.message || "Erro ao criar notícia.",
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

    if (!title.trim()) {
      setFeedback({ type: "error", message: "Título é obrigatório" });
      return;
    }
    if (!content.trim()) {
      setFeedback({ type: "error", message: "Conteúdo é obrigatório" });
      return;
    }

    mutation.mutate({
      title: title.trim(),
      content: content.trim(),
      coverImage: coverImage.trim() || undefined,
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
                Painel Administrativo / Notícias / Nova
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Criar nova notícia</h1>
                <p className="text-sm" style={{ color: COLORS.textMuted }}>
                  Preencha os dados para publicar uma nova notícia.
                </p>
              </div>
            </div>
          }
          actions={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/noticias"
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
                  htmlFor="title"
                  className="block text-xs font-semibold uppercase tracking-[0.3em]"
                  style={{ color: COLORS.textMuted }}
                >
                  Título
                </label>
                <input
                  id="title"
                  type="text"
                  className="mt-3 w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2"
                  style={inputStyles}
                  placeholder="Digite o título da notícia"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div>
                <label
                  htmlFor="coverImage"
                  className="block text-xs font-semibold uppercase tracking-[0.3em]"
                  style={{ color: COLORS.textMuted }}
                >
                  URL da Imagem de Capa (Opcional)
                </label>
                <input
                  id="coverImage"
                  type="text"
                  className="mt-3 w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2"
                  style={inputStyles}
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-xs font-semibold uppercase tracking-[0.3em]"
                  style={{ color: COLORS.textMuted }}
                >
                  Conteúdo
                </label>
                <textarea
                  id="content"
                  className="mt-3 w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2"
                  style={inputStyles}
                  placeholder="Escreva o conteúdo da notícia"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isSaving}
                  rows={10}
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
                  href="/noticias"
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
                  {isSaving ? "Salvando..." : "Criar Notícia"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
