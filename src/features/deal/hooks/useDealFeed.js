import { useQuery } from "@tanstack/react-query";
import { getDealFeed } from "../services/deal.service";
import { normalizeDealList } from "../utils/dealUtils";

export const useDealFeed = () =>
  useQuery({
    queryKey: ["deal-feed"],
    queryFn: getDealFeed,
    select: normalizeDealList,
  });
