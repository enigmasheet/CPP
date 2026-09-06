import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Resource {
  _id: string;
  title: string;
  topic: string;
  type: "code" | "diagram" | "document";
  content: string;
  language?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  createdAt: string;
}

const QUERY_KEY = ["resources"] as const;

export function useResources() {
  return useQuery<Resource[]>({
    queryKey: QUERY_KEY,
    queryFn: () => api.get("/api/resources"),
  });
}
