import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nerta Brasil",
  description: "Química automotiva premium belga, distribuída pela Provisão.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
