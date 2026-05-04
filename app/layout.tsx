import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/components/core/ReduxProvider";
import ApplicationWrapper from "@/components/core/ApplicationWrapper";
import QueryProvider from "@/components/core/QueryProvider";

export const metadata: Metadata = {
  title: "Showzin Admin",
  description: "Showzin admin panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="antialiased"
      >
        <ReduxProvider>
          <ApplicationWrapper>
            <QueryProvider>{children}</QueryProvider>
          </ApplicationWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
