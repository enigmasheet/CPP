"use client";

import { useQuery } from "@tanstack/react-query";
import { ADMIN_AUTH_STALE_TIME_MS } from "@/lib/constants";

export function useAdminAuth() {
  return useQuery({
    queryKey: ["admin-auth"],
    queryFn: () => fetch("/api/admin/verify").then((r) => r.json()),
    staleTime: ADMIN_AUTH_STALE_TIME_MS,
    retry: false,
  });
}
