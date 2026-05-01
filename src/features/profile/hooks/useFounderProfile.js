import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFounderProfile, updateFounderProfile } from "../services/profile.service";

export const useFounderProfile = () =>
  useQuery({
    queryKey: ["founder-profile"],
    queryFn: getFounderProfile,
    retry: false,
  });

export const useUpdateFounderProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFounderProfile,
    onSuccess: () => {
      // Force an immediate refetch so the UI reflects the saved data right away
      queryClient.refetchQueries({ queryKey: ["founder-profile"] });
    },
  });
};

