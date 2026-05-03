"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COLORS } from "@/styles/colors";

type SidebarLink = {
  label: string;
  href: string;
};

type SidebarProps = {
  links?: SidebarLink[];
};

const DEFAULT_LINKS: SidebarLink[] = [
  { label: "Eventos", href: "/" },
  { label: "Notícias", href: "/noticias" },
  { label: "Locais", href: "/locais" },
  { label: "Produtoras", href: "/produtoras" },
  { label: "Categorias", href: "/categorias" },
];

export default function Sidebar({ links = DEFAULT_LINKS }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside
      className="hidden w-72 flex-col justify-between border-r px-6 py-8 lg:flex"
      style={{
        background: COLORS.sidebarGradient,
        borderColor: COLORS.borderFaint,
        color: "white",
      }}
    >
      <div className="space-y-10">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-bold"
            style={{ background: COLORS.brandGradient }}
          >
            S
          </div>
          <div>
            <p className="text-base font-semibold uppercase tracking-[0.25em]">
              Showzin
            </p>
            <span
              className="text-xs uppercase tracking-[0.28em]"
              style={{ color: COLORS.textMuted }}
            >
              Painel Admin
            </span>
          </div>
        </div>

        <nav className="space-y-2">
          {links.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-4 py-3 text-sm font-medium transition"
                style={{
                  backgroundColor: active
                    ? COLORS.inputBackground
                    : "transparent",
                  border: active
                    ? `1px solid ${COLORS.borderSubtle}`
                    : "1px solid transparent",
                  color: active ? "white" : COLORS.textMuted,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2 text-xs" style={{ color: COLORS.textMuted }}>
        <p>© {new Date().getFullYear()} Showzin</p>
        <p>Plataforma administrativa</p>
      </div>
    </aside>
  );
}
