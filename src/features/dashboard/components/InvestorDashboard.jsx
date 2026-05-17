import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDealFeed } from "@/features/deal/hooks/useDealFeed";
import { useSavedDeals } from "@/features/deal/hooks/useSavedDeals";
import { formatCurrency } from "@/features/deal/utils/dealUtils";
import InvestorProfilePage from "@/features/profile/components/InvestorProfilePage";
import InvestorVerificationPage from "@/features/verification/components/InvestorVerificationPage";
import { useInvestorVerificationStatus } from "@/features/verification/hooks/useInvestorVerification";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import {
  Bookmark,
  CheckCircle,
  ChevronRight,
  Globe,
  Linkedin,
  MapPin,
  PieChart,
  Rocket,
  Search,
  ShieldCheck,
  TrendingUp,
  Twitter,
  User,
  Zap
} from "lucide-react";
import { useMemo } from "react";
import { Navigate, Route, Routes } from "react-router";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis
} from "recharts";
import SettingsPage from "./SettingsPage";

// Mock Data for Analytics
const marketPulseData = [
  { name: "MON", value: 30 },
  { name: "TUE", value: 45 },
  { name: "WED", value: 35 },
  { name: "THU", value: 65 },
  { name: "FRI", value: 50 },
  { name: "SAT", value: 40 },
  { name: "SUN", value: 55 },
];

function OverviewCards({ verStatus, user, onNavigate }) {
  const statusString = (
    (typeof verStatus === 'string' ? verStatus : verStatus?.status) || 
    verStatus?.verification?.status ||
    ""
  ).toLowerCase();

  const isVerified = user?.isVerified === true || statusString === "approved";
  const isPending = statusString === "pending";
  
  const cards = [
    { title: "Market Exposure", value: "AED 4.2M", icon: PieChart, sub: "Portfolio Value", highlight: true },
    { title: "Deals Explored", value: "84", icon: Search, sub: "Market Pulse", active: true },
    { title: "Opportunities", value: "12", icon: Zap, sub: "New Matches", alert: true },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {cards.map((card, idx) => (
        <Card key={idx} className="bg-white/5 backdrop-blur-xl border-white/10 p-4 relative overflow-hidden group transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#01F27B]/5 rounded-full blur-xl -mr-4 -mt-4" />
          <div className="flex justify-between items-center mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${card.active ? 'bg-[#01F27B]/10 border-[#01F27B]/20 shadow-[0_0_15px_rgba(1,242,123,0.1)]' : 'bg-white/5 border-white/10'}`}>
              <card.icon className={`w-5 h-5 ${card.active ? 'text-[#01F27B]' : 'text-white/60'}`} />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${card.highlight ? 'text-[#01F27B]' : card.alert ? 'text-amber-500' : 'text-white/30'}`}>{card.sub}</span>
          </div>
          <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-0.5">{card.title}</p>
          <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tighter leading-none italic uppercase">{card.value}</h3>
        </Card>
      ))}

      <Card 
        onClick={() => onNavigate('/dashboard/investor/verification')}
        className="bg-white/5 backdrop-blur-xl border-white/10 p-4 relative overflow-hidden group transition-all duration-300 cursor-pointer hover:border-[#01F27B]/30"
      >
        <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-xl -mr-4 -mt-4 transition-colors ${isVerified ? 'bg-[#01F27B]/20' : isPending ? 'bg-amber-500/10' : 'bg-white/5'}`} />
        <div className="flex justify-between items-center mb-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${isVerified ? 'bg-[#01F27B]/10 border-[#01F27B]/20 scale-110 shadow-[0_0_15px_rgba(1,242,123,0.2)]' : isPending ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/5 border-white/10'}`}>
            {isVerified ? <CheckCircle className="w-5 h-5 text-[#01F27B]" /> : <ShieldCheck className={`w-5 h-5 ${isPending ? 'text-amber-500' : 'text-white/40'}`} />}
          </div>
          <span className={`text-[9px] font-black uppercase tracking-widest ${isVerified ? 'text-[#01F27B]' : isPending ? 'text-amber-500' : 'text-white/30'}`}>
            {isVerified ? 'VERIFIED' : isPending ? 'PENDING' : 'UNVERIFIED'}
          </span>
        </div>
        <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-0.5">Investor Status</p>
        <div className="flex items-center gap-1.5">
          <h3 className={`text-xl lg:text-2xl font-black tracking-tighter leading-none italic uppercase ${
            isVerified ? "text-white" : isPending ? "text-amber-500" : "text-white/40"
          }`}>
            {isVerified ? "Elite Access" : isPending ? "Reviewing" : "Level 0"}
          </h3>
          {isVerified && <Zap className="w-4 h-4 text-[#01F27B] animate-pulse" />}
        </div>
      </Card>
    </div>
  );
}

function InvestorProfileCard({ user, onNavigate, savedDealsData }) {
  const displayName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || "Elite Investor";
  const plan = user?.subscription?.plan || 'Free';
  const bio = user?.profile?.bio || "Active investor looking for high-growth tech startups. Portfolio focus: AI, SaaS, and Fintech.";
  const location = user?.profile?.location || "Global Capital";
  const isVerified = user?.isVerified === true;

  const portfolioCount = useMemo(() => {
    if (!savedDealsData) return 0;
    const list = Array.isArray(savedDealsData) ? savedDealsData : (savedDealsData.bookmarks || savedDealsData.deals || []);
    return list.length;
  }, [savedDealsData]);

  const focusSector = useMemo(() => {
    const sectors = user?.profile?.investmentPreferences?.sectors;
    if (Array.isArray(sectors) && sectors.length > 0) {
      return sectors[0];
    }
    return "Global Tech";
  }, [user]);

  // Format capital range nicely
  const minInv = user?.profile?.investmentPreferences?.minInvestment;
  const maxInv = user?.profile?.investmentPreferences?.maxInvestment;
  const capitalRange = useMemo(() => {
    if (minInv !== undefined && maxInv !== undefined && minInv !== "" && maxInv !== "") {
      const formatShort = (val) => {
        const num = Number(val);
        if (isNaN(num)) return "0";
        if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
        return num.toString();
      };
      return `AED ${formatShort(minInv)} - ${formatShort(maxInv)}`;
    }
    return "AED 10K - 100K"; // fallback
  }, [minInv, maxInv]);

  const socialLinks = user?.profile?.socialLinks || {};
  const website = user?.profile?.website;

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-5 flex flex-col justify-between relative overflow-hidden group h-full min-h-[425px]">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#01F27B]/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div>
        <div className="flex items-center gap-4 mb-5 relative z-10">
          <div className="relative w-16 h-16 shrink-0">
            <div className="w-full h-full bg-black border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden shadow-xl relative group">
              {user?.profile?.profileImage ? (
                <img src={user.profile.profileImage} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="text-[#01F27B] bg-[#01F27B]/5 w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
              )}
            </div>
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#01F27B] border-2 border-black rounded-lg flex items-center justify-center shadow-lg">
                <CheckCircle className="w-3.5 h-3.5 text-black" strokeWidth={3} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-white italic tracking-tighter uppercase mb-1 truncate">{displayName}</h2>
            <Badge className="bg-[#01F27B]/10 text-[#01F27B] border border-[#01F27B]/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
              {plan} Partner
            </Badge>
          </div>
        </div>
 
        <p className="text-white/50 text-xs leading-relaxed line-clamp-2 mb-5 relative z-10 font-medium italic">
          "{bio}"
        </p>

        {/* 2x2 Premium Dynamic Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 relative z-10">
          <div className="bg-white/[0.02] hover:bg-white/[0.05] p-3 rounded-2xl border border-white/5 transition-all">
            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Portfolio</p>
            <p className="text-sm font-black text-white">{portfolioCount} {portfolioCount === 1 ? 'Deal' : 'Deals'}</p>
          </div>
          <div className="bg-white/[0.02] hover:bg-white/[0.05] p-3 rounded-2xl border border-white/5 transition-all">
            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Focus</p>
            <p className="text-sm font-black text-[#01F27B] truncate">{focusSector}</p>
          </div>
          <div className="bg-white/[0.02] hover:bg-white/[0.05] p-3 rounded-2xl border border-white/5 transition-all">
            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Capital Power</p>
            <p className="text-sm font-black text-white truncate">{capitalRange}</p>
          </div>
          <div className="bg-white/[0.02] hover:bg-white/[0.05] p-3 rounded-2xl border border-white/5 transition-all">
            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Hub</p>
            <p className="text-sm font-bold text-white/70 truncate flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#01F27B]/60 shrink-0" />
              {location}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 relative z-10 pt-3 border-t border-white/5 mt-auto">
        <Button 
          onClick={() => onNavigate('/dashboard/investor/deals')}
          className="flex-1 h-11 bg-[#01F27B] hover:bg-[#00d66d] text-black font-black text-xs rounded-xl shadow-[0_0_20px_rgba(1,242,123,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Explore Deals
        </Button>
        
        {/* Sleek Social Quick Dock & Action */}
        <div className="flex items-center gap-2">
          {socialLinks.linkedin && (
            <a 
              href={socialLinks.linkedin} 
              target="_blank" 
              rel="noreferrer" 
              className="w-10 h-10 bg-white/5 hover:bg-[#01F27B]/10 border border-white/10 hover:border-[#01F27B]/30 rounded-xl flex items-center justify-center text-white/40 hover:text-[#01F27B] transition-all"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {socialLinks.twitter && (
            <a 
              href={socialLinks.twitter} 
              target="_blank" 
              rel="noreferrer" 
              className="w-10 h-10 bg-white/5 hover:bg-[#01F27B]/10 border border-white/10 hover:border-[#01F27B]/30 rounded-xl flex items-center justify-center text-white/40 hover:text-[#01F27B] transition-all"
              title="Twitter Profile"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
          {website && (
            <a 
              href={website} 
              target="_blank" 
              rel="noreferrer" 
              className="w-10 h-10 bg-white/5 hover:bg-[#01F27B]/10 border border-white/10 hover:border-[#01F27B]/30 rounded-xl flex items-center justify-center text-white/40 hover:text-[#01F27B] transition-all"
              title="Website"
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
          
          <Button 
            variant="outline"
            onClick={() => onNavigate('/dashboard/investor/profile')}
            className="w-10 h-10 bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl p-0 flex items-center justify-center"
            title="Account Settings"
          >
            <User className="w-4 h-4 text-white/60" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function MarketAnalytics() {
  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-5 relative overflow-hidden group h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-black text-white text-lg tracking-tighter uppercase italic">Market Pulse</h3>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Global Startup Volume</p>
        </div>
        <TrendingUp className="w-5 h-5 text-[#01F27B] opacity-50" />
      </div>
      
      <div className="h-40 w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={marketPulseData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#01F27B" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#01F27B" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />
            <Tooltip 
              contentStyle={{backgroundColor: '#0c0c0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'}}
              itemStyle={{color: '#01F27B', fontWeight: 'bold'}}
            />
            <Area type="monotone" dataKey="value" stroke="#01F27B" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
        <div>
          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-0.5">Hot Sector</p>
          <p className="text-sm font-black text-white uppercase italic">SaaS / B2B</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-0.5">Active Capital</p>
          <p className="text-sm font-black text-[#01F27B]">AED 8.4B</p>
        </div>
      </div>
    </Card>
  );
}

function TrendingDealsSection({ onNavigate }) {
  const { data: deals, isLoading } = useDealFeed();

  // Parse up to 3 active deals dynamically, falling back to clean mock items if none are loaded
  const displayDeals = useMemo(() => {
    if (isLoading || !deals || deals.length === 0) {
      return [
        { id: '1', name: "Lumina AI", category: "AI/ML", stage: "Seed", goal: "AED 1.5M", growth: "+125%", logo: null },
        { id: '2', name: "EcoGrid", category: "CleanTech", stage: "Series A", goal: "AED 4.2M", growth: "+85%", logo: null },
        { id: '3', name: "HealthPal", category: "HealthTech", stage: "Seed", goal: "AED 800K", growth: "+210%", logo: null },
      ];
    }
    
    return deals.slice(0, 3).map(deal => {
      const stage = deal.stage || deal.basicInfo?.stage || "Seed";
      const category = deal.category || deal.basicInfo?.category || "TECH";
      const startupName = deal.startupName || deal.basicInfo?.startupName || "Untitled Startup";
      const startupLogo = deal.startupLogo || deal.basicInfo?.startupLogo;
      
      const goalAmount = deal.goalAmount || deal.funding?.goalAmount || deal.fundingInfo?.goalAmount || deal.fundingGoal || 0;
      const formattedGoal = formatCurrency(goalAmount);
      
      const growthRate = deal.growthRate || deal.funding?.growthRate || 85;
      
      return {
        id: deal._id || deal.id,
        name: startupName,
        category,
        stage,
        goal: formattedGoal,
        growth: `+${growthRate}%`,
        logo: startupLogo
      };
    });
  }, [deals, isLoading]);

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-5 relative overflow-hidden h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-white text-lg tracking-tighter uppercase italic">High Interest</h3>
        <Button variant="link" className="text-[#01F27B] text-[10px] font-black uppercase tracking-widest p-0 h-auto" onClick={() => onNavigate('/dashboard/investor/deals')}>
          View Market
        </Button>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {displayDeals.map((deal) => (
          <div 
            key={deal.id} 
            onClick={() => onNavigate('deal-detail', deal.id)}
            className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#01F27B]/30 hover:bg-[#01F27B]/5 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center text-[#01F27B] group-hover:scale-110 transition-transform overflow-hidden">
                {deal.logo ? (
                  <img src={deal.logo} alt={deal.name} className="w-full h-full object-cover" />
                ) : (
                  <Rocket className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">{deal.name}</h4>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{deal.category} • {deal.stage}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-[#01F27B] italic">{deal.growth}</p>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">{deal.goal}</p>
            </div>
          </div>
        ))}
      </div>

      <Button 
        variant="outline" 
        className="w-full mt-6 bg-white/5 border-white/10 hover:bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] h-10 rounded-xl"
        onClick={() => onNavigate('/dashboard/investor/deals')}
      >
        Access Full Deal Flow
        <ChevronRight className="w-3.5 h-3.5 ml-1" />
      </Button>
    </Card>
  );
}

function MainDashboard({ verStatus, user, onNavigate, savedDealsData }) {
  // Parse all bookmarked deals dynamically
  const bookmarkedDeals = useMemo(() => {
    if (!savedDealsData) return [];
    
    let rawList = [];
    if (Array.isArray(savedDealsData)) {
      rawList = savedDealsData;
    } else if (savedDealsData.bookmarks && Array.isArray(savedDealsData.bookmarks)) {
      rawList = savedDealsData.bookmarks.map(b => ({
        ...(b.dealId || {}),
        _bookmarkId: b._id,
        isSaved: true
      })).filter(d => d._id || d.id);
    } else if (savedDealsData.deals && Array.isArray(savedDealsData.deals)) {
      rawList = savedDealsData.deals;
    }

    return rawList.slice(0, 3).map(deal => {
      const stage = deal.stage || deal.basicInfo?.stage || "Seed";
      const category = deal.category || deal.basicInfo?.category || "TECH";
      const startupName = deal.startupName || deal.basicInfo?.startupName || "Untitled Startup";
      const startupLogo = deal.startupLogo || deal.basicInfo?.startupLogo;
      
      const goalAmount = deal.goalAmount || deal.funding?.goalAmount || deal.fundingInfo?.goalAmount || deal.fundingGoal || 0;
      const formattedGoal = formatCurrency(goalAmount);
      
      const growthRate = deal.growthRate || deal.funding?.growthRate || 85;
      
      return {
        id: deal._id || deal.id,
        name: startupName,
        category,
        stage,
        goal: formattedGoal,
        growth: `+${growthRate}%`,
        logo: startupLogo
      };
    });
  }, [savedDealsData]);

  const totalSavedCount = useMemo(() => {
    if (!savedDealsData) return 0;
    const list = Array.isArray(savedDealsData) ? savedDealsData : (savedDealsData.bookmarks || savedDealsData.deals || []);
    return list.length;
  }, [savedDealsData]);

  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in duration-700">
      <OverviewCards verStatus={verStatus} user={user} onNavigate={onNavigate} />

      {/* Row 1: Symmetrical Top Row (Profile + Trending/Bookmarked Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <InvestorProfileCard user={user} onNavigate={onNavigate} savedDealsData={savedDealsData} />
        </div>

        {/* Right Column - Trending & Bookmarked Cards */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-stretch min-h-[400px]">
             <TrendingDealsSection onNavigate={onNavigate} />
             
             {/* Bookmarks Quick Access */}
             <Card 
               onClick={() => onNavigate('/dashboard/investor/bookmarks')}
               className="bg-white/5 backdrop-blur-xl border-white/10 p-5 flex flex-col relative overflow-hidden group cursor-pointer hover:border-amber-500/40 transition-all h-full"
             >
               <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all pointer-events-none" />
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-black text-white text-lg tracking-tighter uppercase italic">Bookmarked</h3>
                 <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-black px-2 py-0.5 rounded-full">
                   {totalSavedCount} SAVED
                 </Badge>
               </div>
               
               {bookmarkedDeals.length === 0 ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white/[0.02] border border-white/5 border-dashed rounded-3xl group-hover:bg-amber-500/[0.02] transition-all">
                   <Bookmark className="w-10 h-10 text-white/10 mb-4 group-hover:text-amber-500/20 transition-colors" />
                   <p className="text-xs text-white/40 font-medium leading-relaxed max-w-[160px]">
                     Quickly access deals you've saved for further review.
                   </p>
                   <Button variant="link" className="text-white/60 hover:text-amber-500 text-[10px] font-black uppercase tracking-widest mt-4">
                     Open Library
                   </Button>
                 </div>
               ) : (
                 <div className="flex flex-col justify-between flex-1">
                   <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                     {bookmarkedDeals.map((deal) => (
                       <div 
                         key={deal.id} 
                         onClick={(e) => {
                           e.stopPropagation();
                           onNavigate('deal-detail', deal.id);
                         }}
                         className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all cursor-pointer group/item"
                       >
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center text-amber-500 group-hover/item:scale-110 transition-transform overflow-hidden">
                             {deal.logo ? (
                               <img src={deal.logo} alt={deal.name} className="w-full h-full object-cover" />
                             ) : (
                               <Bookmark className="w-5 h-5" />
                             )}
                           </div>
                           <div>
                             <h4 className="text-sm font-bold text-white mb-0.5">{deal.name}</h4>
                             <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{deal.category} • {deal.stage}</p>
                           </div>
                         </div>
                         <div className="text-right">
                           <p className="text-xs font-black text-amber-500 italic">{deal.growth}</p>
                           <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">{deal.goal}</p>
                         </div>
                       </div>
                     ))}
                   </div>

                   <Button 
                     variant="outline" 
                     className="w-full mt-6 bg-white/5 border-white/10 hover:bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] h-10 rounded-xl hover:border-amber-500/30"
                     onClick={() => onNavigate('/dashboard/investor/bookmarks')}
                   >
                     Open Library
                     <ChevronRight className="w-3.5 h-3.5 ml-1" />
                   </Button>
                 </div>
               )}
             </Card>
          </div>
        </div>
      </div>

      {/* Row 2: Symmetrical Bottom Row (Market Pulse + Smart Match side-by-side with matched heights) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column - Market Pulse */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <MarketAnalytics />
        </div>

        {/* Right Column - Smart Match with matched height & AI Hologram Radar */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <Card 
            className="w-full h-full bg-gradient-to-br from-[#01F27B]/10 via-white/[0.01] to-transparent border-[#01F27B]/20 p-6 relative overflow-hidden group cursor-pointer hover:border-[#01F27B]/40 transition-all flex flex-col justify-between"
            onClick={() => onNavigate('/dashboard/investor/deals')}
          >
            {/* Holographic glowing radar background */}
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 bg-[#01F27B]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#01F27B]/10 group-hover:scale-110 transition-all duration-700" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-6 h-full items-stretch justify-between">
              
              {/* Left Side: Info */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-[#01F27B]/10 flex items-center justify-center border border-[#01F27B]/20">
                      <Zap className="w-3.5 h-3.5 text-[#01F27B]" />
                    </div>
                    <span className="text-[10px] font-black text-[#01F27B] uppercase tracking-[0.25em]">Smart Match</span>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-black text-white tracking-tighter uppercase italic mb-2 leading-none">
                    The Next Unicorn Awaits
                  </h3>
                  <p className="text-white/50 text-xs font-medium max-w-sm leading-relaxed">
                    Our proprietary AI has identified 3 premium deals matching your investment thesis. Access the private pitch decks now.
                  </p>
                </div>
                
                <Button 
                  className="mt-6 md:mt-0 w-fit h-9 bg-[#01F27B] hover:bg-[#00d66d] text-black font-black text-xs px-5 rounded-xl shadow-[0_0_20px_rgba(1,242,123,0.25)] flex items-center gap-2"
                >
                  View Matches
                  <ChevronRight className="w-4 h-4" strokeWidth={3} />
                </Button>
              </div>

              {/* Right Side: Creative Match Hologram Radar */}
              <div className="flex items-center justify-center shrink-0 min-h-[140px] md:min-h-0 relative px-4">
                {/* Symmetrical holographic radar rings */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-[#01F27B]/10 animate-[spin_12s_linear_infinite]" />
                  <div className="absolute inset-2 rounded-full border border-dashed border-[#01F27B]/20 animate-[spin_8s_linear_infinite_reverse]" />
                  <div className="absolute inset-6 rounded-full border border-[#01F27B]/5" />
                  
                  {/* Central glowing pulse */}
                  <div className="w-12 h-12 rounded-full bg-[#01F27B]/10 border border-[#01F27B]/30 flex items-center justify-center relative shadow-[0_0_25px_rgba(1,242,123,0.15)]">
                    <span className="text-xs font-black text-[#01F27B] italic">AI</span>
                    <span className="absolute inset-0 rounded-full bg-[#01F27B]/10 animate-ping opacity-60" />
                  </div>

                  {/* Pulsing Match Orbits (98%, 95%, 92%) */}
                  <div className="absolute -top-1 -right-1 w-9 h-9 rounded-full bg-black/60 border border-[#01F27B]/40 flex flex-col items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                    <span className="text-[8px] font-black text-[#01F27B] leading-none">98%</span>
                    <span className="text-[5px] text-white/30 uppercase font-bold tracking-widest leading-none">Match</span>
                  </div>

                  <div className="absolute -bottom-1 -left-2 w-8 h-8 rounded-full bg-black/60 border border-[#01F27B]/20 flex flex-col items-center justify-center shadow-lg transition-transform group-hover:scale-110 delay-100">
                    <span className="text-[7.5px] font-black text-white leading-none">95%</span>
                    <span className="text-[5px] text-white/30 uppercase font-bold tracking-widest leading-none">Match</span>
                  </div>

                  <div className="absolute top-10 -left-4 w-7 h-7 rounded-full bg-black/60 border border-white/10 flex flex-col items-center justify-center shadow-lg transition-transform group-hover:scale-110 delay-200">
                    <span className="text-[7px] font-black text-white/60 leading-none">92%</span>
                  </div>
                </div>
              </div>

            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function InvestorDashboard({ onNavigate }) {
  const { user } = useAuth();
  const { data: verStatus } = useInvestorVerificationStatus();
  const { data: savedDealsData } = useSavedDeals(!!user);

  return (
    <Routes>
      <Route path="/" element={<MainDashboard verStatus={verStatus} user={user} onNavigate={onNavigate} savedDealsData={savedDealsData} />} />
      <Route path="profile" element={<InvestorProfilePage />} />
      <Route path="verification" element={<InvestorVerificationPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
}
