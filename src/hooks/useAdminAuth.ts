"use client";

import { useQuery } from "@tanstack/react-query";

export function useAdminAuth() {
  return useQuery({
    queryKey: ["admin-auth"],
    queryFn: () => fetch("/api/admin/verify").then((r) => r.json()),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
