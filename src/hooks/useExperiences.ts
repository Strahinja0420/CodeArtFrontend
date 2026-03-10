import { useQuery } from "@tanstack/react-query";
import { experienceService } from "../api/experience.service";
import type { Experience } from "../types/experience";

export const useExperiences = () => {
  const {
    data: experiences = [],
    isLoading: loading,
    error,
    refetch: refresh,
  } = useQuery<Experience[]>({
    queryKey: ["experiences", "me"],
    queryFn: async () => {
      const response: any = await experienceService.getMyExperiences();
      // Since our axios interceptor returns response.data,
      // and if the backend returns { data: [...] }, we get { data: [...] }
      return response.data || response;
    },
  });

  return {
    experiences,
    loading,
    error: error ? (error as any).message : null,
    refresh,
  };
};
