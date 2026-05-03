import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getVerificationStatus, submitVerification } from "../services/verification.service";

export const useVerificationStatus = (options = {}) =>
  useQuery({
    queryKey: ["verification-status"],
    queryFn: getVerificationStatus,
    retry: false,
    ...options
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
