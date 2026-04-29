import { useQuery } from "@tanstack/react-query";
import { getDealById } from "../services/deal.service";
import { normalizeDeal } from "../utils/dealUtils";

export const useDealDetails = (id) =>
  useQuery({
    queryKey: ["deal-details", id],
    queryFn: () => getDealById(id),
    enabled: id !== undefined && id !== null,
    select: normalizeDeal,
  });
