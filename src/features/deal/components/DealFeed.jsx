import { useState } from "react";
import { Search, Bookmark, TrendingUp, Users, MapPin, LayoutDashboard, LogOut, Bell, Settings, Rocket } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
const MOCK_DEALS = [
  {
    id: 1,
    name: "TechFlow AI",
    pitch: "AI-powered code generation platform for enterprise teams",
    category: "AI/ML",
    stage: "Seed",
    founder: "Sarah Chen",
    verified: true,
    traction: "$500K ARR, 2,000 users",
    location: "San Francisco, CA",
    raised: "$2M",
    saved: false
  },
  {
    id: 2,
    name: "HealthSync",
    pitch: "Unified healthcare data platform connecting patients and providers",
    category: "HealthTech",
    stage: "Series A",
    founder: "Dr. Michael Roberts",
    verified: true,
    traction: "100K users, 50 hospitals",
    location: "Boston, MA",
    raised: "$8M",
    saved: true
  },
  {
    id: 3,
    name: "GreenCharge",
    pitch: "EV charging infrastructure network powered by renewable energy",
    category: "CleanTech",
    stage: "Pre-Seed",
    founder: "Emma Johnson",
    verified: true,
    traction: "10 partnerships",
    location: "Austin, TX",
    raised: "$500K",
    saved: false
  },
  {
    id: 4,
    name: "FinStack",
    pitch: "Banking infrastructure for embedded finance",
    category: "FinTech",
    stage: "Seed",
    founder: "James Wilson",
    verified: true,
    traction: "$1M ARR, 200 clients",
    location: "New York, NY",
    raised: "$5M",
    saved: false
  },
  {
    id: 5,
    name: "EduLearn",
    pitch: "Personalized learning platform using adaptive AI",
    category: "EdTech",
    stage: "Seed",
    founder: "Lisa Martinez",
    verified: true,
    traction: "50K students",
    location: "Seattle, WA",
    raised: "$3M",
    saved: true
  }
];
export default function DealFeed({ onNavigate, userRole, onLogout }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deals, setDeals] = useState(MOCK_DEALS);
  const categories = ["All", "AI/ML", "FinTech", "HealthTech", "CleanTech", "EdTech"];
  const stages = ["Pre-Seed", "Seed", "Series A", "Series B"];
  const toggleSave = (dealId) => {
    setDeals(deals.map(
      (deal) => deal.id === dealId ? { ...deal, saved: !deal.saved } : deal
    ));
  };
  const filteredDeals = deals.filter((deal) => {
    const matchesSearch = deal.name.toLowerCase().includes(searchQuery.toLowerCase()) || deal.pitch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === "All" || deal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  return <div className="flex h-screen bg-black">
      {
    /* Left Sidebar */
  }
      <div className="w-64 bg-[#0c0c0c] border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#01F27B] rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-semibold">BoostFundr</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
    onClick={() => onNavigate("deal-feed")}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#01F27B]/10 text-[#01F27B]"
  >
            <TrendingUp className="w-5 h-5" />
            <span>Deal Feed</span>
          </button>

          {userRole === "investor" && <button
    onClick={() => onNavigate("investor-dashboard")}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-colors"
  >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>}

          {userRole === "founder" && <button
    onClick={() => onNavigate("founder-dashboard")}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-colors"
  >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>}

          <button
    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-colors"
  >
            <Bookmark className="w-5 h-5" />
            <span>Saved Deals</span>
          </button>

          <button
    onClick={() => onNavigate("subscription")}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-colors"
  >
            <Users className="w-5 h-5" />
            <span>Subscription</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button
    onClick={onLogout}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-colors"
  >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {
    /* Main Content */
  }
      <div className="flex-1 flex flex-col overflow-hidden">
        {
    /* Top Bar */
  }
        <div className="bg-[#0c0c0c] border-b border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Deal Feed</h1>
              <p className="text-white/60 text-sm">Discover your next investment</p>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#01F27B] rounded-full" />
            </Button>
          </div>

          {
    /* Search */
  }
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search deals..."
    className="pl-10 bg-white/5 border-white/10 focus:border-[#01F27B]/30"
  />
          </div>
        </div>

        {
    /* Feed Content */
  }
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {filteredDeals.map((deal) => <Card
    key={deal.id}
    className="bg-gradient-to-br from-[#0c0c0c] via-[#0c0c0c] to-[#06120b] border-white/10 p-6 hover:border-[#01F27B]/30 transition-all cursor-pointer group relative overflow-hidden hover:shadow-[0_0_30px_rgba(1,242,123,0.1)]"
    onClick={() => onNavigate("deal-detail", deal.id)}
  >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#01F27B]/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold group-hover:text-[#01F27B] transition-colors">
                        {deal.name}
                      </h3>
                      {deal.verified && <Badge className="bg-[#01F27B]/10 text-[#01F27B] border-[#01F27B]/20">
                          Verified
                        </Badge>}
                    </div>
                    <p className="text-white/70 mb-3">{deal.pitch}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-white/20">
                        {deal.category}
                      </Badge>
                      <Badge variant="outline" className="border-white/20">
                        {deal.stage}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-white/60">
                        <MapPin className="w-3 h-3" />
                        {deal.location}
                      </div>
                    </div>
                  </div>

                  <Button
    variant="ghost"
    size="icon"
    onClick={(e) => {
      e.stopPropagation();
      toggleSave(deal.id);
    }}
    className={deal.saved ? "text-[#01F27B]" : "text-white/40 hover:text-[#01F27B]"}
  >
                    <Bookmark className={`w-5 h-5 ${deal.saved ? "fill-current" : ""}`} />
                  </Button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-white/60">Raised: </span>
                      <span className="text-[#01F27B]">{deal.raised}</span>
                    </div>
                    <div>
                      <span className="text-white/60">Traction: </span>
                      <span>{deal.traction}</span>
                    </div>
                  </div>

                  <Button
    onClick={(e) => {
      e.stopPropagation();
      onNavigate("deal-detail", deal.id);
    }}
    className="bg-[#01F27B] hover:bg-[#01F27B]/90 text-black"
  >
                    View Deal
                  </Button>
                </div>
                </div>
              </Card>)}
          </div>
        </div>
      </div>

      {
    /* Right Sidebar - Filters */
  }
      <div className="w-80 bg-[#0c0c0c] border-l border-white/10 p-6 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filters</h3>
            <Button variant="ghost" size="sm" className="text-[#01F27B] h-auto p-0">
              Clear
            </Button>
          </div>

          <div className="space-y-6">
            {
    /* Categories */
  }
            <div>
              <h4 className="text-sm text-white/60 mb-3">Category</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => <button
    key={cat}
    onClick={() => setSelectedCategory(cat === "All" ? null : cat)}
    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${selectedCategory === cat || !selectedCategory && cat === "All" ? "bg-[#01F27B] text-black" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
  >
                    {cat}
                  </button>)}
              </div>
            </div>

            {
    /* Stage */
  }
            <div>
              <h4 className="text-sm text-white/60 mb-3">Stage</h4>
              <div className="flex flex-wrap gap-2">
                {stages.map((stage) => <button
    key={stage}
    className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-white/70 hover:bg-white/10 transition-all"
  >
                    {stage}
                  </button>)}
              </div>
            </div>

            {
    /* Recommended */
  }
            <div>
              <h4 className="text-sm text-white/60 mb-3">Recommended for You</h4>
              <div className="space-y-3">
                {MOCK_DEALS.slice(0, 3).map((deal) => <div
    key={deal.id}
    onClick={() => onNavigate("deal-detail", deal.id)}
    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all"
  >
                    <div className="font-medium text-sm mb-1">{deal.name}</div>
                    <div className="text-xs text-white/60">{deal.category}</div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
