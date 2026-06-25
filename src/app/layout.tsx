import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Nerta Brasil — Química Automotiva Premium",
    template: "%s | Nerta Brasil",
  },
  description:
    "Química automotiva premium de origem belga. Produtos de alta performance para frotas, agro, animal care e detailing profissional no Brasil.",
  metadataBase: new URL("https://nertabrasil.com.br"),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Nerta Brasil",
  },
  robots: {
    index: true,
    follow: true,
  },
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
