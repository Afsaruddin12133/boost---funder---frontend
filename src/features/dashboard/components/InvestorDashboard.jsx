import { TrendingUp, Bookmark, Send, BarChart3, ArrowLeft, Rocket, LogOut } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
export default function InvestorDashboard({ onNavigate, onLogout }) {
  const stats = {
    savedDeals: 12,
    unlockedDeals: 5,
    requestsSent: 8,
    engagementScore: 87
  };
  const savedDeals = [
    { id: 1, name: "TechFlow AI", category: "AI/ML", stage: "Seed", traction: "$500K ARR" },
    { id: 2, name: "HealthSync", category: "HealthTech", stage: "Series A", traction: "100K users" },
    { id: 5, name: "EduLearn", category: "EdTech", stage: "Seed", traction: "50K students" }
  ];
  const recentRequests = [
    { id: 1, startup: "TechFlow AI", status: "pending", date: "2 days ago" },
    { id: 4, startup: "FinStack", status: "approved", date: "1 week ago" },
    { id: 3, startup: "GreenCharge", status: "pending", date: "3 days ago" }
  ];
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20";
      case "pending":
        return "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20";
      case "rejected":
        return "bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/20";
      default:
        return "bg-white/10 text-white/60";
    }
  };
  return <div className="min-h-screen bg-black">
      {
    /* Navigation */
  }
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
    variant="ghost"
    size="icon"
    onClick={() => onNavigate("deal-feed")}
  >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#01F27B] rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-semibold">BoostFundr</span>
            </div>
          </div>
          <Button variant="ghost" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {
    /* Header */
  }
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Investor Dashboard</h1>
          <p className="text-white/60">Track your deal flow and investment activity</p>
        </div>

        {
    /* Stats Grid */
  }
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#01F27B]/10 via-[#0c0c0c] to-[#06120b] border-[#01F27B]/20 p-6 relative overflow-hidden hover:shadow-[0_0_30px_rgba(1,242,123,0.15)] transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#01F27B]/20 to-transparent rounded-full blur-xl" />
            <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Bookmark className="w-5 h-5 text-[#01F27B]" />
              <span className="text-white/60 text-sm">Saved Deals</span>
            </div>
            <div className="text-3xl font-bold">{stats.savedDeals}</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#01F27B]/10 via-[#0c0c0c] to-[#06120b] border-[#01F27B]/20 p-6 relative overflow-hidden hover:shadow-[0_0_30px_rgba(1,242,123,0.15)] transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#01F27B]/20 to-transparent rounded-full blur-xl" />
            <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-[#01F27B]" />
              <span className="text-white/60 text-sm">Unlocked Deals</span>
            </div>
            <div className="text-3xl font-bold">{stats.unlockedDeals}</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#01F27B]/10 via-[#0c0c0c] to-[#06120b] border-[#01F27B]/20 p-6 relative overflow-hidden hover:shadow-[0_0_30px_rgba(1,242,123,0.15)] transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#01F27B]/20 to-transparent rounded-full blur-xl" />
            <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Send className="w-5 h-5 text-[#01F27B]" />
              <span className="text-white/60 text-sm">Requests Sent</span>
            </div>
            <div className="text-3xl font-bold">{stats.requestsSent}</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#01F27B]/10 via-[#0c0c0c] to-[#06120b] border-[#01F27B]/20 p-6 relative overflow-hidden hover:shadow-[0_0_30px_rgba(1,242,123,0.15)] transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#01F27B]/20 to-transparent rounded-full blur-xl" />
            <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-[#01F27B]" />
              <span className="text-white/60 text-sm">Engagement Score</span>
            </div>
            <div className="text-3xl font-bold">{stats.engagementScore}</div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {
    /* Saved Deals */
  }
          <Card className="bg-[#0c0c0c] border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Saved Deals</h2>
              <Button
    variant="ghost"
    size="sm"
    onClick={() => onNavigate("deal-feed")}
    className="text-[#01F27B]"
  >
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {savedDeals.map((deal) => <div
    key={deal.id}
    onClick={() => onNavigate("deal-detail", deal.id)}
    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all border border-white/10 hover:border-[#01F27B]/30"
  >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{deal.name}</h3>
                    <Badge variant="outline" className="border-white/20 text-xs">
                      {deal.stage}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className="bg-[#01F27B]/10 text-[#01F27B] border-[#01F27B]/20">
                      {deal.category}
                    </Badge>
                    <span className="text-white/60">{deal.traction}</span>
                  </div>
                </div>)}
            </div>
          </Card>

          {
    /* Recent Requests */
  }
          <Card className="bg-[#0c0c0c] border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Requests</h2>
            </div>

            <div className="space-y-4">
              {recentRequests.map((request) => <div
    key={request.id}
    className="p-4 rounded-xl bg-white/5 border border-white/10"
  >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{request.startup}</h3>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-white/60">{request.date}</div>
                </div>)}
            </div>
          </Card>
        </div>

        {
    /* Recommended Deals */
  }
        <Card className="bg-[#0c0c0c] border-white/10 p-6 mt-6">
          <h2 className="text-xl font-semibold mb-6">Recommended For You</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {savedDeals.map((deal) => <div
    key={deal.id}
    onClick={() => onNavigate("deal-detail", deal.id)}
    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all border border-white/10 hover:border-[#01F27B]/30"
  >
                <h3 className="font-semibold mb-2">{deal.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <Badge className="bg-[#01F27B]/10 text-[#01F27B] border-[#01F27B]/20 text-xs">
                    {deal.category}
                  </Badge>
                </div>
              </div>)}
          </div>
        </Card>
      </div>
    </div>;
}
