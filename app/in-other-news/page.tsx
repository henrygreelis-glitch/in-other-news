import type { Metadata } from "next";
import Uniform from "../../issue";

export const metadata: Metadata = {
  title: "In Other News — Uniform 01",
  description:
    "A weekly fashion edit: discover one complete look, compare retail and pre-owned options, and save the pieces worth watching.",
};

export default function InOtherNewsPage() {
  return <Uniform />;
}
