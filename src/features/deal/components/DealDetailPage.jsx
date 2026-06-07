import { useMySubscription } from "@/features/subscription/hooks/useSubscription";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  Loader
} from "@/shared/ui";
import { cn } from "@/shared/ui/utils";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  FileText,
  Globe,
  Layers,
  Lock,
  MapPin,
  PieChart,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  Zap,
  MessageSquare,
  Phone
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useSubmitDeal } from "../hooks/useSubmitDeal";
import { useDealDetails } from "../hooks/useDealDetails";
import { getAccessLocks, hasValue, normalizePlan } from "../utils/dealAccess";
import { formatCurrency, getStatusMeta } from "../utils/dealUtils";
import DaysLeftBadge from "./DaysLeftBadge";
import ProgressBar from "./ProgressBar";
import { ProductStorySection, MarketStrategySection } from "./DealDetailSections";

// ─── MINIMALIST MODULE COMPONENTS ────────────────────────────────────────────

function DashCard({ title, subtitle, icon: Icon, children, className, locked, onUpgrade }) {
  const isElite = locked === "elite";
  const planName = isElite ? "Elite" : "Pro";
  const planDesc = isElite
    ? "Direct founder messaging and secure document vault."
    : "Market strategy, traction stats, team, and capital allocation.";

  return (
    <Card className={cn("bg-white/5 backdrop-blur-xl border-white/10 p-5 relative overflow-hidden flex flex-col h-full group", className)}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#01F27B]/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#01F27B]/10 border border-[#01F27B]/20 flex items-center justify-center text-[#01F27B] shadow-lg shadow-[#01F27B]/5">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight leading-none mb-1">{title}</h3>
            {subtitle && <p className="text-[10px] text-[#01F27B] font-black uppercase tracking-widest opacity-60">{subtitle}</p>}
          </div>
        </div>
        {locked && <Lock className="w-4 h-4 text-amber-500" />}
      </div>

      <div className={cn("flex-1 flex flex-col min-h-0", locked && "blur-md select-none opacity-40")}>
        {children}
      </div>

      {locked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/75 backdrop-blur-md p-6 text-center group cursor-pointer" onClick={onUpgrade}>
          <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(245,158,11,0.2)] group-hover:scale-110 transition-transform">
            <Lock className="text-amber-500 w-5 h-5" />
          </div>
          <h4 className="text-sm font-black text-white mb-1 uppercase tracking-wider">Locked Feature</h4>
          <p className="text-[10px] text-white/50 max-w-[200px] mb-4 leading-normal">{planDesc}</p>
          <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] uppercase tracking-wider rounded-lg h-8 px-4">
            Upgrade to {planName}
          </Button>
        </div>
      )}
    </Card>
  );
}

function MiniStat({ label, value, icon: Icon, sub, locked, onUpgrade }) {
  if (!hasValue(value) && !locked) return null;
  return (
    <div
      onClick={locked ? onUpgrade : undefined}
      className={cn(
        "bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3 group transition-all",
        locked ? "cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5" : "hover:border-[#01F27B]/30"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center transition-colors",
        locked ? "text-amber-500/40 group-hover:text-amber-500" : "text-white/30 group-hover:text-[#01F27B]"
      )}>
        {locked ? <Lock className="w-3.5 h-3.5" /> : <Icon className="w-4 h-4" />}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-tighter text-white/20 line-clamp-1">{label}</p>
        <p className={cn("text-sm font-black text-white truncate", locked && "blur-sm select-none")}>
          {locked ? "••••" : value}
        </p>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────

export default function DealDetailPage({ deal, dealId, onBack, userRole }) {

  const navigate = useNavigate();
  const submitDealMutation = useSubmitDeal();
  const { data: subscriptionData } = useMySubscription();
  const plan = useMemo(() => normalizePlan(subscriptionData), [subscriptionData]);

  const isFounder = userRole === 'founder';
  const { lockedPremium: rawLockedPremium, lockedSensitive: rawLockedSensitive } = getAccessLocks(plan);
  const lockedPremium = isFounder ? false : rawLockedPremium;
  const lockedSensitive = isFounder ? false : rawLockedSensitive;

  const shouldFetchDeal = !deal && dealId !== undefined && dealId !== null;
  const {
    data: fetchedDeal,
    isLoading: dealLoading,
    isError: dealError,
    refetch: refetchDeal,
  } = useDealDetails(shouldFetchDeal ? dealId : null);

  const activeDeal = deal || fetchedDeal;

  if (shouldFetchDeal && dealLoading) {
    return <Loader fullPage label="Syncing Dashboard..." />;
  }

  if (shouldFetchDeal && dealError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="bg-[#0c0c0c] border-white/10 p-8 text-center max-w-sm rounded-2xl">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Sync Error</h3>
          <p className="text-xs text-white/50 mb-6">Unable to connect to the deal data stream.</p>
          <Button onClick={() => refetchDeal()} className="w-full bg-[#01F27B] text-black font-black rounded-lg">Retry</Button>
        </Card>
      </div>
    );
  }

  if (!activeDeal) return null;
  console.log("activeDeal", activeDeal)
  const basicInfo = activeDeal.basicInfo || {};
  const execution = activeDeal.execution || {};
  const funding = activeDeal.funding || {};
  const documents = activeDeal.documents || {};
  const story = activeDeal.story || {};

  const normalizedExecution = {
    ...execution,
    businessModel: execution.businessModel || activeDeal.businessModel,
    goToMarket: execution.goToMarket || activeDeal.goToMarket,
    advantage: execution.advantage || activeDeal.advantage,
    team: (execution.team && execution.team.length) ? execution.team : (activeDeal.team || []),
    useOfFunds: (execution.useOfFunds && execution.useOfFunds.length) ? execution.useOfFunds : (activeDeal.useOfFunds || []),
    qa: (execution.qa && execution.qa.length) ? execution.qa : (activeDeal.qa || []),
    revenue: execution.revenue || activeDeal.revenue,
    topCompetitor: execution.topCompetitor || activeDeal.topCompetitor || story?.topCompetitor,
  };

  const displayTeam = (lockedPremium || !normalizedExecution.team?.length)
    ? [
      { name: "Sarah Jenkins", role: "Chief Executive Officer" },
      { name: "Dr. Alex Rivera", role: "Chief Technology Officer" },
      { name: "Michael Chen", role: "Head of Growth" },
    ]
    : normalizedExecution.team;

  const displayUseOfFunds = (lockedPremium || !normalizedExecution.useOfFunds?.length)
    ? [
      { category: "Product Development", percentage: 45 },
      { category: "Marketing & Scaling", percentage: 30 },
      { category: "Operations & Legal", percentage: 25 },
    ]
    : normalizedExecution.useOfFunds;

  const name = basicInfo.startupName || activeDeal.startupName || "The Startup";
  const tagline = basicInfo.tagline || activeDeal.tagline || "";
  const category = basicInfo.category || activeDeal.category || "General";
  const stage = basicInfo.stage || activeDeal.stage || "Seed";
  const location = basicInfo.location || activeDeal.location || "Global";
  const website = basicInfo.startupWebsite || activeDeal.startupWebsite;
  const logo = basicInfo.startupLogo || activeDeal.startupLogo;
  const whatsappNumber = activeDeal.whatsappNumber || basicInfo.whatsappNumber;
  const topCompetitor = normalizedExecution.topCompetitor || null;

  const raised = funding.raisedAmount ?? activeDeal.raisedAmount ?? 0;
  const goal = funding.goalAmount ?? activeDeal.goalAmount ?? 0;
  const deadline = funding.deadline ?? activeDeal.deadline;
  const statusMeta = getStatusMeta(activeDeal.status);
  const isVerified = activeDeal.verificationBadge?.isVerified || activeDeal.isVerified;

  const handleUpgrade = () => navigate("/dashboard/investor/subscription");
  const handleBack = onBack || (() => navigate(-1));

  const handleSubmitForReview = () => {
    submitDealMutation.mutate(activeDeal._id || activeDeal.id, {
      onSuccess: () => {
        toast.success("Success! Your deal has been submitted for admin review.", {
          description: "We will notify you once the review is complete and your deal goes live."
        });
        if (refetchDeal) refetchDeal();
        navigate("/dashboard/founder");
      },
      onError: (err) => {
        toast.error("Submission Failed", {
          description: err.message || "Failed to submit deal for review. Please try again."
        });
      }
    });
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 space-y-8 pb-20 animate-in fade-in duration-500">

      {/* ─── COMPACT HEADER (MOBILE OPTIMIZED) ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 bg-white/5 border border-white/10 p-5 md:p-8 rounded-3xl md:rounded-[2.5rem]">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-14 h-14 md:w-20 md:h-20 bg-black border border-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center p-3 md:p-4 shrink-0 overflow-hidden shadow-2xl">
            {logo ? <img src={logo} alt={name} className="w-full h-full object-contain" /> : <Rocket className="w-6 h-6 md:w-10 md:h-10 text-[#01F27B]" />}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-1 md:mb-2">
              <h1 className="text-xl md:text-4xl font-black text-white tracking-tighter truncate max-w-[150px] md:max-w-none">{name}</h1>
              <Badge className={cn("text-[9px] md:text-[10px] font-black uppercase px-2 md:px-3 py-0.5 md:py-1 rounded-full border", statusMeta.className)}>{statusMeta.label}</Badge>
            </div>
            {tagline && <p className="text-white/40 text-[10px] md:text-sm font-medium line-clamp-1">{tagline}</p>}
            <div className="flex flex-wrap items-center gap-3 mt-3 md:mt-4">
              {category && (
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl transition-all duration-300">
                  <span className="text-white/70 text-[11px] md:text-[13px] font-bold uppercase tracking-wider">{category}</span>
                </div>
              )}
              {stage && (
                <div className="flex items-center gap-2 bg-[#111] border border-[#222] hover:border-[#01F27B]/30 px-3.5 py-1.5 rounded-xl transition-all duration-300 group">
                  <div className="w-5 h-5 rounded-lg bg-[#01F27B]/10 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-[#01F27B] group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-white/70 text-[11px] md:text-[13px] font-bold uppercase tracking-wider">{stage}</span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-2 bg-[#111] border border-[#222] hover:border-[#01F27B]/30 px-3.5 py-1.5 rounded-xl transition-all duration-300 group">
                  <div className="w-5 h-5 rounded-lg bg-[#01F27B]/10 flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 text-[#01F27B] group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-white/70 text-[11px] md:text-[13px] font-bold uppercase tracking-wider">{location}</span>
                </div>
              )}
              {website && (
                <a
                  href={website.startsWith('http') ? website : `https://${website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-r from-[#01F27B]/20 to-[#01F27B]/5 border border-[#01F27B]/30 hover:border-[#01F27B] hover:shadow-[0_0_20px_rgba(1,242,123,0.25)] px-4 py-1.5 rounded-xl transition-all duration-300 group"
                >
                  <div className="w-5 h-5 rounded-lg bg-[#01F27B] flex items-center justify-center shadow-[0_0_10px_rgba(1,242,123,0.3)]">
                    <Globe className="w-3.5 h-3.5 text-black animate-pulse" />
                  </div>
                  <span className="text-[#01F27B] hover:text-[#00d66d] text-[12px] md:text-[14px] font-black uppercase tracking-widest flex items-center gap-1">
                    Website <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between md:justify-end gap-3 md:gap-6 mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
          <div className="text-left md:text-right">
            <p className="text-[8px] md:text-[11px] font-black text-white/30 uppercase tracking-[0.2em] mb-0 md:mb-1">Target Goal</p>
            <p className="text-md md:text-2xl font-black text-[#01F27B] md:text-white">{formatCurrency(goal)}</p>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" onClick={handleBack} className="bg-[#01F27B] hover:bg-[#00d66d] text-black font-black rounded-xl md:rounded-2xl h-10 md:h-12 px-4 md:px-10 shadow-xl shadow-[#01F27B]/20 transition-all text-xs md:text-base">
              <ArrowLeft className="w-4 h-4 md:mr-3" />
              <span className="md:inline">Back</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ─── NEW UNIFIED SECTIONS ─── */}
      <ProductStorySection story={story} />
      <MarketStrategySection
        story={story}
        execution={normalizedExecution}
        topCompetitor={topCompetitor}
        lockedPremium={lockedPremium}
        onUpgrade={handleUpgrade}
      />

      {/* ─── DASHBOARD GRID (UNIFIED HEIGHTS) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN: EXECUTION TEAM (4/12) */}
        <div className="lg:col-span-4 space-y-8">
          <DashCard title="Execution Team" icon={Briefcase} subtitle="Key Humans" locked={lockedPremium ? "pro" : null} onUpgrade={handleUpgrade} className="p-8 h-[590px] flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 mt-6">
              {displayTeam?.map((member, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#01F27B]/30 hover:bg-white/10 transition-all group/member">
                  <div className="w-12 h-12 rounded-xl bg-[#01F27B]/10 flex items-center justify-center text-[#01F27B] font-black text-lg border border-[#01F27B]/10 group-hover/member:bg-[#01F27B] group-hover/member:text-black transition-all">
                    {member.name?.charAt(0) || "F"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-md font-bold text-white truncate">{member.name}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{member.role || "Founder"}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashCard>
        </div>

        {/* MIDDLE COLUMN: THE TRACTION (4/12) */}
        <div className="lg:col-span-4 space-y-8">
          <DashCard title="Traction Intelligence" icon={TrendingUp} subtitle="Live Performance" locked={lockedPremium ? "pro" : null} onUpgrade={handleUpgrade} className="p-8 h-[590px] flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-4">
              <MiniStat label="Revenue" value={normalizedExecution.revenue ? formatCurrency(normalizedExecution.revenue) : "N/A"} icon={TrendingUp} locked={lockedPremium} onUpgrade={handleUpgrade} />
              <MiniStat label="Users" value={funding.users} icon={Users} locked={lockedPremium} onUpgrade={handleUpgrade} />
              <MiniStat label="Growth" value={funding.growthRate ? `${funding.growthRate}%` : "N/A"} icon={Zap} locked={lockedPremium} onUpgrade={handleUpgrade} />
              <MiniStat label="CAC" value={funding.CAC} icon={Target} locked={lockedPremium} onUpgrade={handleUpgrade} />
              <MiniStat label="LTV" value={funding.LTV} icon={Layers} locked={lockedPremium} onUpgrade={handleUpgrade} />
              <MiniStat label="Churn" value={funding.CHURN ? `${funding.CHURN}%` : "N/A"} icon={RefreshCw} locked={lockedPremium} onUpgrade={handleUpgrade} />
            </div>
            <div className="mt-6 p-6 rounded-3xl bg-black/40 border border-white/5 shadow-inner">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">Funding Velocity</span>
                <DaysLeftBadge deadline={deadline} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-black text-white">{formatCurrency(raised)}</span>
                  <span className="text-xs font-black text-[#01F27B] bg-[#01F27B]/10 px-2 py-0.5 rounded-md border border-[#01F27B]/20">{goal > 0 ? Math.min(100, Math.max(raised > 0 ? 1 : 0, Math.round((raised / goal) * 100))) : 0}%</span>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden mt-4">
                  <div
                    className="h-full bg-gradient-to-r from-[#01F27B] to-[#01F27B]/70 rounded-full transition-all duration-700"
                    style={{ width: `${goal > 0 ? Math.min(100, Math.max(raised > 0 ? 1 : 0, Math.round((raised / goal) * 100))) : 0}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-white/40 font-bold uppercase tracking-wider mt-2">
                  <span>Target {formatCurrency(goal)}</span>
                </div>
              </div>
            </div>
          </DashCard>


        </div>

        {/* RIGHT COLUMN: ASSETS & TEAM (4/12) */}
        <div className="lg:col-span-4 space-y-8">
          <DashCard title="The Vault" icon={Lock} subtitle="Data Room" locked={lockedSensitive ? "elite" : null} onUpgrade={handleUpgrade} className="p-8 h-[590px] flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 mt-6">
              {Object.entries(documents).filter(([_, val]) => hasValue(val)).map(([key, url]) => (
                <a key={key} href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#01F27B]/30 hover:bg-white/10 transition-all group/doc">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-white/20 group-hover/doc:text-[#01F27B] transition-colors shadow-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-white/70 truncate capitalize tracking-tight group-hover/doc:text-white transition-colors">{key.replace(/([A-Z])/g, ' $1')}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/10 group-hover/doc:text-[#01F27B] transition-all" />
                </a>
              ))}
            </div>
          </DashCard>





        </div>

      </div>

      {/* ─── SECONDARY GRID: USE OF CAPITAL & Q&A ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* USE OF CAPITAL (6/12) */}
        <div className={cn("flex flex-col", normalizedExecution.qa?.length > 0 ? "lg:col-span-6" : "lg:col-span-12")}>
          <DashCard title="Use of Capital" icon={PieChart} subtitle="Epic Allocation" locked={lockedPremium ? "pro" : null} onUpgrade={handleUpgrade} className="p-8 h-full">
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Min Investment</p>
                  <p className="text-md font-black text-white">{formatCurrency(funding?.minimumInvestment || activeDeal.minimumInvestment)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Stage</p>
                  <p className="text-md font-black text-white">{stage}</p>
                </div>
              </div>
              <div className="space-y-4 pt-2">
                {displayUseOfFunds?.map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-white/40">{item.category}</span>
                      <span className="text-[#01F27B]">{item.percentage}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#01F27B] to-[#00d66d]" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DashCard>
        </div>

        {/* Q&A INTEGRATION (6/12) */}
        {normalizedExecution.qa?.length > 0 && (
          <div className="lg:col-span-6 flex flex-col">
            <DashCard title="Founder Q&A" icon={MessageSquare} subtitle="Intelligence Stream" className="p-8 h-full">
              <Accordion type="single" collapsible className="w-full space-y-3 mt-4">
                {normalizedExecution.qa.map((item, i) => (
                  <AccordionItem key={i} value={`qd-${i}`} className="border-white/5 bg-white/[0.02] rounded-2xl overflow-hidden px-5 transition-all hover:bg-white/[0.04]">
                    <AccordionTrigger className="text-sm font-bold text-white hover:no-underline py-4 text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-white/50 leading-relaxed pb-4 italic border-t border-white/5 pt-3">
                      "{item.answer}"
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </DashCard>
          </div>
        )}
      </div>

      {/* ─── FOUNDER FOOTER ACTION (SUBMIT FOR REVIEW) ─── */}
      {isFounder && activeDeal.status === "complete" && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 p-10 bg-gradient-to-br from-blue-900/20 via-black to-blue-500/10 border border-blue-500/20 rounded-[3rem] text-center md:text-left shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="space-y-3 relative z-10">
            <h3 className="text-2xl font-black text-white tracking-tighter">Ready for Review</h3>
            <p className="text-md text-white/40 max-w-2xl leading-relaxed">
              Your deal profile is complete. Submit it now for admin review to get approved and go live to investors.
            </p>
          </div>
          <div className="flex shrink-0 relative z-10">
            <Button
              onClick={handleSubmitForReview}
              disabled={submitDealMutation.isPending}
              className="bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl px-12 h-14 shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
            >
              {submitDealMutation.isPending ? <Loader className="w-5 h-5 mr-2 animate-spin text-white" /> : <RefreshCw className="w-5 h-5 mr-2" />}
              Submit for Admin Review
            </Button>
          </div>
        </div>
      )}

      {/* ─── FOOTER CONTEXT (INVESTOR ONLY) ─── */}
      {!isFounder && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 p-10 bg-gradient-to-br from-black via-white/[0.04] to-black border border-white/10 rounded-[3rem] text-center md:text-left shadow-2xl relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <h3 className="text-2xl font-black text-white tracking-tighter">Conduit to the Founder</h3>
            <p className="text-md text-white/40 max-w-2xl leading-relaxed">
              Establish direct alignment with the founders. Initiate direct communication channels to discuss execution, request bespoke due diligence, or secure your allocation in this high-momentum round.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 relative z-10">
            {lockedSensitive ? (
              <Button
                onClick={handleUpgrade}
                className="bg-white/5 hover:bg-white/10 text-white rounded-2xl px-10 h-14 border border-white/10 font-bold transition-all flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)] group-hover:bg-amber-500/20 transition-all">
                  <Lock className="w-4 h-4 text-amber-500" />
                </div>
                Upgrade to Elite to Message Founder
              </Button>
            ) : (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-[1.2rem] shadow-inner">
                <Button
                  onClick={() => {
                    if (whatsappNumber) {
                      const cleanNumber = whatsappNumber.replace(/\D/g, '');
                      window.open(`https://wa.me/${cleanNumber}`, '_blank');
                    } else {
                      toast.error("No WhatsApp contact provided for this founder.");
                    }
                  }}
                  className="bg-[#25D366] hover:bg-[#1ebd5e] text-white rounded-[0.9rem] px-6 h-11 font-black transition-all flex items-center gap-2 shadow-lg shadow-[#25D366]/20 hover:scale-[1.02] active:scale-95"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </Button>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (whatsappNumber) {
                      window.location.href = `tel:${whatsappNumber.replace(/\D/g, '')}`;
                    } else {
                      toast.error("No phone number provided for this founder.");
                    }
                  }}
                  className="text-white/60 hover:text-white hover:bg-white/5 rounded-[0.9rem] px-4 h-11 font-bold flex items-center gap-2 group/call"
                >
                  <Phone className="w-4 h-4 text-[#01F27B] group-hover/call:scale-110 transition-transform" />
                  Call
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
