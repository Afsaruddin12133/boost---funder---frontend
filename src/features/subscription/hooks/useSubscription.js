// Original implementation (commented out) preserved here so it can be re-enabled later.
// Full original is also available in `useSubscription.orig.js`.
// ---------------------------------------------------------------------
// import { useQuery } from "@tanstack/react-query";
// import api from "@/lib/api";
//
// export const useActiveSubscription = (enabled = true) =>
//   useQuery({
//     queryKey: ["active-subscription"],
//     queryFn: async () => {
//       const res = await api.get("/api/v1/subscription/me");
//       return res?.data || res;
//     },
//     enabled: !!enabled,
//     retry: 1,
//     staleTime: 1000 * 60 * 5, // 5 minutes
//   });
//
// export const useMySubscription = useActiveSubscription;
// ---------------------------------------------------------------------

// Temporarily mock subscription responses so all users are treated as `elite`.
// This avoids network calls and disables gating while preserving the
// original implementation in the commented block above.
export const useActiveSubscription = (enabled = true) => {
  if (!enabled) return { data: null };
  return {
    data: {
      plan: 'elite',
      name: 'elite',
      activePlan: 'elite'
    }
  };
};

export const useMySubscription = useActiveSubscription;
