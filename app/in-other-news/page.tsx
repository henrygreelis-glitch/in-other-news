import { redirect } from "next/navigation";

// The issue moved to the root; keep the old path working for shared links.
export default function InOtherNewsPage() {
  redirect("/");
}
