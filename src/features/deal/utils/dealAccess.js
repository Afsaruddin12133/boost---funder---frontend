export const getPlanFlags = (plan) => {
  // Force plan to 'elite' so that all users can explore everything.
  const normalized = "elite";
  return {
    plan: normalized,
    isFree: false,
    isPro: false,
    isElite: true,
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
  return "elite";
};

export const computeProgress = (raised, goal) => {
  if (!goal || goal <= 0) return 0;
  const rawPercent = (raised / goal) * 100;
  if (raised > 0 && rawPercent < 1) {
    return 1;
  }
  return Math.min(100, Math.round(rawPercent));
};

export const computeDaysLeft = (deadline) => {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - new Date().getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
};
