import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useActiveSubscription = (enabled = true) =>
  useQuery({
    queryKey: ["active-subscription"],
    queryFn: async () => {
      const res = await api.get("/api/v1/subscription/me");
      return res?.data || res;
    },
    enabled: !!enabled,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const useMySubscription = useActiveSubscription;
