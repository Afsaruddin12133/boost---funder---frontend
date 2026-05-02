import { useMySubscription } from "@/features/subscription/hooks/useSubscription";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  FileText,
  Mail,
  Phone,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useDealDetails } from "../hooks/useDealDetails";
import { getAccessLocks, getPlanFlags, hasValue, normalizePlan } from "../utils/dealAccess";
import { formatCurrency, formatDate, getStatusMeta } from "../utils/dealUtils";
import DaysLeftBadge from "./DaysLeftBadge";
import DealSection from "./DealSection";
import ProgressBar from "./ProgressBar";

function DealDetailSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-xl bg-white/10" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-56 bg-white/10" />
          <Skeleton className="h-4 w-32 bg-white/10" />
        </div>
      </div>
      <div className="grid lg:grid-cols-[1.6fr_0.9fr] gap-6">
        <div className="space-y-4">
          <Skeleton className="h-44 w-full rounded-2xl bg-white/10" />
          <Skeleton className="h-36 w-full rounded-xl bg-white/10" />
          <Skeleton className="h-36 w-full rounded-xl bg-white/10" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-xl bg-white/10" />
          <Skeleton className="h-60 w-full rounded-xl bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default function DealDetailPage({ deal, dealId, onBack }) {
  const navigate = useNavigate();
  const { data: subscriptionData } = useMySubscription();
  const plan = useMemo(() => normalizePlan(subscriptionData), [subscriptionData]);
  const { lockedPremium, lockedSensitive } = getAccessLocks(plan);
  const { isFree, isElite } = getPlanFlags(plan);

  const shouldFetchDeal = !deal && dealId !== undefined && dealId !== null;
  const {
    data: fetchedDeal,
    isLoading: dealLoading,
    isError: dealError,
    refetch: refetchDeal,
  } = useDealDetails(shouldFetchDeal ? dealId : null);

  const activeDeal = deal || fetchedDeal;

  if (shouldFetchDeal && dealLoading) {
    return <DealDetailSkeleton />;
  }

  if (shouldFetchDeal && dealError) {
    return (
      <Card className="bg-[#0c0c0c] border-white/10 p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <p className="font-semibold text-white mb-2">We could not load this deal</p>
        <p className="text-sm text-white/50 mb-5">Please check your connection and try again.</p>
        <Button
          onClick={() => refetchDeal()}
          className="bg-[#01F27B] hover:bg-[#01F27B]/90 text-black font-semibold"
        >
          Retry
        </Button>
      </Card>
    );
  }

  if (!activeDeal) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-white/60">No deal data available.</p>
      </div>
    );
  }

  const basicInfo = activeDeal.basicInfo || {};
  const execution = activeDeal.execution || {};
  const funding = activeDeal.funding || {};
  const documents = activeDeal.documents || {};
  const story = activeDeal.story || {};

  const name = basicInfo.startupName || activeDeal.startupName || "Untitled Deal";
  const tagline = basicInfo.tagline || activeDeal.tagline || "";
  const category = basicInfo.category || activeDeal.category || "—";
  const stage = basicInfo.stage || activeDeal.stage || "—";
  const location = basicInfo.location || activeDeal.location || "—";
  const website = basicInfo.startupWebsite || activeDeal.startupWebsite || null;
  const logo = basicInfo.startupLogo || activeDeal.startupLogo || null;

  const raised = funding.raisedAmount ?? activeDeal.raisedAmount ?? 0;
  const goal = funding.goalAmount ?? activeDeal.goalAmount ?? 0;
  const deadline = funding.deadline ?? activeDeal.deadline ?? null;

  const revenue = execution.revenue ?? activeDeal.revenue ?? null;
  const businessModel = execution.businessModel ?? activeDeal.businessModel ?? null;
  const goToMarket = execution.goToMarket ?? activeDeal.goToMarket ?? null;
  const topCompetitor = execution.topCompetitor ?? activeDeal.topCompetitor ?? null;
  const advantage = execution.advantage ?? activeDeal.advantage ?? null;
  const team = execution.team ?? activeDeal.team ?? [];
  const useOfFunds = execution.useOfFunds ?? activeDeal.useOfFunds ?? [];
  const qa = execution.qa ?? activeDeal.qa ?? [];
  const revenueMetrics = {
    users: funding.users ?? activeDeal.users ?? null,
    growthRate: funding.growthRate ?? activeDeal.growthRate ?? null,
    CAC: funding.CAC ?? activeDeal.CAC ?? null,
    LTV: funding.LTV ?? activeDeal.LTV ?? null,
    CHURN: funding.CHURN ?? activeDeal.CHURN ?? null,
  };

  const founderContact = activeDeal.founderContact ?? basicInfo.founderContact ?? null;
  const founderPhone =
    activeDeal.founderPhone ??
    activeDeal.founderphone ??
    basicInfo.founderPhone ??
    basicInfo.founderphone ??
    (typeof founderContact === "object" ? founderContact?.phone : null) ??
    null;
  const pitchDeck = documents.pitchDeck ?? activeDeal.pitchDeck ?? null;
  const financialDetails = activeDeal.financialDetails ?? funding.financialDetails ?? null;
  const detailedTractionData = execution.detailedTractionData ?? activeDeal.detailedTractionData ?? null;

  const statusMeta = getStatusMeta(activeDeal.status);
  const verified = activeDeal.verificationBadge?.isVerified || false;

  const daysLeftLabel = deadline ? formatDate(deadline) : "—";
  const handleUpgrade = () => navigate("/subscription");
  const handleBack = onBack || (() => navigate(-1));
  const lockFounderWhatsApp = isFree;

  const renderKeyValues = (obj) => (
    <div className="space-y-2">
      {Object.entries(obj).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between text-xs">
          <span className="text-white/50 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
          <span className="text-white/80">{String(value)}</span>
        </div>
      ))}
    </div>
  );

  const renderTeam = (members) => (
    <div className="space-y-3">
      {members.map((member, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-[#01F27B] font-semibold">
            {member?.name?.charAt(0)?.toUpperCase() || member?.field1?.charAt?.(0)?.toUpperCase?.() || index + 1}
          </div>
          <div>
            <p className="text-sm text-white">{member?.name || member?.field1 || `Team Member ${index + 1}`}</p>
            {member?.role && <p className="text-xs text-white/50">{member.role}</p>}
            {!member?.role && member?.field2 && <p className="text-xs text-white/50">{member.field2}</p>}
          </div>
        </div>
      ))}
    </div>
  );

  const renderUseOfFunds = (items) => (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-white/70">{item.category || item.field1 || `Allocation ${index + 1}`}</span>
            <span className="text-[#01F27B] font-semibold">{item.percentage ?? item.field2 ?? 0}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#01F27B] rounded-full"
              style={{ width: `${item.percentage ?? item.field2 ?? 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderMetrics = (metrics) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Object.entries(metrics).map(([key, value]) => {
        if (!hasValue(value)) return null;
        return (
          <div key={key} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/40 mb-1">{key}</p>
            <p className="text-sm text-white font-medium">{String(value)}</p>
          </div>
        );
      })}
    </div>
  );

  const renderDocuments = (docs) => {
    const entries = Object.entries(docs).filter(([, value]) => hasValue(value));
    if (!entries.length) {
      return <p className="text-sm text-white/50">No documents uploaded yet.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {entries.map(([key, url]) => {
          const label =
            {
              pitchDeck: "Pitch Deck",
              safeAgreement: "SAFE Agreement",
              termSheet: "Term Sheet",
              registrationCertificate: "Registration Certificate",
              tradeLicense: "Trade License",
              balanceSheet: "Balance Sheet",
              revenueProof: "Revenue Proof",
              capTable: "Cap Table",
              shareholderAgreement: "Shareholder Agreement",
            }[key] || key;

          return (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-[#01F27B]/30 hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#01F27B]/10 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#01F27B]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate">{label}</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">Click to open</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-[#01F27B] shrink-0" />
            </a>
          );
        })}
      </div>
    );
  };

  const renderQa = (items) => (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item?._id || index} className="space-y-1">
          <p className="text-xs text-white/60">Q: {item.question || `Question ${index + 1}`}</p>
          <p className="text-sm text-white">{item.answer || "—"}</p>
        </div>
      ))}
    </div>
  );

  const renderContact = (contact) => {
    if (typeof contact === "string") return contact;
    return (
      <div className="space-y-2">
        {contact.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-white/40" />
            <span>{contact.email}</span>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-white/40" />
            <span>{contact.phone}</span>
          </div>
        )}
        {!contact.email && !contact.phone && renderKeyValues(contact)}
      </div>
    );
  };

  const renderDocumentLink = (url, label) => {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-[#01F27B] text-sm hover:underline"
      >
        <FileText className="w-4 h-4" />
        {label}
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    );
  };

  const renderSection = (title, value, isLocked, renderValue) => {
    const hasData = hasValue(value);
    const content = hasData ? value : "—";

    let renderedContent = content;
    if (renderValue && hasData) {
      renderedContent = renderValue(value);
    } else if (Array.isArray(content)) {
      const isFundList = content[0]?.percentage !== undefined;
      renderedContent = isFundList ? renderUseOfFunds(content) : renderTeam(content);
    } else if (typeof content === "object" && content !== null) {
      renderedContent = renderKeyValues(content);
    }

    return (
      <DealSection
        title={title}
        content={renderedContent}
        isLocked={isLocked || !hasData}
        onUpgrade={handleUpgrade}
      />
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-wrap items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="border border-white/10 hover:bg-white/5 text-white/70 hover:text-white rounded-xl"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-white/50 text-sm">{tagline || `${category} · ${stage}`}</p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Badge className={`border ${statusMeta.className}`}>{statusMeta.label}</Badge>
          {verified && (
            <Badge className="bg-[#01F27B]/10 text-[#01F27B] border-[#01F27B]/20">Verified</Badge>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
        <div className="space-y-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-[#07140c] via-[#0c0c0c] to-[#020202] border-[#01F27B]/20 p-6 md:p-8">
            <div className="absolute -top-24 right-10 w-64 h-64 bg-[#01F27B]/10 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#01F27B]/50 to-transparent" />
            <div className="relative flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-20 h-20 bg-black/60 border border-white/10 rounded-2xl flex items-center justify-center text-4xl shrink-0 overflow-hidden">
                {logo ? <img src={logo} alt={name} className="w-full h-full object-cover" /> : "🚀"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="outline" className="border-white/20">{category}</Badge>
                  <Badge variant="outline" className="border-white/20">{stage}</Badge>
                  {location !== "—" && (
                    <span className="text-xs text-white/50">{location}</span>
                  )}
                  {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#01F27B] hover:underline inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Website
                    </a>
                  )}
                </div>
                <p className="text-sm text-white/70 leading-relaxed max-w-2xl">
                  {story.summary || story.problem || story.solution || "Investor-ready deal overview."}
                </p>
              </div>
              <div className="flex flex-col gap-2 text-right">
                <span className="text-xs text-white/50">Funding goal</span>
                <span className="text-2xl font-semibold text-white">{formatCurrency(goal)}</span>
                <span className="text-xs text-white/40">Raised {formatCurrency(raised)}</span>
              </div>
            </div>
          </Card>

          <Card className="bg-[#0c0c0c] border-white/10 p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Funding Snapshot</p>
                <p className="text-xs text-white/50">Updated in real time</p>
              </div>
              <DaysLeftBadge deadline={deadline} />
            </div>
            <ProgressBar raised={raised} goal={goal} />
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-white/50 mb-1">Goal Amount</p>
                <p className="text-lg font-semibold text-white">{formatCurrency(goal)}</p>
              </div>
              <div>
                <p className="text-xs text-white/50 mb-1">Raised</p>
                <p className="text-lg font-semibold text-white">{formatCurrency(raised)}</p>
              </div>
              <div>
                <p className="text-xs text-white/50 mb-1">Deadline</p>
                <p className="text-sm text-white">{daysLeftLabel}</p>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Overview</p>
            <div className="grid md:grid-cols-2 gap-4">
              {renderSection("Problem", story.problem, false)}
              {renderSection("Solution", story.solution, false)}
              {renderSection("Target Market", story.targetMarket, false)}
              {renderSection("Why Now", story.whyNow, false)}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Founder Q&A</p>
            <div className="grid md:grid-cols-2 gap-4">
              {renderSection("Questions & Answers", qa, false, renderQa)}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Premium Insights</p>
            <div className="grid md:grid-cols-2 gap-4">
              {renderSection("Revenue", revenue, lockedPremium, (value) =>
                typeof value === "number" ? formatCurrency(value) : value
              )}
              {renderSection("Business Model", businessModel, lockedPremium)}
              {renderSection("Go-To-Market", goToMarket, lockedPremium)}
              {renderSection("Top Competitor", topCompetitor, lockedPremium)}
              {renderSection("Unfair Advantage", advantage, lockedPremium)}
              {renderSection("Team", team, lockedPremium, renderTeam)}
              {renderSection("Use of Funds", useOfFunds, lockedPremium, renderUseOfFunds)}
              {renderSection("Analytics Metrics", revenueMetrics, lockedPremium, renderMetrics)}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Sensitive Data Room</p>
            <div className="grid md:grid-cols-2 gap-4">
              {renderSection("Founder Contact", founderContact, lockedSensitive, renderContact)}
              {renderSection("Founder WhatsApp", founderPhone, lockedSensitive, (value) => {
                const clean = String(value || "").replace(/\D/g, "");
                return clean ? (
                  <a
                    href={`https://wa.me/${clean}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[#01F27B] hover:underline"
                  >
                    Open WhatsApp
                  </a>
                ) : (
                  <span className="text-white/50">Not provided</span>
                );
              })}
              {renderSection("Documents", documents, lockedSensitive, renderDocuments)}
              {renderSection("Financial Details", financialDetails, lockedSensitive)}
              {renderSection("Detailed Traction", detailedTractionData, lockedSensitive)}
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24 h-fit">
          <Card className="bg-[#0c0c0c] border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Investor Actions</p>
              <Badge className="border border-white/10 bg-white/5 text-white/60 text-[10px]">
                {String(plan || "free").toUpperCase()} PLAN
              </Badge>
            </div>
            <Button
              disabled={deadline && new Date(deadline).getTime() < Date.now()}
              className="w-full bg-[#01F27B] hover:bg-[#01F27B]/90 text-black font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Invest Now
            </Button>
            {lockFounderWhatsApp ? (
              <Button
                variant="outline"
                onClick={handleUpgrade}
                className="w-full border-white/10 text-white/70 hover:bg-white/5"
              >
                Unlock founder WhatsApp (Pro)
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  if (!founderPhone) return;
                  const clean = String(founderPhone).replace(/\D/g, "");
                  window.open(`https://wa.me/${clean}`, "_blank");
                }}
                className="w-full border-white/10 text-white/70 hover:bg-white/5"
              >
                Connect on WhatsApp
              </Button>
            )}
          </Card>

          <Card className="bg-[#0c0c0c] border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Deal Health</p>
              <DaysLeftBadge deadline={deadline} />
            </div>
            <ProgressBar raised={raised} goal={goal} />
            <div className="space-y-2 text-xs text-white/50">
              <div className="flex items-center justify-between">
                <span>Deadline</span>
                <span>{daysLeftLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status</span>
                <span className="text-white/70">{statusMeta.label}</span>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#06120b] to-[#0c0c0c] border-[#01F27B]/20 p-5 space-y-3">
            <p className="text-sm font-semibold">Quick Facts</p>
            <div className="space-y-2 text-xs text-white/60">
              <div className="flex items-center justify-between">
                <span>Category</span>
                <span className="text-white/80">{category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Stage</span>
                <span className="text-white/80">{stage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Location</span>
                <span className="text-white/80">{location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Plan Access</span>
                <span className="text-white/80">{String(plan || "free").toUpperCase()}</span>
              </div>
              {isElite && (
                <div className="flex items-center justify-between">
                  <span>Elite Mode</span>
                  <span className="text-[#01F27B]">All data unlocked</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
