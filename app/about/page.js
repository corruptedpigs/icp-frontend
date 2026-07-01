import { Suspense } from "react";
import AboutPageClient from "./AboutPageClient";

export default function AboutPage() {
  return (
    <Suspense fallback={null}>
      <AboutPageClient />
    </Suspense>
  );
}
