import { useQuery } from "@tanstack/react-query";
import { getMySubscription } from "../services/subscription.service";

export const useMySubscription = () =>
  useQuery({
    queryKey: ["subscription-me"],
    queryFn: getMySubscription,
    retry: false,
  });
