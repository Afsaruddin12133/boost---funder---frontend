import { DealList, CreateDealForm } from "@/features/deal";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Routes, Route, Navigate } from "react-router";
import { useState } from "react";
import {
    CheckCircle, Clock,
    Eye,
    FileText, Lock,
    Rocket,
    ShieldCheck,
    TrendingUp,
    Upload
} from "lucide-react";
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

function OverviewCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-[#0c0c0c] border-white/5 p-5 relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-[#01F27B]/10 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#01F27B]" />
          </div>
          <span className="text-xs font-medium text-white/40">Lifetime</span>
        </div>
        <p className="text-xs text-white/60 font-medium mb-1">TOTAL DEALS</p>
        <h3 className="text-3xl font-light">3</h3>
      </Card>

      <Card className="bg-[#0c0c0c] border-white/5 p-5 relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-[#01F27B]/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#01F27B]" />
          </div>
          <span className="text-xs font-medium text-[#01F27B]">Active</span>
        </div>
        <p className="text-xs text-white/60 font-medium mb-1">ACTIVE DEALS</p>
        <h3 className="text-3xl font-light">1</h3>
      </Card>

      <Card className="bg-[#0c0c0c] border-white/5 p-5 relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-[#f59e0b]/10 rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5 text-[#f59e0b]" />
          </div>
          <span className="text-xs font-medium text-[#01F27B]">+12%</span>
        </div>
        <p className="text-xs text-white/60 font-medium mb-1">PROFILE VIEWS</p>
        <h3 className="text-3xl font-light">1.2k</h3>
      </Card>

      <Card className="bg-[#0c0c0c] border-white/5 p-5 relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-[#01F27B]/10 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#01F27B]" />
          </div>
          <span className="text-xs font-medium text-[#01F27B]">Lvl 2</span>
        </div>
        <p className="text-xs text-white/60 font-medium mb-1">VERIFICATION</p>
        <h3 className="text-2xl font-semibold text-[#01F27B]">Verified</h3>
      </Card>
    </div>
  );
}

function ProfileSection() {
  return (
    <Card className="bg-[#0c0c0c] border-white/5 p-6 md:p-8 flex flex-col justify-between">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-24 h-24 shrink-0 bg-black border border-white/10 rounded-2xl flex items-center justify-center">
          <div className="text-[#01F27B]">
            <Rocket className="w-10 h-10" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-semibold">EcoPulse Solutions</h2>
            <Badge className="bg-[#01F27B]/10 text-[#01F27B] border-[#01F27B]/20 rounded-full">GreenTech</Badge>
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-2xl">
            Pioneering modular carbon capture systems for medium-scale industrial manufacturing plants. 
            Reducing footprint by 40% with AI-driven optimization.
          </p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-white/80">Profile Completion</span>
          <span className="text-sm font-bold text-[#01F27B]">85%</span>
        </div>
        <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden mb-8">
          <div className="h-full bg-[#01F27B] rounded-full" style={{ width: '85%' }} />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Button className="bg-[#01F27B] hover:bg-[#01F27B]/90 text-black font-semibold px-6 rounded-xl">
            <Upload className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white px-6 rounded-xl">
            <Upload className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
        </div>
      </div>
    </Card>
  );
}

function AnalyticsSection() {
  return (
    <Card className="bg-[#0c0c0c] border-white/5 p-6 flex flex-col justify-between h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Profile Analytics</h3>
        <Badge variant="outline" className="text-xs border-white/10 text-white/60">Last 7 Days</Badge>
      </div>
      
      <div className="flex-1 min-h-[160px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analyticsData}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#ffffff50', fontSize: 10}} dy={10} />
            <Tooltip 
              cursor={{fill: '#ffffff05'}}
              contentStyle={{backgroundColor: '#0c0c0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px'}}
            />
            <Bar dataKey="views" fill="#ffffff15" radius={[2, 2, 0, 0]} activeBar={{ fill: '#01F27B' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex justify-between items-end">
        <div>
          <p className="text-xs text-white/50 mb-1">Highest Peak</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">245</span>
            <span className="text-xs text-[#01F27B]">views</span>
          </div>
        </div>
        <TrendingUp className="w-5 h-5 text-[#01F27B]" />
      </div>
    </Card>
  );
}

function VerificationSection() {
  return (
    <Card className="bg-[#0c0c0c] border-white/5 p-6">
      <h3 className="font-semibold text-lg mb-6">Verification Status</h3>
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#01F27B]/5 border border-[#01F27B]/10">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#01F27B]" />
            <span className="text-sm font-medium">ID Upload</span>
          </div>
          <span className="text-[10px] font-bold text-[#01F27B]">DONE</span>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#f59e0b]/5 border border-[#f59e0b]/10">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#f59e0b]" />
            <span className="text-sm font-medium text-white/90">Biometric Selfie</span>
          </div>
          <span className="text-[10px] font-bold text-[#f59e0b]">PENDING</span>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 opacity-50">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-white/60" />
            <span className="text-sm font-medium text-white/60">Tax Compliance</span>
          </div>
          <span className="text-[10px] font-bold text-white/40">LOCKED</span>
        </div>
      </div>
      <Button variant="outline" className="w-full border-[#01F27B]/20 text-[#01F27B] hover:bg-[#01F27B]/10 rounded-xl">
        Complete Verification
      </Button>
    </Card>
  );
}

function SubscriptionSection() {
  return (
    <Card className="bg-[#0c0c0c] border-white/5 p-6 relative overflow-hidden">
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#01F27B]/5 rounded-full blur-2xl" />
      <h3 className="text-sm font-medium text-white/60 mb-2">Subscription Plan</h3>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-2xl font-bold text-[#01F27B]">Pro</span>
        <Badge variant="outline" className="text-[10px] border-white/10 bg-white/5 py-0">Active</Badge>
      </div>
      <p className="text-xs text-white/60 mb-6 leading-relaxed">
        Unlock direct investor messaging and priority deal placement.
      </p>
      <Button className="w-full bg-white text-black hover:bg-white/90 font-semibold rounded-xl">
        <Rocket className="w-4 h-4 mr-2" />
        Upgrade to Elite
      </Button>
    </Card>
  );
}

function MainDashboard({ onNavigate }) {
  return (
    <div className="space-y-6">
      <OverviewCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileSection />
        </div>
        <div>
          <AnalyticsSection />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-[#0c0c0c] border-white/5 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-semibold text-lg">Recent Deals</h3>
          </div>
          <div className="flex-1">
            <DealList onNavigate={onNavigate} />
          </div>
        </Card>
        <div className="space-y-6">
          <VerificationSection />
          <SubscriptionSection />
        </div>
      </div>
    </div>
  );
}

function MyDealsPage({ onNavigate }) {
  const [showCreate, setShowCreate] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);

  if (showCreate || editingDeal) {
    return (
      <CreateDealForm
        initialData={editingDeal}
        onSuccess={() => {
          setShowCreate(false);
          setEditingDeal(null);
        }}
        onCancel={() => {
          setShowCreate(false);
          setEditingDeal(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Deals</h1>
          <p className="text-white/50 text-sm mt-1">Manage and track all your startup fundraising deals</p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="bg-[#01F27B] hover:bg-[#01F27B]/90 text-black font-semibold rounded-xl px-6 shadow-[0_0_20px_rgba(1,242,123,0.25)] hover:shadow-[0_0_30px_rgba(1,242,123,0.4)] transition-all self-start sm:self-auto"
        >
          <span className="text-lg mr-1.5">+</span> Create Deal
        </Button>
      </div>

      {/* Deal List */}
      <DealList onNavigate={onNavigate} onEdit={setEditingDeal} />
    </div>
  );
}

export default function FounderDashboard({ onNavigate }) {
  return (
    <Routes>
      <Route path="/" element={<MainDashboard onNavigate={onNavigate} />} />
      <Route path="/profile" element={
        <div className="space-y-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Startup Profile</h1>
          <ProfileSection />
        </div>
      } />
      <Route path="/deals" element={<MyDealsPage onNavigate={onNavigate} />} />
      <Route path="/analytics" element={
        <div className="space-y-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Analytics</h1>
          <OverviewCards />
          <div className="h-96">
            <AnalyticsSection />
          </div>
        </div>
      } />
      <Route path="/verification" element={
        <div className="space-y-6 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Verification</h1>
          <VerificationSection />
        </div>
      } />
      <Route path="/subscription" element={
        <div className="space-y-6 max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6">Subscription</h1>
          <SubscriptionSection />
        </div>
      } />
      <Route path="/settings" element={
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

