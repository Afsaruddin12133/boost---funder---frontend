export const SUBSCRIPTION_TIERS = Object.freeze({
  FREE: "free",
  PRO: "pro",
  ENTERPRISE: "enterprise",
});

export const SUBSCRIPTION_FEATURES = Object.freeze({
  [SUBSCRIPTION_TIERS.FREE]: ["Browse public deals", "Limited requests"],
  [SUBSCRIPTION_TIERS.PRO]: ["Unlimited deal access", "Priority support", "Analytics"],
  [SUBSCRIPTION_TIERS.ENTERPRISE]: ["All Pro features", "Dedicated manager", "Custom integrations"],
});
