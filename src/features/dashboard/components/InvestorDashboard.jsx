import { 
  TrendingUp, Bookmark, Send, PieChart, Filter, ChevronDown
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

export default function InvestorDashboard({ onNavigate }) {
  const deals = [
    { 
      id: 1, 
      name: "TechFlow AI", 
      category: "AI/ML", 
      stage: "Seed", 
      goal: "$1.5M",
      raised: "$900K",
      progress: 60,
      verified: true,
      pitch: "Automated machine learning pipelines for edge computing devices."
    },
    { 
      id: 2, 
      name: "HealthSync", 
      category: "HealthTech", 
      stage: "Series A", 
      goal: "$5M",
      raised: "$4.2M",
      progress: 84,
      verified: true,
      pitch: "Unified electronic health record system using blockchain."
    },
    { 
      id: 3, 
      name: "GreenCharge", 
      category: "CleanTech", 
      stage: "Pre-Seed", 
      goal: "$500K",
      raised: "$100K",
      progress: 20,
      verified: false,
      pitch: "Next-gen solid state batteries for urban mobility."
    },
    { 
      id: 4, 
      name: "FinStack", 
      category: "FinTech", 
      stage: "Seed", 
      goal: "$2M",
      raised: "$2M",
      progress: 100,
      verified: true,
      pitch: "API-first banking infrastructure for emerging markets."
    }
  ];

  return (
    <div className="space-y-4">
      {/* 1. Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-5 relative overflow-hidden hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#01F27B]/5 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-[#01F27B]/10 rounded-xl flex items-center justify-center border border-[#01F27B]/20">
              <PieChart className="w-6 h-6 text-[#01F27B]" />
            </div>
          </div>
          <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Total Investments</p>
          <h3 className="text-3xl font-bold text-white">$4.5M</h3>
        </Card>


        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-5 relative overflow-hidden hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#01F27B]/5 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-[#01F27B]/10 rounded-xl flex items-center justify-center border border-[#01F27B]/20">
              <TrendingUp className="w-6 h-6 text-[#01F27B]" />
            </div>
            <span className="text-xs font-bold text-[#01F27B] bg-[#01F27B]/10 px-2 py-0.5 rounded-full border border-[#01F27B]/20">+15%</span>
          </div>
          <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Portfolio ROI</p>
          <h3 className="text-3xl font-bold text-white">18.4%</h3>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-5 relative overflow-hidden hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#01F27B]/5 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-[#01F27B]/10 rounded-xl flex items-center justify-center border border-[#01F27B]/20">
              <Send className="w-6 h-6 text-[#01F27B]" />
            </div>
          </div>
          <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Active Deals</p>
          <h3 className="text-3xl font-bold text-white">12</h3>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-5 relative overflow-hidden hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#01F27B]/5 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
              <Bookmark className="w-6 h-6 text-white/60" />
            </div>
          </div>
          <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Saved Deals</p>
          <h3 className="text-3xl font-bold text-white">8</h3>
        </Card>
      </div>

      {/* 2. Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto hide-scrollbar">
          <Button variant="outline" className="bg-white/5 border-white/10 hover:border-[#01F27B]/40 h-10 text-xs rounded-xl whitespace-nowrap px-4">
            <Filter className="w-3.5 h-3.5 mr-2" />
            All Filters
          </Button>
          <Button variant="outline" className="bg-white/5 border-white/10 hover:border-[#01F27B]/40 h-10 text-xs rounded-xl whitespace-nowrap px-4">
            Category <ChevronDown className="w-3.5 h-3.5 ml-2 text-white/20" />
          </Button>
          <Button variant="outline" className="bg-white/5 border-white/10 hover:border-[#01F27B]/40 h-10 text-xs rounded-xl whitespace-nowrap px-4">
            Stage <ChevronDown className="w-3.5 h-3.5 ml-2 text-white/20" />
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Verified Only</span>
          <div className="w-11 h-6 bg-[#01F27B]/20 rounded-full relative cursor-pointer border border-[#01F27B]/30">
            <div className="w-4 h-4 bg-[#01F27B] rounded-full absolute right-1 top-1 shadow-[0_0_10px_rgba(1,242,123,0.5)]" />
          </div>
        </div>
      </div>

      {/* 3. Deal Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {deals.map(deal => (
          <Card key={deal.id} className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-[#01F27B]/30 transition-all duration-500 flex flex-col h-full group cursor-pointer relative overflow-hidden" onClick={() => onNavigate("deal-detail", deal.id)}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#01F27B]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#01F27B]/10 transition-colors" />
            
            <div className="p-6 flex-1 flex flex-col relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#01F27B] transition-colors">{deal.name}</h3>
                    {deal.verified && (
                      <Badge className="bg-[#01F27B]/10 text-[#01F27B] border-[#01F27B]/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md border border-white/5">{deal.category}</span>
                    <span className="text-[10px] font-bold text-[#01F27B] uppercase tracking-widest bg-[#01F27B]/5 px-2 py-1 rounded-md border border-[#01F27B]/10">{deal.stage}</span>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:text-[#01F27B] hover:border-[#01F27B]/30 transition-all">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-white/60 leading-relaxed mb-8 flex-1">
                {deal.pitch}
              </p>

              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-white/40">Raised <span className="text-white ml-1">{deal.raised}</span></span>
                    <span className="text-white/30">{deal.goal}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#01F27B] to-[#00d66d] shadow-[0_0_10px_rgba(1,242,123,0.4)]" 
                      style={{ width: `${deal.progress}%` }} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="bg-white/5 border-white/10 hover:border-[#01F27B]/40 rounded-xl w-full h-11 text-xs font-bold uppercase tracking-widest">
                    Details
                  </Button>
                  <Button className="bg-[#01F27B] hover:bg-[#00d66d] text-black font-bold rounded-xl w-full h-11 text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(1,242,123,0.2)]">
                    Invest
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

