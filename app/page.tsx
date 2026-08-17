import type { Metadata } from "next";
import Uniform from "../issue";

export const metadata: Metadata = {
  title: { absolute: "In Other News — Uniform 01" },
  description:
    "A weekly fashion edit: discover one complete look, compare retail and pre-owned options, and save the pieces worth watching.",
  openGraph: {
    title: "In Other News — Issue 01",
    description: "The uniform for the first cold week.",
    type: "website",
    images: [
      {
        url: "/og-issue-01.png",
        width: 1729,
        height: 910,
        alt: "In Other News Issue 01 — The uniform for the first cold week",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "In Other News — Issue 01",
    description: "The uniform for the first cold week.",
    images: ["/og-issue-01.png"],
  },
};

export default function Home() {
  return <Uniform />;
}
