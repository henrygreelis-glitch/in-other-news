import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "In Other News — Uniform 01";
const description =
  "One considered uniform for the first cold week, with direct product shopping links.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const shareImage = `${protocol}://${host}/og.png`;

  return {
    title,
    description,
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: "In Other News — Uniform 01",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
