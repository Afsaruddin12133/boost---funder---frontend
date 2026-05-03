import { useAuth } from "@/features/auth/hooks/useAuth";
import { useInvestorVerificationStatus } from "@/features/verification/hooks/useInvestorVerification";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Loader } from "@/shared/ui/loader";
import {
  Bookmark,
  CheckCircle,
  Clock,
  Eye,
  Globe,
  Plus,
  Rocket,
  ShieldCheck,
  TrendingUp,
  User,
  Zap,
  Target,
  Search,
  ExternalLink,
  ChevronRight,
  PieChart
} from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  AreaChart,
  Area
} from "recharts";
import { useSavedDeals } from "@/features/deal/hooks/useSavedDeals";
import SettingsPage from "./SettingsPage";
import InvestorProfilePage from "@/features/profile/components/InvestorProfilePage";
import InvestorVerificationPage from "@/features/verification/components/InvestorVerificationPage";
import SavedDealsPage from "@/features/deal/components/SavedDealsPage";

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

// Mock Trending Deals
const trendingDeals = [
  { id: '1', name: "Lumina AI", category: "AI/ML", stage: "Seed", goal: "$1.5M", growth: "+125%" },
  { id: '2', name: "EcoGrid", category: "CleanTech", stage: "Series A", goal: "$4.2M", growth: "+85%" },
  { id: '3', name: "HealthPal", category: "HealthTech", stage: "Seed", goal: "$800K", growth: "+210%" },
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
    { title: "Market Exposure", value: "$4.2M", icon: PieChart, sub: "Portfolio Value", highlight: true },
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

function InvestorProfileCard({ user, onNavigate }) {
  const displayName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || "Elite Investor";
  const plan = user?.subscription?.plan || 'Free';
  const bio = user?.profile?.bio || "Active investor looking for high-growth tech startups. Portfolio focus: AI, SaaS, and Fintech.";

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-5 flex flex-col justify-between relative overflow-hidden group h-full">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#01F27B]/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div>
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="relative w-16 h-16 shrink-0">
            <div className="w-full h-full bg-black border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden shadow-xl">
              {user?.profile?.profileImage ? (
                <img src={user.profile.profileImage} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="text-[#01F27B] bg-[#01F27B]/5 w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-white italic tracking-tighter uppercase mb-1 truncate">{displayName}</h2>
            <Badge className="bg-[#01F27B]/10 text-[#01F27B] border border-[#01F27B]/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
              {plan} Partner
            </Badge>
          </div>
        </div>

        <p className="text-white/50 text-xs leading-relaxed line-clamp-3 mb-6 relative z-10 font-medium italic">
          "{bio}"
        </p>

        <div className="grid grid-cols-2 gap-2 mb-6 relative z-10">
          <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5">
            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Portfolio</p>
            <p className="text-sm font-black text-white">12 Deals</p>
          </div>
          <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5">
            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Focus</p>
            <p className="text-sm font-black text-[#01F27B]">Fintech</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 relative z-10">
        <Button 
          onClick={() => onNavigate('/dashboard/investor/deals')}
          className="flex-1 h-10 bg-[#01F27B] hover:bg-[#00d66d] text-black font-black text-xs rounded-xl shadow-[0_0_20px_rgba(1,242,123,0.2)]"
        >
          Explore Deals
        </Button>
        <Button 
          variant="outline"
          onClick={() => onNavigate('/dashboard/investor/profile')}
          className="flex-1 h-10 bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold text-xs rounded-xl"
        >
          Settings
        </Button>
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
          <p className="text-sm font-black text-[#01F27B]">$8.4B</p>
        </div>
      </div>
    </Card>
  );
}

function TrendingDealsSection({ onNavigate }) {
  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-5 relative overflow-hidden h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-white text-lg tracking-tighter uppercase italic">High Interest</h3>
        <Button variant="link" className="text-[#01F27B] text-[10px] font-black uppercase tracking-widest p-0 h-auto" onClick={() => onNavigate('/dashboard/investor/deals')}>
          View Market
        </Button>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {trendingDeals.map((deal) => (
          <div 
            key={deal.id} 
            onClick={() => onNavigate('deal-detail', deal.id)}
            className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#01F27B]/30 hover:bg-[#01F27B]/5 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center text-[#01F27B] group-hover:scale-110 transition-transform">
                <Rocket className="w-5 h-5" />
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
  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in duration-700">
      <OverviewCards verStatus={verStatus} user={user} onNavigate={onNavigate} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-6">
          <InvestorProfileCard user={user} onNavigate={onNavigate} />
          <MarketAnalytics />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
             <TrendingDealsSection onNavigate={onNavigate} />
             
             {/* Bookmarks Quick Access */}
             <Card 
               onClick={() => onNavigate('/dashboard/investor/bookmarks')}
               className="bg-white/5 backdrop-blur-xl border-white/10 p-5 flex flex-col relative overflow-hidden group cursor-pointer hover:border-amber-500/30 transition-all"
             >
               <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-black text-white text-lg tracking-tighter uppercase italic">Bookmarked</h3>
                 <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-black px-2 py-0.5 rounded-full">
                   {(Array.isArray(savedDealsData) ? savedDealsData.length : (savedDealsData?.deals?.length || 0))} SAVED
                 </Badge>
               </div>
               
               <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white/[0.02] border border-white/5 border-dashed rounded-3xl group-hover:bg-amber-500/[0.02] transition-all">
                 <Bookmark className="w-10 h-10 text-white/10 mb-4 group-hover:text-amber-500/20 transition-colors" />
                 <p className="text-xs text-white/40 font-medium leading-relaxed max-w-[160px]">
                   Quickly access deals you've saved for further review.
                 </p>
                 <Button variant="link" className="text-white/60 hover:text-amber-500 text-[10px] font-black uppercase tracking-widest mt-4">
                   Open Library
                 </Button>
               </div>
             </Card>
          </div>

          {/* Discovery Card */}
          <Card className="bg-gradient-to-r from-[#01F27B]/10 to-transparent border-[#01F27B]/20 p-8 relative overflow-hidden group cursor-pointer" onClick={() => onNavigate('/dashboard/investor/deals')}>
            <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-[#01F27B]/10 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-[#01F27B]" />
                  <span className="text-[10px] font-black text-[#01F27B] uppercase tracking-[0.3em]">Smart Match</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tighter uppercase italic">The Next Unicorn Awaits</h3>
                <p className="text-white/50 text-sm font-medium max-w-lg">
                  Our proprietary AI has identified 3 new deals matching your investment thesis. Access the private pitch decks now.
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-[#01F27B] flex items-center justify-center text-black shadow-[0_0_30px_rgba(1,242,123,0.4)] group-hover:scale-110 transition-transform duration-500">
                <ChevronRight className="w-8 h-8" strokeWidth={3} />
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
