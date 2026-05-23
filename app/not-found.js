"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function NotFound() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_not_found", {
        event_category: "404 Errors",
        event_label: window.location.href,
        page_path: window.location.pathname + window.location.search,
      });
    }
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <h1>404 – Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/">Go back home</Link>
    </div>
  );
}
