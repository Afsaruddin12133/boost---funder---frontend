export const PLACEHOLDER_MEDIA =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'><rect width='640' height='360' fill='%230b0b0b'/><path d='M0 280 L160 180 L320 280 L420 220 L640 320 L640 360 L0 360 Z' fill='%231b1b1b'/><circle cx='520' cy='120' r='36' fill='%23222222'/><text x='40' y='70' fill='%23666666' font-family='Arial, sans-serif' font-size='22'>No media</text></svg>";

export const resolveDealList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.deals)) return data.deals;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export const normalizeDeal = (deal) => {
  if (!deal) return null;
  const base = deal?.deal ?? deal?.data?.deal ?? deal;
  return {
    ...base,
    id: base.id ?? base._id,
  };
};

export const normalizeDealList = (data) =>
  resolveDealList(data).map(normalizeDeal).filter(Boolean);

export const getDealName = (deal) =>
  deal?.basicInfo?.startupName || deal?.startupName || deal?.name || "Untitled deal";

export const getDealMedia = (deal) => {
  if (deal?.basicInfo?.startupLogo) return [deal.basicInfo.startupLogo];
  return Array.isArray(deal?.media) ? deal.media : [];
};

export const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

export const calculateProgress = (raisedAmount, goalAmount) => {
  const raised = toNumber(raisedAmount);
  const goal = toNumber(goalAmount);
  if (goal <= 0) return 0;
  return Math.min(raised / goal, 1);
};

export const formatCurrency = (amount, currency = "USD") => {
  const number = Number(amount);
  if (!Number.isFinite(number)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(number);
};

export const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

export const getStatusMeta = (status) => {
  const raw = status?.toString() || "draft";
  const normalized = raw.toLowerCase().replace(/[^a-z]/g, "");
  switch (normalized) {
    case "draft":
      return { label: "Draft", className: "bg-white/10 text-white/60 border-white/10" };
    case "complete":
      return { label: "Complete", className: "bg-blue-500/10 text-blue-300 border-blue-500/20" };
    case "pendingreview":
      return { label: "Pending Review", className: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20" };
    case "approved":
      return { label: "Approved", className: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" };
    case "rejected":
      return { label: "Rejected", className: "bg-red-500/10 text-red-300 border-red-500/20" };
    default:
      return { label: raw, className: "bg-white/10 text-white/60 border-white/10" };
  }
};
