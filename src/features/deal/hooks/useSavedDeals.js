import { useQuery } from "@tanstack/react-query";
import { getSavedDeals } from "../services/deal.service";

export const useSavedDeals = (enabled = true) =>
  useQuery({
    queryKey: ["saved-deals"],
    queryFn: getSavedDeals,
    enabled: !!enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
