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
   Zap
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

// ─── MINIMALIST MODULE COMPONENTS ────────────────────────────────────────────

function DashCard({ title, subtitle, icon: Icon, children, className, locked, onUpgrade }) {
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
        {locked && <Lock className="w-4 h-4 text-white/20" />}
      </div>

      <div className={cn("flex-1", locked && "blur-md select-none opacity-40")}>
        {children}
      </div>

      {locked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm p-6 text-center">
          <Button onClick={onUpgrade} size="sm" className="bg-[#01F27B] text-black font-black text-[10px] rounded-lg h-8 px-4">
            Unlock {title}
          </Button>
        </div>
      )}
    </Card>
  );
}

function MiniStat({ label, value, icon: Icon, sub, locked }) {
  if (!hasValue(value) && !locked) return null;
  return (
    <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3 group hover:border-[#01F27B]/30 transition-all">
      <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-white/30 group-hover:text-[#01F27B] transition-colors">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-tighter text-white/20 line-clamp-1">{label}</p>
        <p className={cn("text-sm font-black text-white truncate", locked && "blur-sm")}>
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

  const { basicInfo = {}, story = {}, funding = {}, execution = {}, documents = {} } = activeDeal;
  const name = basicInfo.startupName || activeDeal.startupName || "The Startup";
  const tagline = basicInfo.tagline || activeDeal.tagline || "";
  const category = basicInfo.category || activeDeal.category || "General";
  const stage = basicInfo.stage || activeDeal.stage || "Seed";
  const location = basicInfo.location || activeDeal.location || "Global";
  const website = basicInfo.startupWebsite || activeDeal.startupWebsite;
  const logo = basicInfo.startupLogo || activeDeal.startupLogo;
  const topCompetitor = activeDeal.topCompetitor || story?.topCompetitor;

  const raised = funding.raisedAmount ?? activeDeal.raisedAmount ?? 0;
  const goal = funding.goalAmount ?? activeDeal.goalAmount ?? 0;
  const deadline = funding.deadline ?? activeDeal.deadline;
  const statusMeta = getStatusMeta(activeDeal.status);
  const isVerified = activeDeal.verificationBadge?.isVerified || activeDeal.isVerified;

  const handleUpgrade = () => navigate("/subscription");
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
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 md:mt-3">
              {stage && (
                <Badge className="bg-white/5 border-white/10 text-white/60 text-[9px] px-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 text-[#01F27B]" />
                  {stage}
                </Badge>
              )}
              {location && (
                <Badge className="bg-white/5 border-white/10 text-white/60 text-[9px] px-2 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#01F27B]" />
                  {location}
                </Badge>
              )}
              {website && (
                 <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-bold text-[#01F27B] hover:text-[#00d66d] bg-[#01F27B]/10 px-3 py-0.5 rounded-full border border-[#01F27B]/20 transition-all">
                    <Globe className="w-3 h-3" /> Website
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

      {/* ─── DASHBOARD GRID (ORGANIC HEIGHTS) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: THE STORY (4/12) */}
        <div className="lg:col-span-4 space-y-8 h-fit">
          <DashCard title="The Vision" icon={Target} subtitle="North Star" className="p-8 h-fit">
             <p className="text-lg text-white/80 leading-relaxed font-medium italic">"{story.vision || "We are redefining the future of this industry through innovation and focus."}"</p>
          </DashCard>

          <DashCard title="Problem & Solution" icon={Zap} subtitle="Product Market Fit" className="p-8 h-fit">
             <div className="space-y-8">
               <div className="space-y-3">
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">The Challenge</h4>
                 </div>
                 <p className="text-[15px] text-white/70 leading-relaxed">{story.problem}</p>
               </div>
               <div className="w-full h-px bg-white/5" />
               <div className="space-y-3">
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#01F27B]" />
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">The Innovation</h4>
                 </div>
                 <p className="text-[15px] text-white/70 leading-relaxed">{story.solution}</p>
               </div>
             </div>
          </DashCard>

          <DashCard title="The Advantage" icon={ShieldCheck} subtitle="Defensibility" className="p-8 h-fit">
             <div className="space-y-6">
                <p className="text-[15px] text-white/70 leading-relaxed">{execution?.advantage || activeDeal.advantage}</p>
                {topCompetitor && (
                  <div className="pt-6 border-t border-white/5 space-y-3">
                     <h4 className="text-[10px] font-black uppercase text-white/20 tracking-widest">Top Competitor</h4>
                     <p className="text-[15px] text-white/70 leading-relaxed">{topCompetitor}</p>
                  </div>
                )}
             </div>
          </DashCard>
        </div>

        {/* MIDDLE COLUMN: THE TRACTION (4/12) */}
        <div className="lg:col-span-4 space-y-8 h-fit">
          <DashCard title="Traction Intelligence" icon={TrendingUp} subtitle="Live Performance" className="p-8 h-fit">
             <div className="grid grid-cols-2 gap-4">
                <MiniStat label="Revenue" value={execution.revenue ? formatCurrency(execution.revenue) : "N/A"} icon={TrendingUp} locked={lockedPremium} />
                <MiniStat label="Users" value={funding.users} icon={Users} locked={lockedPremium} />
                <MiniStat label="Growth" value={funding.growthRate ? `${funding.growthRate}%` : "N/A"} icon={Zap} locked={lockedPremium} />
                <MiniStat label="CAC" value={funding.CAC} icon={Target} locked={lockedPremium} />
                <MiniStat label="LTV" value={funding.LTV} icon={Layers} locked={lockedPremium} />
                <MiniStat label="Churn" value={funding.CHURN ? `${funding.CHURN}%` : "N/A"} icon={RefreshCw} locked={lockedPremium} />
             </div>
             <div className="mt-8 p-6 rounded-3xl bg-black/40 border border-white/5 shadow-inner">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">Funding Velocity</span>
                  <DaysLeftBadge deadline={deadline} />
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <span className="text-2xl font-black text-white">{formatCurrency(raised)}</span>
                      <span className="text-xs font-black text-[#01F27B] bg-[#01F27B]/10 px-2 py-0.5 rounded-md border border-[#01F27B]/20">{Math.round((raised/goal)*100)}%</span>
                   </div>
                   <ProgressBar raised={raised} goal={goal} className="h-2.5 rounded-full" />
                </div>
             </div>
          </DashCard>

          <DashCard title="Market & Timing" icon={Globe} subtitle="Opportunity" className="p-8 h-fit">
             <div className="space-y-6">
                <div className="space-y-3">
                   <h4 className="text-[10px] font-black uppercase text-white/20 tracking-widest">Target Market</h4>
                   <p className="text-md text-white/80 italic font-medium leading-relaxed">"{story.targetMarket}"</p>
                </div>
                <div className="pt-6 border-t border-white/5 space-y-3">
                   <h4 className="text-[10px] font-black uppercase text-white/20 tracking-widest">Why Now?</h4>
                   <p className="text-[15px] text-white/70 leading-relaxed">{story.whyNow}</p>
                </div>
             </div>
          </DashCard>

          {/* DESKTOP Q&A INTEGRATION (All items here for desktop) */}
          {activeDeal.execution?.qa?.length > 0 && (
            <div className="hidden lg:block space-y-4 pt-4">
              <h4 className="text-[10px] font-black uppercase text-[#01F27B] tracking-[0.3em] mb-4">Founder Intelligence Q&A</h4>
              <Accordion type="single" collapsible className="w-full space-y-3">
                {activeDeal.execution.qa.map((item, i) => (
                  <AccordionItem key={i} value={`qd-${i}`} className="border-white/5 bg-white/[0.02] rounded-2xl overflow-hidden px-5 transition-all hover:bg-white/[0.04]">
                    <AccordionTrigger className="text-sm font-bold text-white hover:no-underline py-4">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-white/50 leading-relaxed pb-4 italic border-t border-white/5 pt-3">
                      "{item.answer}"
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ASSETS & TEAM (4/12) */}
        <div className="lg:col-span-4 space-y-8 h-fit">
          <DashCard title="The Vault" icon={Lock} subtitle="Data Room" locked={lockedSensitive} onUpgrade={handleUpgrade} className="p-8 h-fit">
             <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
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

          <DashCard title="Epic Playbook" icon={Layers} subtitle="Strategy" className="p-8 h-fit">
             <div className="space-y-6">
                <div className="space-y-2">
                   <h4 className="text-[10px] font-black uppercase text-[#01F27B] tracking-widest">Business Model</h4>
                   <p className="text-sm text-white/70 leading-relaxed italic">"{execution.businessModel || "How we generate value and sustainable revenue."}"</p>
                </div>
                <div className="w-full h-px bg-white/5" />
                <div className="space-y-2">
                   <h4 className="text-[10px] font-black uppercase text-[#01F27B] tracking-widest">Go-to-Market</h4>
                   <p className="text-sm text-white/70 leading-relaxed">{execution.goToMarket}</p>
                </div>
             </div>
          </DashCard>

          <DashCard title="Execution Team" icon={Briefcase} subtitle="Key Humans" className="p-8 h-fit">
             <div className="space-y-4">
                {execution.team?.map((member, i) => (
                   <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-[#01F27B]/10 flex items-center justify-center text-[#01F27B] font-black text-lg border border-[#01F27B]/10 group-hover:bg-[#01F27B] group-hover:text-black transition-all">
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

          <DashCard title="Use of Capital" icon={PieChart} subtitle="Epic Allocation" className="p-8 h-fit">
             <div className="space-y-6">
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
                   {execution.useOfFunds?.map((item, i) => (
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

          {/* MOBILE Q&A INTEGRATION (Appears last in mobile flow) */}
          {activeDeal.execution?.qa?.length > 0 && (
            <div className="block lg:hidden space-y-4 pt-8 border-t border-white/5">
              <h4 className="text-[10px] font-black uppercase text-[#01F27B] tracking-[0.3em] mb-4 text-center">Founder Intelligence Q&A</h4>
              <Accordion type="single" collapsible className="w-full space-y-3">
                {activeDeal.execution.qa.map((item, i) => (
                  <AccordionItem key={i} value={`qm-${i}`} className="border-white/5 bg-white/[0.02] rounded-2xl overflow-hidden px-5 transition-all hover:bg-white/[0.04]">
                    <AccordionTrigger className="text-sm font-bold text-white hover:no-underline py-4 text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-white/50 leading-relaxed pb-4 italic border-t border-white/5 pt-3">
                      "{item.answer}"
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>

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
             <h3 className="text-2xl font-black text-white tracking-tighter">Due Diligence & Participation</h3>
             <p className="text-md text-white/40 max-w-2xl leading-relaxed">
               Request access to the full data room for a deep dive into the business model, financials, and verified traction metrics.
             </p>
           </div>
           <div className="flex flex-col sm:flex-row gap-4 shrink-0 relative z-10">
              <Button className="bg-white/5 hover:bg-white/10 text-white rounded-2xl px-10 h-14 border border-white/10 font-bold transition-all">Message Founders</Button>
              <Button className="bg-[#01F27B] hover:bg-[#00d66d] text-black font-black rounded-2xl px-12 h-14 shadow-lg shadow-[#01F27B]/20 transition-all">Participate in Round</Button>
           </div>
        </div>
      )}

    </div>
  );
}
