import { useQuery } from "@tanstack/react-query";
import { experienceService } from "../api/experience.service";

export const useExperience = (id: string | undefined) => {
  const {
    data: experience = null,
    isLoading: loading,
    error,
    refetch: refresh,
  } = useQuery({
    queryKey: ["experience", id],
    queryFn: async () => {
      if (!id) return null;
      const response: any = await experienceService.getById(id);
      return response.data || response;
    },
    enabled: !!id,
  });

  return {
    experience,
    loading,
    error: error ? (error as any).message : null,
    refresh,
  };
};
