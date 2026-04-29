import { useQuery } from "@tanstack/react-query";
import { getMyDeals } from "../services/deal.service";
import { normalizeDealList } from "../utils/dealUtils";

export const useMyDeals = () =>
  useQuery({
    queryKey: ["my-deals"],
    queryFn: getMyDeals,
    select: normalizeDealList,
  });
