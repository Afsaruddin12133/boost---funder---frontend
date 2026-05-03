import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getInvestorVerificationStatus,
    submitInvestorVerification,
} from "../services/investorVerification.service";

export const useInvestorVerificationStatus = (options = {}) =>
  useQuery({
    queryKey: ["investor-verification-status"],
    queryFn: getInvestorVerificationStatus,
    retry: false,
    ...options
  });

export const useSubmitInvestorVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitInvestorVerification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investor-verification-status"] });
    },
  });
};
