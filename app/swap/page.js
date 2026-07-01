import { Suspense } from "react";
import SwapPageClient from "./SwapPageClient";

export const metadata = {
  title: "Swap | Corrupted Pigs",
  description: `Swap tokens to get $${process.env.NEXT_PUBLIC_TRACKED_TOKEN_SYMBOL || "COINK"} on Polygon`,
};

export default function SwapPage() {
  return (
    <Suspense fallback={null}>
      <SwapPageClient />
    </Suspense>
  );
}
