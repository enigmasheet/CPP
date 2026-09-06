import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ClassData, ClassEntryData } from "@/lib/types";

const QUERY_KEYS = {
  classes: ["classes"] as const,
  classEntries: (classId: string) => ["classes", classId, "entries"] as const,
};

export function useClasses() {
  return useQuery<ClassData[]>({
    queryKey: QUERY_KEYS.classes,
    queryFn: () => api.get("/api/classes"),
  });
}

export function useClassEntries(classId: string | null) {
  return useQuery<ClassEntryData[]>({
    queryKey: QUERY_KEYS.classEntries(classId ?? ""),
    queryFn: () => api.get(`/api/classes/${classId}/entries`),
    enabled: !!classId,
  });
}

export function useCreateClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; subject: string; description?: string; semester?: string }) =>
      api.post<ClassData>("/api/classes", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.classes }),
  });
}

export function useUpdateClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; name: string; subject: string; description?: string; semester?: string }) =>
      api.patch<ClassData>(`/api/classes/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.classes }),
  });
}

export function useDeleteClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/classes/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.classes }),
  });
}

export function useCreateClassEntry(classId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { date: string; topics: string[]; sessionCode?: string; duration?: number; notes?: string }) =>
      api.post<ClassEntryData>(`/api/classes/${classId}/entries`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.classEntries(classId) }),
  });
}

export function useUpdateClassEntry(classId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ entryId, ...data }: { entryId: string; date: string; topics: string[]; sessionCode?: string; duration?: number; notes?: string }) =>
      api.patch<ClassEntryData>(`/api/classes/${classId}/entries/${entryId}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.classEntries(classId) }),
  });
}

export function useDeleteClassEntry(classId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entryId: string) => api.delete(`/api/classes/${classId}/entries/${entryId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.classEntries(classId) }),
  });
}
