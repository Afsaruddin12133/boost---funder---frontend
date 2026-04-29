import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDeal } from "../services/deal.service";

export const useDeleteDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-deals"] });
    },
  });
};
