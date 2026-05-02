export const getPlanFlags = (plan) => {
  const normalized = String(plan || "free").toLowerCase();
  return {
    plan: normalized,
    isFree: normalized === "free",
    isPro: normalized === "pro",
    isElite: normalized === "elite",
  };
};

export const getAccessLocks = (plan) => {
  const { isFree, isPro } = getPlanFlags(plan);
  return {
    lockedPremium: isFree,
    lockedSensitive: isFree || isPro,
  };
};

export const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  if (Array.isArray(value) && value.length === 0) return false;
  if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) {
    return false;
  }
  return true;
};

export const normalizePlan = (subscription) => {
  const raw = subscription?.plan ?? subscription?.tier ?? subscription?.name ?? "free";
  if (typeof raw === "string") return raw.toLowerCase();
  if (typeof raw === "object" && raw !== null) {
    const fromObj = raw.name ?? raw.tier ?? raw.plan ?? "free";
    return String(fromObj).toLowerCase();
  }
  return "free";
};

export const computeProgress = (raised, goal) => {
  if (!goal || goal <= 0) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
};

export const computeDaysLeft = (deadline) => {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - new Date().getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
};
