import { Eye, Send, TrendingUp, Upload, ArrowLeft, Rocket, LogOut, CheckCircle, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
export default function FounderDashboard({ onNavigate, onLogout }) {
  const stats = {
    views: 1248,
    requests: 23,
    conversionRate: "18.4%",
    approvedConnections: 8
  };
  const startup = {
    name: "TechFlow AI",
    stage: "Seed",
    status: "Published",
    completeness: 95
  };
  const investorRequests = [
    {
      id: 1,
      investor: "John Anderson",
      firm: "Sequoia Capital",
      focus: "AI/ML, B2B SaaS",
      date: "2 hours ago",
      status: "pending"
    },
    {
      id: 2,
      investor: "Maria Garcia",
      firm: "a16z",
      focus: "HealthTech, AI",
      date: "5 hours ago",
      status: "pending"
    },
    {
      id: 3,
      investor: "David Lee",
      firm: "Founders Fund",
      focus: "Deep Tech",
      date: "1 day ago",
      status: "approved"
    }
  ];
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
          <h1 className="text-3xl font-bold mb-2">Founder Dashboard</h1>
          <p className="text-white/60">Manage your startup profile and investor connections</p>
        </div>

        {
    /* Startup Profile Card */
  }
        <Card className="bg-gradient-to-br from-[#06120b] to-[#0c0c0c] border-[#01F27B]/20 p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{startup.name}</h2>
              <div className="flex items-center gap-3">
                <Badge className="bg-[#01F27B]/10 text-[#01F27B] border-[#01F27B]/20">
                  {startup.stage}
                </Badge>
                <Badge className="bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20">
                  {startup.status}
                </Badge>
              </div>
            </div>
            <Button className="bg-[#01F27B] hover:bg-[#01F27B]/90 text-black">
              <Upload className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/60">Profile Completeness</span>
              <span className="text-sm text-[#01F27B]">{startup.completeness}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
    className="h-full bg-[#01F27B] rounded-full transition-all"
    style={{ width: `${startup.completeness}%` }}
  />
            </div>
          </div>
        </Card>

        {
    /* Stats Grid */
  }
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#01F27B]/10 via-[#0c0c0c] to-[#06120b] border-[#01F27B]/20 p-6 relative overflow-hidden hover:shadow-[0_0_30px_rgba(1,242,123,0.15)] transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#01F27B]/20 to-transparent rounded-full blur-xl" />
            <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 text-[#01F27B]" />
              <span className="text-white/60 text-sm">Profile Views</span>
            </div>
            <div className="text-3xl font-bold">{stats.views}</div>
            <div className="text-xs text-[#10b981] mt-1">+12% this week</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#01F27B]/10 via-[#0c0c0c] to-[#06120b] border-[#01F27B]/20 p-6 relative overflow-hidden hover:shadow-[0_0_30px_rgba(1,242,123,0.15)] transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#01F27B]/20 to-transparent rounded-full blur-xl" />
            <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Send className="w-5 h-5 text-[#01F27B]" />
              <span className="text-white/60 text-sm">Requests</span>
            </div>
            <div className="text-3xl font-bold">{stats.requests}</div>
            <div className="text-xs text-[#10b981] mt-1">3 new today</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#01F27B]/10 via-[#0c0c0c] to-[#06120b] border-[#01F27B]/20 p-6 relative overflow-hidden hover:shadow-[0_0_30px_rgba(1,242,123,0.15)] transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#01F27B]/20 to-transparent rounded-full blur-xl" />
            <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-[#01F27B]" />
              <span className="text-white/60 text-sm">Conversion</span>
            </div>
            <div className="text-3xl font-bold">{stats.conversionRate}</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#01F27B]/10 via-[#0c0c0c] to-[#06120b] border-[#01F27B]/20 p-6 relative overflow-hidden hover:shadow-[0_0_30px_rgba(1,242,123,0.15)] transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#01F27B]/20 to-transparent rounded-full blur-xl" />
            <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-[#01F27B]" />
              <span className="text-white/60 text-sm">Connections</span>
            </div>
            <div className="text-3xl font-bold">{stats.approvedConnections}</div>
            </div>
          </Card>
        </div>

        {
    /* Investor Requests */
  }
        <Card className="bg-[#0c0c0c] border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Investor Requests</h2>
            <Badge className="bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20">
              {investorRequests.filter((r) => r.status === "pending").length} Pending
            </Badge>
          </div>

          <div className="space-y-4">
            {investorRequests.map((request) => <div
    key={request.id}
    className="p-5 rounded-xl bg-white/5 border border-white/10"
  >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold mb-1">{request.investor}</h3>
                    <p className="text-sm text-white/60 mb-2">{request.firm}</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#01F27B]/10 text-[#01F27B] border-[#01F27B]/20 text-xs">
                        {request.focus}
                      </Badge>
                      <span className="text-xs text-white/40">{request.date}</span>
                    </div>
                  </div>

                  {request.status === "pending" ? <div className="flex gap-2">
                      <Button
    size="sm"
    className="bg-[#01F27B] hover:bg-[#01F27B]/90 text-black"
  >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
    size="sm"
    variant="outline"
    className="border-white/20 hover:bg-white/5"
  >
                        <X className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                    </div> : <Badge className="bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20">
                      Approved
                    </Badge>}
                </div>
              </div>)}
          </div>
        </Card>

        {
    /* Quick Actions */
  }
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <Card className="bg-[#0c0c0c] border-white/10 p-6 hover:border-[#01F27B]/30 cursor-pointer transition-all">
            <Upload className="w-8 h-8 text-[#01F27B] mb-3" />
            <h3 className="font-semibold mb-2">Upload Pitch Deck</h3>
            <p className="text-sm text-white/60">Update your presentation materials</p>
          </Card>

          <Card className="bg-[#0c0c0c] border-white/10 p-6 hover:border-[#01F27B]/30 cursor-pointer transition-all">
            <TrendingUp className="w-8 h-8 text-[#01F27B] mb-3" />
            <h3 className="font-semibold mb-2">Update Traction</h3>
            <p className="text-sm text-white/60">Add latest metrics and milestones</p>
          </Card>

          <Card className="bg-[#0c0c0c] border-white/10 p-6 hover:border-[#01F27B]/30 cursor-pointer transition-all">
            <Eye className="w-8 h-8 text-[#01F27B] mb-3" />
            <h3 className="font-semibold mb-2">View Analytics</h3>
            <p className="text-sm text-white/60">See detailed engagement metrics</p>
          </Card>
        </div>
      </div>
    </div>;
}
