"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "@/styles/colors";
import {
  inputStyles,
  buttonStyles,
  alertErrorStyles,
  alertSuccessStyles,
} from "@/styles/styles";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "@/store/auth";

export default function LoginContainer() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const result = await dispatch(login({ email, password }));

      if (login.fulfilled.match(result)) {
        if (result.payload?.user?.type === "admin") {
          setSuccess("Login realizado com sucesso.");
          router.push("/");
        } else {
          setError(
            "Acesso não autorizado. Apenas administradores podem fazer login."
          );
        }
      } else if (login.rejected.match(result)) {
        setError(result.payload || "Não foi possível realizar o login.");
      }
    } catch (error) {
      console.error(error);
      setError("Erro ao tentar logar, tente mais tarde!");
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-6 py-16 text-white sm:px-8"
      style={{ backgroundColor: COLORS.backgroundBase }}
    >
      <div
        className="flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border md:flex-row"
        style={{
          background: COLORS.surfaceGradient,
          borderColor: COLORS.borderFaint,
          boxShadow: COLORS.panelShadow,
        }}
      >
        <div
          className="flex flex-1 flex-col justify-between p-12"
          style={{ background: COLORS.sidebarGradient }}
        >
          <div className="flex flex-1 items-center justify-center">
            <div className="relative h-64 w-full max-w-md">
              <Image
                src="/showzin-header.png"
                alt="Showzin Admin"
                fill
                sizes="(max-width: 768px) 80vw, 400px"
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="mt-12 hidden md:block">
            <div className="space-y-3">
              <div
                className="h-2 w-28 rounded-full"
                style={{ backgroundColor: COLORS.dividerAccent }}
              />
              <div
                className="h-2 w-20 rounded-full"
                style={{ backgroundColor: COLORS.borderSubtle }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center p-10 md:p-14">
          <div className="w-full max-w-sm">
            <div className="mb-10">
              <h1 className="text-3xl font-semibold tracking-tight">
                Bem-vindo de volta
              </h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-[0.3em]"
                  style={{ color: COLORS.textMuted }}
                >
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  className="mt-3 w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-(--input-ring) focus:border-(--input-border-focus)"
                  style={inputStyles}
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-[0.3em]"
                  style={{ color: COLORS.textMuted }}
                >
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  className="mt-3 w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-(--input-ring) focus:border-(--input-border-focus)"
                  style={inputStyles}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="cursor-pointer mt-2 w-full rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-(--btn-hover) focus:outline-none focus:ring-4 focus:ring-(--btn-ring)"
                style={buttonStyles}
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </button>
              {(error || success) && (
                <div className="space-y-3">
                  {error && (
                    <p
                      className="rounded-2xl border px-4 py-3 text-sm"
                      style={alertErrorStyles}
                    >
                      {error}
                    </p>
                  )}
                  {success && (
                    <p
                      className="rounded-2xl border px-4 py-3 text-sm"
                      style={alertSuccessStyles}
                    >
                      {success}
                    </p>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
