import { ReactNode } from "react";
import { COLORS } from "@/styles/colors";

type PageHeaderProps = {
  headerContent: ReactNode;
  actions: ReactNode;
};

export default function PageHeader({
  headerContent,
  actions,
}: PageHeaderProps) {
  return (
    <header
      className="flex flex-col gap-6 border-b px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10"
      style={{
        background: COLORS.surfaceGradient,
        borderColor: COLORS.borderFaint,
      }}
    >
      {headerContent}
      {actions}
    </header>
  );
}
