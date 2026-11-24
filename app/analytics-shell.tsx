"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { pushDataLayerEvent } from "@/lib/analytics";

export default function AnalyticsShell() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPageViewKey = useRef("");

  useEffect(() => {
    const query = searchParams.toString();
    const pageViewKey = `${pathname}?${query}`;

    if (lastPageViewKey.current === pageViewKey) {
      return;
    }

    lastPageViewKey.current = pageViewKey;

    pushDataLayerEvent({
      event: "virtual_page_view",
      page_path: pathname,
      page_location: `${window.location.origin}${pathname}${query ? `?${query}` : ""}`,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
