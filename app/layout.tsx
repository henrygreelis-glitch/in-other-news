import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://inothernews.co"),
  title: {
    default: "Henry Greelis",
    template: "%s | Henry Greelis",
  },
  description:
    "Selected projects by Henry Greelis across positioning, product stories, and editorial ideas.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Henry Greelis",
    description:
      "Positioning, product stories, editorial ideas, and selected work by Henry Greelis.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Henry Greelis",
    description:
      "Positioning, product stories, editorial ideas, and selected work by Henry Greelis.",
  },
};

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
