"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  primaryButtonStyles,
  secondaryButtonStyles,
  actionButtonClasses,
} from "@/styles/styles";
import { formatDate } from "@/utils/formats";
import { COLORS } from "@/styles/colors";
import { NewsItem, UpdateNewsRequest } from "@/types/news";

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

interface NewsFormProps {
  initialData: NewsItem;
  onSubmit: (data: UpdateNewsRequest) => void;
  onDelete: () => void;
  isSaving: boolean;
  isDeleting: boolean;
  feedback: FeedbackState;
  setFeedback: (feedback: FeedbackState) => void;
}

export default function NewsForm({
  initialData,
  onSubmit,
  onDelete,
  isSaving,
  isDeleting,
  feedback,
  setFeedback,
}: NewsFormProps) {
  const [title, setTitle] = useState(initialData.title ?? "");
  const [coverImage, setCoverImage] = useState(initialData.coverImage ?? "");
  const [content, setContent] = useState(initialData.content ?? "");
  const [isActive, setIsActive] = useState(initialData.isActive ?? true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [categoryIds] = useState<number[]>(
    initialData.newsCategories.map((item) => item.categories.categoryId)
  );
  const [eventIds] = useState<number[]>(
    initialData.newsEvents.map((item) => item.events.eventId)
  );
  const [tourIds] = useState<number[]>(
    initialData.newsTours.map((item) => item.tours.tourId)
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      setFeedback({
        type: "error",
        message: "Informe o título da notícia.",
      });
      return;
    }
    if (!content.trim()) {
      setFeedback({
        type: "error",
        message: "Informe o conteúdo da notícia.",
      });
      return;
    }

    setFeedback(null);
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      coverImage: coverImage.trim() || undefined,
      isActive,
      categoryIds,
      eventIds,
      tourIds,
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
              htmlFor="title"
              className="text-xs font-semibold uppercase tracking-[0.26em]"
              style={{ color: COLORS.textMuted }}
            >
              Título
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Digite o título da notícia"
              className="rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-(--input-ring)"
              style={{
                backgroundColor: "rgba(15,13,35,0.7)",
                borderColor: COLORS.borderSubtle,
              }}
              disabled={isSaving}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="coverImage"
              className="text-xs font-semibold uppercase tracking-[0.26em]"
              style={{ color: COLORS.textMuted }}
            >
              Imagem de capa (URL)
            </label>
            <input
              id="coverImage"
              type="text"
              value={coverImage}
              onChange={(event) => setCoverImage(event.target.value)}
              placeholder="Cole a URL da imagem de capa"
              className="rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-(--input-ring)"
              style={{
                backgroundColor: "rgba(15,13,35,0.7)",
                borderColor: COLORS.borderSubtle,
              }}
              disabled={isSaving}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="content"
              className="text-xs font-semibold uppercase tracking-[0.26em]"
              style={{ color: COLORS.textMuted }}
            >
              Conteúdo da notícia
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Escreva o conteúdo completo da notícia"
              className="min-h-[180px] rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-(--input-ring)"
              style={{
                backgroundColor: "rgba(15,13,35,0.7)",
                borderColor: COLORS.borderSubtle,
              }}
              disabled={isSaving}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div
              className="flex flex-col gap-2 rounded-2xl border px-4 py-4"
              style={{
                borderColor: COLORS.borderSubtle,
                backgroundColor: "rgba(15,13,35,0.5)",
              }}
            >
              <span
                className="text-xs font-semibold uppercase tracking-[0.26em]"
                style={{ color: COLORS.textMuted }}
              >
                Categorias
              </span>
              {initialData.newsCategories.length > 0 ? (
                <div
                  className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em]"
                  style={{ color: COLORS.textMuted }}
                >
                  {initialData.newsCategories.map((item) => (
                    <span
                      key={`${item.categories.categoryId}-${item.categories.name}`}
                      className="rounded-full px-3 py-1 font-semibold"
                      style={{
                        backgroundColor: "rgba(79,70,229,0.15)",
                        color: "#b4b8ff",
                      }}
                    >
                      {item.categories.name ?? "Sem nome"}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm">Nenhuma categoria vinculada.</span>
              )}
            </div>
            <div
              className="flex flex-col gap-2 rounded-2xl border px-4 py-4"
              style={{
                borderColor: COLORS.borderSubtle,
                backgroundColor: "rgba(15,13,35,0.5)",
              }}
            >
              <span
                className="text-xs font-semibold uppercase tracking-[0.26em]"
                style={{ color: COLORS.textMuted }}
              >
                Eventos relacionados
              </span>
              {initialData.newsEvents.length > 0 ? (
                <div
                  className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em]"
                  style={{ color: COLORS.textMuted }}
                >
                  {initialData.newsEvents.map((item) => (
                    <span
                      key={`${item.events.eventId}-${item.events.name}`}
                      className="rounded-full px-3 py-1 font-semibold"
                      style={{
                        backgroundColor: "rgba(234,179,8,0.18)",
                        color: "#fcd34d",
                      }}
                    >
                      {item.events.name ?? "Sem nome"}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm">Nenhum evento vinculado.</span>
              )}
            </div>
          </div>

          <div
            className="flex flex-col gap-2 rounded-2xl border px-4 py-4"
            style={{
              borderColor: COLORS.borderSubtle,
              backgroundColor: "rgba(15,13,35,0.5)",
            }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-[0.26em]"
              style={{ color: COLORS.textMuted }}
            >
              Tours relacionados
            </span>
            {initialData.newsTours.length > 0 ? (
              <div
                className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em]"
                style={{ color: COLORS.textMuted }}
              >
                {initialData.newsTours.map((item) => (
                  <span
                    key={`${item.tours.tourId}-${item.tours.name}`}
                    className="rounded-full px-3 py-1 font-semibold"
                    style={{
                      backgroundColor: "rgba(16,185,129,0.18)",
                      color: "#6ee7b7",
                    }}
                  >
                    {item.tours.name ?? "Sem nome"}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm">Nenhum tour vinculado.</span>
            )}
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
                <strong className="text-white">Criada em:</strong>{" "}
                {formatDate(initialData.createdAt)}
              </span>
              <span>
                <strong className="text-white">Atualizada em:</strong>{" "}
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
              Notícia ativa
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
              href="/noticias"
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
          Esta ação é irreversível. Todos os dados relacionados a esta notícia
          serão removidos permanentemente.
        </p>

        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-2xl border border-red-500/50 bg-red-500/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-red-400 transition hover:bg-red-500/20"
          >
            Excluir Notícia
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
