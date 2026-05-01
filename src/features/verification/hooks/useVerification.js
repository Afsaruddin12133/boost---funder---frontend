import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getVerificationStatus, submitVerification } from "../services/verification.service";

export const useVerificationStatus = () =>
  useQuery({
    queryKey: ["verification-status"],
    queryFn: getVerificationStatus,
    retry: false,
  });

export const useSubmitVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitVerification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verification-status"] });
    },
  });
};
