import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitDeal } from "../services/deal.service";

export const useSubmitDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitDeal,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-deals"] });
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      if (data?.id || data?._id) {
        queryClient.invalidateQueries({ queryKey: ["deal", data.id || data._id] });
      }
    },
  });
};
