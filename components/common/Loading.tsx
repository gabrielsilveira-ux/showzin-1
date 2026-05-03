import { COLORS } from "@/styles/colors";

type LoadingProps = {
  fullscreen?: boolean;
};

export default function Loading({ fullscreen = true }: LoadingProps) {
  const containerClasses = fullscreen
    ? "flex min-h-screen w-full items-center justify-center"
    : "flex h-full w-full items-center justify-center";

  return (
    <div className={containerClasses}>
      <div
        className="h-12 w-12 animate-spin rounded-full border-4"
        style={{
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderTopColor: COLORS.accentPrimary,
        }}
      />
    </div>
  );
}
