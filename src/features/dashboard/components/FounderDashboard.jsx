import { useAuth } from "@/features/auth/hooks/useAuth";
import { CreateDealForm, DealList } from "@/features/deal";
import DealDetailPage from "@/features/deal/components/DealDetailPage";
import { useMyDeals } from "@/features/deal/hooks";
import FounderProfilePage from "@/features/profile/components/FounderProfilePage";
import FounderVerificationPage from "@/features/verification/components/FounderVerificationPage";
import { useVerificationStatus } from "@/features/verification/hooks/useVerification";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import {
  CheckCircle, Clock,
  CreditCard,
  Eye,
  FileText,
  Plus,
  Rocket,
  ShieldCheck,
  TrendingUp,
  User,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useSearchParams } from "react-router";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis
} from "recharts";
import SettingsPage from "./SettingsPage";

// Mock Data
const analyticsData = [
  { name: "MON", views: 120, peak: 150 },
  { name: "TUE", views: 180, peak: 190 },
  { name: "WED", views: 150, peak: 160 },
  { name: "THU", views: 245, peak: 250 },
  { name: "FRI", views: 200, peak: 210 },
  { name: "SAT", views: 170, peak: 180 },
  { name: "SUN", views: 190, peak: 200 },
];

function OverviewCards({ verStatus, user, onNavigate }) {
  const { data: deals = [] } = useMyDeals();
  const statusString = (
    (typeof verStatus === 'string' ? verStatus : verStatus?.status) || 
    verStatus?.verification?.status ||
    (typeof verStatus?.data === 'string' ? verStatus?.data : verStatus?.data?.status) ||
    ""
  ).toLowerCase();

  const isVerified = user?.isVerified === true || statusString === "approved" || statusString === "verified" || statusString === "success";
  const isRecentlySubmitted = user?.id && localStorage.getItem(`verification_submitted_${user.id}`) === "true";
  const isPending = statusString === "pending" || (isRecentlySubmitted && !statusString);
  
  // Clean up flag if real status is found
  useEffect(() => {
    if (user?.id && verStatus?.status && localStorage.getItem(`verification_submitted_${user.id}`) === "true") {
      localStorage.removeItem(`verification_submitted_${user.id}`);
    }
  }, [verStatus?.status, user?.id]);

  const totalDeals = deals.length;
  const activeDeals = deals.filter(d => d.status === 'published' || d.status === 'active' || d.profileCompletionScore === 100).length;
  
  const cards = [
    { title: "Total Deals", value: totalDeals, icon: FileText, sub: "Total Portfolio" },
    { title: "Active Deals", value: activeDeals, icon: TrendingUp, sub: "Active Market", active: true },
    { title: "Profile Views", value: "1.2k", icon: Eye, sub: "Growth +12%", highlight: true },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, idx) => (
        <Card key={idx} className="bg-white/5 backdrop-blur-xl border-white/10 p-4 relative overflow-hidden group transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#01F27B]/5 rounded-full blur-xl -mr-4 -mt-4" />
          <div className="flex justify-between items-center mb-2">
            <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center border ${card.active ? 'bg-[#01F27B]/10 border-[#01F27B]/20' : 'bg-white/5 border-white/10'}`}>
              <card.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${card.active ? 'text-[#01F27B]' : 'text-white/60'}`} />
            </div>
            <span className={`text-[9px] lg:text-[10px] font-black uppercase tracking-[0.15em] ${card.highlight ? 'text-[#01F27B]' : 'text-white/30'}`}>{card.sub}</span>
          </div>
          <p className="text-[9px] lg:text-[10px] text-white/40 font-black uppercase tracking-widest mb-0.5">{card.title}</p>
          <h3 className="text-xl lg:text-3xl font-black text-white tracking-tighter leading-none">{card.value}</h3>
        </Card>
      ))}

      <Card 
        onClick={() => onNavigate('/dashboard/founder/verification')}
        className="bg-white/5 backdrop-blur-xl border-white/10 p-4 relative overflow-hidden group transition-all duration-300 cursor-pointer hover:border-[#01F27B]/30"
      >
        <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-xl -mr-4 -mt-4 transition-colors ${isVerified ? 'bg-[#01F27B]/20' : isPending ? 'bg-amber-500/10' : 'bg-white/5'}`} />
        <div className="flex justify-between items-center mb-2">
          <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center border transition-all ${isVerified ? 'bg-[#01F27B]/10 border-[#01F27B]/20 scale-110 shadow-[0_0_15px_rgba(1,242,123,0.2)]' : isPending ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/5 border-white/10'}`}>
            {isVerified ? <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-[#01F27B]" /> : <ShieldCheck className={`w-4 h-4 lg:w-5 lg:h-5 ${isPending ? 'text-amber-500' : 'text-white/40'}`} />}
          </div>
          <span className={`text-[9px] lg:text-[10px] font-black uppercase tracking-widest ${isVerified ? 'text-[#01F27B]' : isPending ? 'text-amber-500' : 'text-white/30'}`}>
            {isVerified ? 'VERIFIED' : isPending ? 'PENDING' : 'UNVERIFIED'}
          </span>
        </div>
        <p className="text-[9px] lg:text-[10px] text-white/40 font-black uppercase tracking-widest mb-0.5">Account Security</p>
        <div className="flex items-center gap-1.5">
          <h3 className={`text-xl lg:text-2xl font-black tracking-tighter leading-none ${
            isVerified ? "text-white" : isPending ? "text-amber-500" : "text-white/40"
          }`}>
            {isVerified ? "Verified" : isPending ? "Pending" : "Unverified"}
          </h3>
          {isVerified && <CheckCircle className="w-4 h-4 text-[#01F27B] animate-pulse" />}
        </div>
      </Card>
    </div>
  );
}

function ProfileSection({ user, onNavigate }) {
  const { data: verStatus } = useVerificationStatus();
  
  const statusString = (
    (typeof verStatus === 'string' ? verStatus : verStatus?.status) || 
    verStatus?.verification?.status ||
    (typeof verStatus?.data === 'string' ? verStatus?.data : verStatus?.data?.status) ||
    ""
  ).toLowerCase();

  const isRecentlySubmitted = user?.id && localStorage.getItem(`verification_submitted_${user.id}`) === "true";
  const isPending = statusString === "pending" || (isRecentlySubmitted && !statusString);
  const isVerified = user?.isVerified === true || statusString === "approved" || statusString === "verified" || statusString === "success";
  
  const displayName = user?.profile?.companyName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || "My Startup";
  const category = user?.profile?.startupStage || "Founder";
  const bio = user?.profile?.bio || user?.profile?.startupDescription || "Complete your profile to build investor trust and unlock more features.";

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4 flex flex-col justify-between relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#01F27B]/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="flex items-start gap-4 mb-4 relative z-10">
        <div className="relative w-16 h-16 shrink-0">
          <div className="w-full h-full bg-black border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden shadow-xl">
            {user?.profile?.profileImage ? (
              <img src={user.profile.profileImage} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="text-[#01F27B] bg-[#01F27B]/5 w-full h-full flex items-center justify-center">
                <Rocket className="w-6 h-6" />
              </div>
            )}
          </div>
          {isVerified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#01F27B] rounded-lg border-2 border-[#0c0c0c] flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-black" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <h2 className="text-xl lg:text-2xl font-bold text-white truncate">{displayName}</h2>
            <div className="bg-white/10 px-2 py-0.5 rounded-full text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-white/50">
              {category}
            </div>
          </div>
          <p className="text-white/50 text-[11px] lg:text-[13px] leading-relaxed line-clamp-2">
            {bio}
          </p>
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-white/40">Profile Completion</span>
          <span className="text-sm font-black text-[#01F27B] bg-[#01F27B]/10 px-2 py-0.5 rounded-full border border-[#01F27B]/20">85%</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-6 border border-white/5">
          <div className="h-full bg-gradient-to-r from-[#01F27B] to-[#00d66d] shadow-[0_0_15px_rgba(1,242,123,0.4)]" style={{ width: '85%' }} />
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-[#01F27B] blur-[15px] rounded-lg opacity-20 group-hover:opacity-40 animate-pulse transition-opacity" />
            <Button 
              onClick={() => onNavigate('/dashboard/founder/deals?action=create')}
              className="relative w-full h-9 lg:h-10 bg-[#01F27B] hover:bg-[#00d66d] text-black font-black text-xs lg:text-sm rounded-lg transition-all shadow-[0_0_20px_rgba(1,242,123,0.3)] hover:shadow-[0_0_30px_rgba(1,242,123,0.5)] border border-[#01F27B]/50"
            >
              <Plus className="w-3.5 h-3.5 lg:w-4 lg:h-4 mr-1.5" />
              New Deal
            </Button>
          </div>
          <Button 
            variant="outline"
            onClick={() => onNavigate('/dashboard/founder/profile')}
            className="flex-1 h-9 lg:h-10 bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold text-xs lg:text-sm rounded-lg transition-all"
          >
            <User className="w-3.5 h-3.5 lg:w-4 lg:h-4 mr-1.5" />
            Profile
          </Button>
        </div>
      </div>
    </Card>
  );
}

function AnalyticsSection() {
  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4 flex flex-col justify-between h-full relative overflow-hidden group">
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#01F27B]/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-white text-lg lg:text-xl tracking-tight">Performance</h3>
        <span className="text-[10px] lg:text-[12px] font-black uppercase tracking-widest text-white/30 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">Weekly</span>
      </div>
      
      <div className="flex-1 min-h-[100px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analyticsData}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#ffffff20', fontSize: 9, fontWeight: 700}} dy={10} />
            <Tooltip 
              cursor={{fill: '#ffffff05'}}
              contentStyle={{backgroundColor: 'rgba(12,12,12,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px'}}
            />
            <Bar dataKey="views" fill="#ffffff10" radius={[3, 3, 0, 0]} activeBar={{ fill: '#01F27B' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
        <div>
          <p className="text-[8px] lg:text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Peak Traffic</p>
          <div className="flex items-baseline gap-1">
            <span className="text-lg lg:text-2xl font-black text-white">245</span>
            <span className="text-[8px] lg:text-[10px] font-black text-[#01F27B] uppercase tracking-widest">Views</span>
          </div>
        </div>
        <TrendingUp className="w-3.5 h-3.5 text-[#01F27B]" />
      </div>
    </Card>
  );
}

function VerificationSection({ verStatus, user, onNavigate }) {
  const isRecentlySubmitted = user?.id && localStorage.getItem(`verification_submitted_${user.id}`) === "true";
  
  const statusString = (
    (typeof verStatus === 'string' ? verStatus : verStatus?.status) || 
    verStatus?.verification?.status ||
    (typeof verStatus?.data === 'string' ? verStatus?.data : verStatus?.data?.status) ||
    ""
  ).toLowerCase();

  const isApproved = user?.isVerified === true || statusString === "approved" || statusString === "verified" || statusString === "success";
  const status = isApproved ? "approved" : (statusString || (isRecentlySubmitted ? "pending" : "unverified"));
  
  return (
    <Card 
      onClick={() => onNavigate('/dashboard/founder/verification')}
      className="bg-white/5 backdrop-blur-xl border-white/10 p-4 lg:p-5 relative overflow-hidden group flex-1 flex flex-col justify-between cursor-pointer hover:border-[#01F27B]/30 transition-all min-h-[240px] lg:min-h-0"
    >
      {/* Background Glows */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-20 transition-colors ${
        status === 'approved' ? 'bg-[#01F27B]' : status === 'pending' ? 'bg-amber-500' : 'bg-[#01F27B]/20'
      }`} />

      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-white text-base lg:text-lg tracking-tight">Trust & Safety</h3>
          <Badge className={`font-black text-[9px] px-2 py-0.5 rounded-full border ${
            status === 'approved' 
              ? 'bg-[#01F27B]/20 text-[#01F27B] border-[#01F27B]/30' 
              : 'bg-white/5 text-white/40 border-white/10'
          }`}>
            {status === 'approved' ? 'ELITE STATUS' : status === 'pending' ? 'AWAITING REVIEW' : 'LEVEL 1'}
          </Badge>
        </div>

        {status === 'approved' ? (
          <div className="flex flex-col items-center text-center py-2">
            <div className="w-16 h-16 rounded-2xl bg-[#01F27B]/10 border border-[#01F27B]/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(1,242,123,0.15)]">
              <ShieldCheck className="w-8 h-8 text-[#01F27B]" />
            </div>
            <h4 className="text-white font-bold text-lg mb-1">Identity Verified</h4>
            <p className="text-white/40 text-[11px] lg:text-[12px] leading-relaxed max-w-[180px]">
              Your authentic profile is now visible to the entire investor network.
            </p>
          </div>
        ) : status === 'pending' ? (
          <div className="flex flex-col items-center text-center py-2">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 relative">
              <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-[spin_3s_linear_infinite]" />
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
            <h4 className="text-white font-bold text-lg mb-1">Under Review</h4>
            <p className="text-white/40 text-[11px] lg:text-[12px] leading-relaxed max-w-[180px]">
              Our compliance team is verifying your documents. Hang tight!
            </p>
            <p className="mt-4 text-[10px] text-[#01F27B] font-black uppercase tracking-widest animate-pulse">
              Click to view status
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-[#01F27B]/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-[#01F27B]" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-xs">Build Trust</p>
                <p className="text-[10px] text-white/40 truncate">Get 3x more investor views.</p>
              </div>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed px-1">
              Verify your identity to unlock premium features and secure investments faster.
            </p>
          </div>
        )}
      </div>

      {status !== 'pending' && (
        <div className="mt-6">
          <Button 
            className={`w-full h-10 lg:h-11 font-black rounded-xl text-xs lg:text-sm transition-all flex items-center justify-center gap-2 ${
              status === 'approved'
                ? 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                : 'bg-[#01F27B] text-black hover:bg-[#00d66d] shadow-[0_0_15px_rgba(1,242,123,0.2)] hover:shadow-[0_0_25px_rgba(1,242,123,0.4)]'
            }`}
          >
            {status === 'approved' ? 'View Credentials' : 'Apply for Verification'}
            {status === 'unverified' && <Rocket className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      )}
    </Card>
  );
}

function SubscriptionSection({ onNavigate }) {
  return (
    <Card 
      onClick={() => onNavigate('/dashboard/founder/subscription')}
      className="bg-white/5 backdrop-blur-xl border-white/10 p-4 relative overflow-hidden group flex-1 cursor-pointer hover:border-[#01F27B]/30 transition-all"
    >
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#01F27B]/5 rounded-full blur-2xl group-hover:bg-[#01F27B]/10 transition-all" />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#01F27B]/10 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-[#01F27B]" />
          </div>
          <h3 className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-white/40">New Feature</h3>
        </div>
        <Badge className="bg-[#01F27B]/10 text-[#01F27B] border border-[#01F27B]/20 font-black text-[7px] lg:text-[9px] px-1.5 py-0.5 rounded-full">COMING SOON</Badge>
      </div>

      <div className="mb-4">
        <h4 className="text-white font-bold text-sm lg:text-base mb-1 tracking-tight">Founder Boost Engine</h4>
        <p className="text-[10px] lg:text-[11px] text-white/40 leading-relaxed font-medium">
          Accelerate your funding with premium profile boosting and deal priority tools.
        </p>
      </div>

      <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl border border-white/5 group-hover:bg-[#01F27B]/5 group-hover:border-[#01F27B]/10 transition-all">
        <span className="text-[9px] font-black text-[#01F27B] uppercase tracking-tighter">Learn More</span>
        <Rocket className="w-3.5 h-3.5 text-[#01F27B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </Card>
  );
}

function MainDashboard({ verStatus, user, onNavigate, onView, onCreate }) {

  return (
    <div className="flex flex-col gap-4 lg:gap-6 pb-8">
      {/* Top Section: Overview Cards */}
      <div className="w-full">
        <OverviewCards verStatus={verStatus} user={user} onNavigate={onNavigate} />
      </div>

      {/* Bottom Section: Compact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        {/* Left Column: Profile & Analytics */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 lg:gap-6 order-1">
          <ProfileSection user={user} onNavigate={onNavigate} />
          <AnalyticsSection />
        </div>

        {/* Middle Column: Recent Activity */}
        <div className="md:col-span-2 lg:col-span-8 xl:col-span-6 flex flex-col gap-4 order-3 xl:order-2 min-h-[400px]">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4 lg:p-6 flex flex-col h-full relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-white text-lg tracking-tight">Recent Activity</h3>
              <Button 
                variant="link" 
                onClick={() => onNavigate('/dashboard/founder/deals')}
                className="text-[#01F27B] text-xs p-0 h-auto font-bold uppercase tracking-widest"
              >
                View All
              </Button>
            </div>
            
            <div className="flex-1 space-y-4">
              <DealList compact onNavigate={onNavigate} onView={onView} onCreate={onCreate} />
            </div>
          </Card>
        </div>

        {/* Right Column: Status & Plan */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 lg:gap-6 order-2 xl:order-3">
          <VerificationSection verStatus={verStatus} user={user} onNavigate={onNavigate} />
          <SubscriptionSection onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

function MyDealsPage({ 
  onNavigate, 
  viewingDeal, 
  setViewingDeal, 
  editingDeal, 
  setEditingDeal, 
  showCreate, 
  setShowCreate 
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Auto-trigger creation form if action=create is in URL
  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setShowCreate(true);
    }
  }, [searchParams]);

  const closeForm = () => {
    setShowCreate(false);
    setEditingDeal(null);
    // Clear search param to prevent reopening on reload
    if (searchParams.has('action')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('action');
      setSearchParams(newParams);
    }
  };

  if (showCreate || editingDeal) {
    return (
      <CreateDealForm
        initialData={editingDeal}
        onSuccess={closeForm}
        onCancel={closeForm}
      />
    );
  }

  if (viewingDeal) {
    return (
      <DealDetailPage
        deal={viewingDeal}
        onBack={() => setViewingDeal(null)}
        userRole="founder"
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Page header - Simple but Gorgeous */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
       
            <h1 className="text-2xl lg:text-4xl font-black tracking-tighter text-white">My Deals</h1>
          </div>
          <p className="text-white/40 text-sm lg:text-base font-medium tracking-wide">
            Manage and track your startup fundraising deals
          </p>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-[#01F27B] blur-[20px] rounded-xl opacity-20 group-hover:opacity-40 animate-pulse transition-opacity" />
          <Button
            onClick={() => setShowCreate(true)}
            className="relative bg-[#01F27B] hover:bg-[#00d66d] text-black font-black rounded-xl px-8 h-11 lg:h-12 shadow-[0_0_25px_rgba(1,242,123,0.4)] hover:shadow-[0_0_35px_rgba(1,242,123,0.6)] transition-all flex items-center gap-2 border border-[#01F27B]/50"
          >
            <Plus className="w-5 h-5" />
            <span>Create Deal</span>
          </Button>
        </div>
      </div>

      {/* Deal List */}
      <DealList 
        onNavigate={onNavigate} 
        onEdit={setEditingDeal} 
        onView={setViewingDeal} 
        onCreate={() => setShowCreate(true)}
      />
    </div>
  );
}

export default function FounderDashboard({ onNavigate }) {
  const { user } = useAuth();
  const { data: verStatus } = useVerificationStatus();

  useEffect(() => {
    console.log("DEBUG Dashboard: User Data:", user);
    console.log("DEBUG Dashboard: Verification Status API Response:", verStatus);
  }, [user, verStatus]);
  const [showCreate, setShowCreate] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [viewingDeal, setViewingDeal] = useState(null);

  if (viewingDeal) {
    return (
      <DealDetailPage
        deal={viewingDeal}
        onBack={() => setViewingDeal(null)}
        userRole="founder"
      />
    );
  }

  if (showCreate || editingDeal) {
    const closeForm = () => {
      setShowCreate(false);
      setEditingDeal(null);
    };

    return (
      <CreateDealForm
        initialData={editingDeal}
        onSuccess={closeForm}
        onCancel={closeForm}
      />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<MainDashboard verStatus={verStatus} user={user} onNavigate={onNavigate} onView={setViewingDeal} onCreate={() => setShowCreate(true)} />} />
      <Route path="profile" element={<FounderProfilePage />} />

      <Route path="deals" element={
        <MyDealsPage 
          onNavigate={onNavigate} 
          viewingDeal={viewingDeal}
          setViewingDeal={setViewingDeal}
          editingDeal={editingDeal}
          setEditingDeal={setEditingDeal}
          showCreate={showCreate}
          setShowCreate={setShowCreate}
        />
      } />
      <Route path="analytics" element={
        <div className="max-w-6xl mx-auto w-full pb-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <h1 className="text-2xl lg:text-4xl font-black tracking-tighter text-white">Analytics</h1>
              </div>
              <p className="text-white/40 text-sm lg:text-base font-medium tracking-wide">
                Track your deal performance and investor engagement
              </p>
            </div>
          </div>

          <OverviewCards verStatus={verStatus} user={user} onNavigate={onNavigate} />
          
          <div className="h-[400px] lg:h-[500px]">
            <AnalyticsSection />
          </div>
        </div>
      } />
      <Route path="verification" element={<FounderVerificationPage />} />
      <Route path="subscription" element={
        <div className="w-full h-full md:min-h-[calc(100vh-140px)] flex items-center justify-center py-6 md:py-0 px-4">
          <div className="max-w-4xl w-full flex flex-col items-center justify-center text-center space-y-6 md:space-y-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#01F27B] blur-[60px] rounded-full opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl flex items-center justify-center shadow-2xl">
                <CreditCard className="w-10 h-10 lg:w-12 lg:h-12 text-[#01F27B]" />
              </div>
            </div>

            <div className="space-y-4 max-w-2xl">
              <Badge className="bg-[#01F27B]/10 text-[#01F27B] border border-[#01F27B]/20 px-4 py-1.5 rounded-full font-black tracking-widest text-[10px] lg:text-xs uppercase">
                Future Feature
              </Badge>
              <h1 className="text-3xl lg:text-5xl font-black tracking-tighter text-white">
                Founder Subscription <br />
                <span className="text-[#01F27B]">Coming Soon</span>
              </h1>
              <p className="text-white/50 text-base lg:text-lg leading-relaxed">
                We're crafting a premium experience to help you close your funding rounds at record speed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12">
              {[
                {
                  title: "Profile Boosting",
                  desc: "Rank higher in investor searches and stand out as a top-tier founder.",
                  icon: Zap
                },
                {
                  title: "Deal Promotion",
                  desc: "Get your startup and SaaS deals featured directly in front of the right investors.",
                  icon: Rocket
                },
                {
                  title: "Fast-Track Funding",
                  desc: "Accelerate your investment journey with high-priority visibility tools.",
                  icon: ShieldCheck
                }
              ].map((feature, i) => (
                <Card key={i} className="bg-white/[0.03] border-white/10 p-6 backdrop-blur-xl hover:bg-white/[0.05] transition-all hover:border-[#01F27B]/30 group text-left">
                  <div className="w-12 h-12 rounded-2xl bg-[#01F27B]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-[#01F27B]" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
                </Card>
              ))}
            </div>

            <div className="bg-[#01F27B]/5 border border-[#01F27B]/10 p-8 rounded-3xl max-w-3xl w-full mt-12 text-center backdrop-blur-sm">
              <p className="text-[#01F27B] font-medium mb-2">Interested in early access?</p>
              <p className="text-white/70 text-sm lg:text-base">
                We'll notify you the moment we launch these premium tools to help you scale your startup faster than ever before.
              </p>
            </div>
          </div>
        </div>
      } />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
}

