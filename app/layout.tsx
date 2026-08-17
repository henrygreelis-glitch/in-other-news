import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://inothernews.co"),
  title: {
    default: "In Other News",
    template: "%s | In Other News",
  },
  description:
    "A weekly menswear edit: one complete uniform, with every piece matched to live retail and resale listings.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "In Other News",
    description:
      "A weekly menswear edit: one complete uniform, with every piece matched to live retail and resale listings.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "In Other News",
    description:
      "A weekly menswear edit: one complete uniform, with every piece matched to live retail and resale listings.",
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
