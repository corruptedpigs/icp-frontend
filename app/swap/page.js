import { Suspense } from "react";
import SwapPageClient from "./SwapPageClient";

export const metadata = {
  title: "Swap | Corrupted Pigs",
  description: "Swap tokens to get $COINK on Polygon",
};

export default function SwapPage() {
  return (
    <Suspense fallback={null}>
      <SwapPageClient />
    </Suspense>
  );
}
