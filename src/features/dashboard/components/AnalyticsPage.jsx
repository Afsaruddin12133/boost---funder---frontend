import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer2, 
  Bookmark, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  Calendar,
  Rocket,
  ShieldCheck
} from 'lucide-react';
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";

const data = [
  { name: 'Mon', views: 400, clicks: 240 },
  { name: 'Tue', views: 300, clicks: 139 },
  { name: 'Wed', views: 200, clicks: 980 },
  { name: 'Thu', views: 278, clicks: 390 },
  { name: 'Fri', views: 189, clicks: 480 },
  { name: 'Sat', views: 239, clicks: 380 },
  { name: 'Sun', views: 349, clicks: 430 },
];

const investorTypes = [
  { name: 'VCs', value: 45, color: '#01F27B' },
  { name: 'Angel Investors', value: 30, color: '#00d66d' },
  { name: 'Private Equity', value: 15, color: '#00ba5f' },
  { name: 'Others', value: 10, color: '#009e51' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase italic leading-tight">
            Analytics
          </h1>
          <p className="text-white/40 text-sm lg:text-lg font-medium tracking-wide mt-2">
            Track your deal performance and investor engagement
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white/5 border-white/10 text-white/60 h-11 px-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </Button>
          <Button className="bg-[#01F27B] hover:bg-[#00d66d] text-black font-black h-11 px-6 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-[0_10px_20px_rgba(1,242,123,0.1)]">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <MetricCard 
          icon={Eye} 
          label="Total Views" 
          value="2,840" 
          trend="+12.5%" 
          isPositive={true} 
        />
        <MetricCard 
          icon={MousePointer2} 
          label="Deal Clicks" 
          value="842" 
          trend="+5.2%" 
          isPositive={true} 
        />
        <MetricCard 
          icon={Bookmark} 
          label="Saves" 
          value="124" 
          trend="-2.4%" 
          isPositive={false} 
        />
        <MetricCard 
          icon={TrendingUp} 
          label="Conv. Rate" 
          value="4.2%" 
          trend="+0.8%" 
          isPositive={true} 
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-8 bg-white/[0.03] backdrop-blur-xl border-white/10 p-6 lg:p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white tracking-tight">Performance Trend</h3>
              <p className="text-white/40 text-xs">Daily views and clicks across your active deals</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#01F27B]" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Clicks</span>
              </div>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#01F27B" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#01F27B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff40', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff40', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0c0c0c', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#01F27B" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#ffffff20" 
                  strokeWidth={2}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Investor Breakdown */}
        <Card className="lg:col-span-4 bg-white/[0.03] backdrop-blur-xl border-white/10 p-6 lg:p-8 flex flex-col">
          <div className="space-y-1 mb-8">
            <h3 className="text-lg font-bold text-white tracking-tight">Investor Reach</h3>
            <p className="text-white/40 text-xs">Audience segmentation by entity type</p>
          </div>

          <div className="flex-1 h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={investorTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {investorTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white tracking-tighter italic">85%</span>
              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Growth</span>
            </div>
          </div>

          <div className="space-y-3 mt-8">
            {investorTypes.map((type, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color }} />
                  <span className="text-xs font-bold text-white/70">{type.name}</span>
                </div>
                <span className="text-xs font-black text-white">{type.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Engagement Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        <Section icon={Users} title="Top Interested Entities">
          <div className="space-y-4">
            {[
              { name: 'Silicon Peak VC', type: 'Venture Capital', activity: '5 View, 2 Saves', logo: 'S' },
              { name: 'Apex Angels', type: 'Angel Group', activity: '3 Views, 1 Save', logo: 'A' },
              { name: 'Horizon Capital', type: 'Private Equity', activity: '2 Views', logo: 'H' },
            ].map((entity, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#01F27B]/20 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#01F27B]/10 border border-[#01F27B]/20 flex items-center justify-center text-[#01F27B] font-black">
                    {entity.logo}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#01F27B] transition-colors">{entity.name}</h4>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{entity.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-white/60">{entity.activity}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={TrendingUp} title="Conversion Funnel">
          <div className="space-y-6 pt-4">
            {[
              { label: 'Impressions', value: '12,450', percent: 100 },
              { label: 'Views', value: '2,840', percent: 65 },
              { label: 'Saves', value: '124', percent: 35 },
              { label: 'Pitch Deck Requests', value: '42', percent: 15 },
            ].map((step, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{step.label}</span>
                  <span className="text-sm font-black text-white italic tracking-tighter">{step.value}</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#01F27B] to-[#00d66d] shadow-[0_0_10px_rgba(1,242,123,0.3)] transition-all duration-1000" 
                    style={{ width: `${step.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, trend, isPositive }) {
  return (
    <Card className="bg-white/[0.03] backdrop-blur-xl border-white/10 p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#01F27B]/5 rounded-full blur-2xl -mr-8 -mt-8" />
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#01F27B]/10 border border-[#01F27B]/20 flex items-center justify-center text-[#01F27B]">
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${isPositive ? 'bg-[#01F27B]/10 text-[#01F27B]' : 'bg-red-400/10 text-red-400'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">{label}</p>
      <h3 className="text-3xl font-black text-white italic tracking-tighter">{value}</h3>
    </Card>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <Card className="bg-white/[0.03] backdrop-blur-xl border-white/10 p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-[#01F27B]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#01F27B]" />
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight uppercase">{title}</h3>
      </div>
      {children}
    </Card>
  );
}


