import { Suspense } from "react";
import MintPageClient from "./MintPageClient";

export const metadata = {
  title: "Mint | Corrupted Pigs",
  description: "Buy Corrupted Pigs NFT packs using $COINK on Polygon",
};

export default function MintPage() {
  return (
    <Suspense fallback={null}>
      <MintPageClient />
    </Suspense>
  );
}
