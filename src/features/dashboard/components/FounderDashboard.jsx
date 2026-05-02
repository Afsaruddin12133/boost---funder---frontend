import { useAuth } from "@/features/auth/hooks/useAuth";
import { CreateDealForm, DealList } from "@/features/deal";
import DealDetailPage from "@/features/deal/components/DealDetailPage";
import FounderProfilePage from "@/features/profile/components/FounderProfilePage";
import FounderVerificationPage from "@/features/verification/components/FounderVerificationPage";
import { useMyDeals } from "@/features/deal/hooks";
import { useVerificationStatus } from "@/features/verification/hooks/useVerification";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import {
  CheckCircle, Clock,
  Eye,
  FileText,
  Plus,
  Rocket,
  ShieldCheck,
  TrendingUp,
  User
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

function OverviewCards({ verStatus, user }) {
  const { data: deals = [] } = useMyDeals();
  const isVerified = verStatus?.status === "approved" && user?.isVerified === true;
  const isPending = verStatus?.status === "pending";

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

      <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4 relative overflow-hidden group transition-all duration-300">
        <div className="absolute top-0 right-0 w-16 h-16 bg-[#01F27B]/5 rounded-full blur-xl -mr-4 -mt-4" />
        <div className="flex justify-between items-center mb-2">
          <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center border ${isVerified ? 'bg-[#01F27B]/10 border-[#01F27B]/20' : isPending ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/5 border-white/10'}`}>
            <ShieldCheck className={`w-4 h-4 lg:w-5 lg:h-5 ${isVerified ? 'text-[#01F27B]' : isPending ? 'text-amber-500' : 'text-white/40'}`} />
          </div>
          <span className="text-[9px] lg:text-[10px] text-[#01F27B] font-black uppercase tracking-widest">Level 1</span>
        </div>
        <p className="text-[9px] lg:text-[10px] text-white/40 font-black uppercase tracking-widest mb-0.5">Verification</p>
        <h3 className={`text-xl lg:text-2xl font-black tracking-tighter leading-none ${isVerified ? "text-[#01F27B]" : isPending ? "text-amber-500" : "text-white/10 uppercase italic"}`}>
          {isVerified ? "Verified" : isPending ? "Pending" : "Unverified"}
        </h3>
      </Card>
    </div>
  );
}

function ProfileSection({ user, onNavigate }) {
  const { data: verStatus } = useVerificationStatus();
  const isVerified = verStatus?.status === "approved" && user?.isVerified === true;
  
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

function VerificationSection({ verStatus, user }) {
  const status = user?.isVerified === false ? "unverified" : (verStatus?.status || "unverified");
  
  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4 relative overflow-hidden flex-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white text-base lg:text-lg tracking-tight">Trust & Safety</h3>
        <span className={`text-[8px] lg:text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full border ${status === 'approved' ? 'text-[#01F27B] bg-[#01F27B]/10 border-[#01F27B]/20' : 'text-white/40 bg-white/5 border-white/5'}`}>
          {status === 'approved' ? 'Level 2' : 'Action'}
        </span>
      </div>
      
      <div className="space-y-1.5 mb-4">
        {[
          { label: "Identity", status: status === 'approved' ? 'DONE' : status === 'pending' ? 'REVIEW' : 'TODO', icon: CheckCircle, active: status === 'approved', pending: status === 'pending' },
          { label: "Review", status: status === 'pending' ? 'PEND' : status === 'approved' ? 'PASS' : 'WAIT', icon: Clock, active: status === 'approved', pending: status === 'pending' },
        ].map((step, idx) => (
          <div key={idx} className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${step.active ? 'bg-[#01F27B]/10 border-[#01F27B]/20' : step.pending ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/5 border-white/5 opacity-60'}`}>
            <div className="flex items-center gap-2">
              <step.icon className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${step.active ? 'text-[#01F27B]' : step.pending ? 'text-amber-500' : 'text-white/20'}`} />
              <span className={`text-xs lg:text-sm font-bold tracking-tight ${step.active || step.pending ? 'text-white' : 'text-white/40'}`}>{step.label}</span>
            </div>
            <span className={`text-[8px] lg:text-[10px] font-black tracking-widest ${step.active ? 'text-[#01F27B]' : step.pending ? 'text-amber-500' : 'text-white/20'}`}>
              {step.status}
            </span>
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:border-[#01F27B]/40 text-white font-bold h-8 lg:h-10 rounded-lg text-xs lg:text-sm transition-all">
        {status === 'unverified' ? 'Start' : 'View'}
      </Button>
    </Card>
  );
}

function SubscriptionSection() {
  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4 relative overflow-hidden group flex-1">
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#01F27B]/10 rounded-full blur-2xl group-hover:bg-[#01F27B]/20 transition-all" />
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-white/40">Plan</h3>
        <Badge className="bg-[#01F27B] text-black font-black text-[8px] lg:text-[10px] px-1.5 py-0.5 rounded-full">ACTIVE</Badge>
      </div>
      <div className="flex items-baseline gap-1.5 mb-2">
        <span className="text-xl lg:text-3xl font-black text-white">Pro</span>
        <span className="text-[9px] lg:text-[11px] text-white/40 font-bold uppercase tracking-widest">Founder</span>
      </div>
      <p className="text-[11px] lg:text-[13px] text-white/50 mb-4 leading-tight">
        Direct investor access enabled.
      </p>
      <Button className="w-full bg-white text-black font-black h-8 lg:h-10 rounded-lg text-xs lg:text-sm transition-all hover:bg-white/90">
        Upgrade
      </Button>
    </Card>
  );
}

function MainDashboard({ onNavigate, onView }) {
  const { data: verStatus } = useVerificationStatus();
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-4 h-auto lg:h-[calc(100vh-130px)] overflow-y-auto lg:overflow-hidden custom-scrollbar">
      {/* Top Section: Overview Cards */}
      <div className="flex-none">
        <OverviewCards verStatus={verStatus} user={user} />
      </div>

      {/* Bottom Section: Compact Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Left Column: Profile & Analytics */}
        <div className="lg:col-span-3 flex flex-col gap-4 overflow-visible lg:overflow-hidden">
          <div className="flex-none">
            <ProfileSection user={user} onNavigate={onNavigate} />
          </div>
          <div className="flex-none lg:flex-1 min-h-[300px] lg:min-h-0">
            <AnalyticsSection />
          </div>
        </div>

        {/* Middle Column: Recent Activity */}
        <div className="lg:col-span-6 flex flex-col overflow-visible lg:overflow-hidden min-h-[400px] lg:min-h-0">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4 flex flex-col h-full relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white text-lg tracking-tight">Recent Activity</h3>
              <Button 
                variant="link" 
                onClick={() => onNavigate('/dashboard/founder/deals')}
                className="text-[#01F27B] text-xs p-0 h-auto font-bold uppercase tracking-widest"
              >
                View All
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
              <DealList compact onNavigate={onNavigate} onView={onView} />
            </div>
          </Card>
        </div>

        {/* Right Column: Status & Plan */}
        <div className="lg:col-span-3 flex flex-col gap-4 overflow-visible lg:overflow-hidden">
          <VerificationSection verStatus={verStatus} user={user} />
          <SubscriptionSection />
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
      <Route path="/" element={<MainDashboard onNavigate={onNavigate} onView={setViewingDeal} />} />
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
        <div className="space-y-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Analytics</h1>
          <OverviewCards />
          <div className="h-96">
            <AnalyticsSection />
          </div>
        </div>
      } />
      <Route path="verification" element={<FounderVerificationPage />} />
      <Route path="subscription" element={
        <div className="space-y-6 max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6">Subscription</h1>
          <SubscriptionSection />
        </div>
      } />
      <Route path="settings" element={
        <div className="space-y-6 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          <Card className="bg-[#0c0c0c] border-white/5 p-8 text-center text-white/50">
            Settings page options coming soon.
          </Card>
        </div>
      } />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
}

