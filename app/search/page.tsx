import type { Metadata } from "next";
import ProductSearch from "../../search";

export const metadata: Metadata = {
  title: "Compare & Search — In Other News",
  description:
    "Personalize this week’s fashion selection, compare pre-owned listings, and set an alert for the right version.",
};

type SearchPageProps = {
  searchParams: Promise<{ product?: string | string[] }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const productKey =
    typeof params.product === "string" ? params.product : "";

  return <ProductSearch productKey={productKey} />;
}
