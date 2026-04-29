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
    <div className="space-y-6">
      {/* 1. Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0c0c0c] border-white/5 p-5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-[#01F27B]/10 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-[#01F27B]" />
            </div>
          </div>
          <p className="text-xs text-white/60 font-medium mb-1">TOTAL INVESTMENTS</p>
          <h3 className="text-3xl font-light">$4.5M</h3>
        </Card>

        <Card className="bg-[#0c0c0c] border-white/5 p-5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-[#01F27B]/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#01F27B]" />
            </div>
            <span className="text-xs font-medium text-[#01F27B]">+15%</span>
          </div>
          <p className="text-xs text-white/60 font-medium mb-1">PORTFOLIO ROI</p>
          <h3 className="text-3xl font-light">18.4%</h3>
        </Card>

        <Card className="bg-[#0c0c0c] border-white/5 p-5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-[#01F27B]/10 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-[#01F27B]" />
            </div>
          </div>
          <p className="text-xs text-white/60 font-medium mb-1">ACTIVE DEALS</p>
          <h3 className="text-3xl font-light">12</h3>
        </Card>

        <Card className="bg-[#0c0c0c] border-white/5 p-5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-white/80" />
            </div>
          </div>
          <p className="text-xs text-white/60 font-medium mb-1">SAVED DEALS</p>
          <h3 className="text-3xl font-light">8</h3>
        </Card>
      </div>

      {/* 2. Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0c0c0c] p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto hide-scrollbar">
          <Button variant="outline" className="border-white/10 hover:bg-white/5 h-9 text-xs rounded-lg whitespace-nowrap">
            <Filter className="w-3 h-3 mr-2" />
            All Filters
          </Button>
          <Button variant="outline" className="border-white/10 hover:bg-white/5 h-9 text-xs rounded-lg whitespace-nowrap">
            Category <ChevronDown className="w-3 h-3 ml-2 text-white/40" />
          </Button>
          <Button variant="outline" className="border-white/10 hover:bg-white/5 h-9 text-xs rounded-lg whitespace-nowrap">
            Stage <ChevronDown className="w-3 h-3 ml-2 text-white/40" />
          </Button>
          <Button variant="outline" className="border-white/10 hover:bg-white/5 h-9 text-xs rounded-lg whitespace-nowrap">
            Funding Goal <ChevronDown className="w-3 h-3 ml-2 text-white/40" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white/60">Verified Only</span>
          <div className="w-9 h-5 bg-[#01F27B] rounded-full relative cursor-pointer">
            <div className="w-4 h-4 bg-black rounded-full absolute right-0.5 top-0.5" />
          </div>
        </div>
      </div>

      {/* 3. Deal Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {deals.map(deal => (
          <Card key={deal.id} className="bg-[#0c0c0c] border-white/5 hover:border-[#01F27B]/30 transition-all flex flex-col h-full group cursor-pointer" onClick={() => onNavigate("deal-detail", deal.id)}>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-white group-hover:text-[#01F27B] transition-colors">{deal.name}</h3>
                    {deal.verified && (
                      <div className="w-4 h-4 rounded-full bg-[#01F27B]/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#01F27B]" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-[10px] border-white/10 bg-white/5">{deal.category}</Badge>
                    <Badge variant="outline" className="text-[10px] border-[#01F27B]/20 text-[#01F27B] bg-[#01F27B]/5">{deal.stage}</Badge>
                  </div>
                </div>
                <button className="text-white/40 hover:text-white transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-white/60 leading-relaxed mb-6 flex-1">
                {deal.pitch}
              </p>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">Raised <span className="text-white font-medium">{deal.raised}</span></span>
                  <span className="text-white/40">of {deal.goal}</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-[#01F27B]" style={{ width: `${deal.progress}%` }} />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-lg w-full text-xs">
                    View Details
                  </Button>
                  <Button className="bg-[#01F27B] hover:bg-[#01F27B]/90 text-black font-semibold rounded-lg w-full text-xs">
                    Invest Now
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

