import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface SessionData {
  _id: string;
  code: string;
  title: string;
  type: string;
  section?: string;
  items: Array<{ contentType: string; contentId: string; gameType?: string }>;
  isActive: boolean;
  createdAt: string;
  submissions: number;
  avgScore: number | null;
}

const QUERY_KEYS = {
  sessions: ["sessions"] as const,
};

export function useSessions() {
  return useQuery<SessionData[]>({
    queryKey: QUERY_KEYS.sessions,
    queryFn: () => api.get("/api/sessions"),
  });
}
