import { useState } from "react";
import { ArrowLeft, Lock, Download, ExternalLink, Users, TrendingUp, MapPin, DollarSign, Calendar, CheckCircle, Rocket } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
export default function DealDetailPage({ dealId, onNavigate, userRole, onLogout }) {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const deal = {
    id: dealId,
    name: "TechFlow AI",
    tagline: "AI-powered code generation for enterprise teams",
    logo: "\u{1F680}",
    category: "AI/ML",
    stage: "Seed",
    location: "San Francisco, CA",
    founded: "2024",
    raised: "$2M",
    traction: "$500K ARR",
    founder: {
      name: "Sarah Chen",
      title: "CEO & Co-founder",
      verified: true,
      bio: "Former engineering lead at Google. Stanford CS PhD."
    },
    description: "TechFlow AI is revolutionizing software development with intelligent code generation and automated testing. Our platform helps enterprise teams ship features 10x faster while maintaining code quality.",
    problem: "Developer productivity has plateaued despite advances in tooling. Teams spend 60% of time on repetitive tasks.",
    solution: "AI-powered code generation that understands your codebase, patterns, and business logic to automate repetitive work.",
    market: "The global developer tools market is $30B and growing at 15% annually. Our TAM is $10B in enterprise dev tools.",
    businessModel: "SaaS subscription model: $99/developer/month for teams of 5+. Enterprise plans start at $10K/year.",
    team: [
      { name: "Sarah Chen", role: "CEO", background: "Google, Stanford PhD" },
      { name: "Marcus Johnson", role: "CTO", background: "Meta, MIT" },
      { name: "Priya Patel", role: "Head of AI", background: "OpenAI, Berkeley" }
    ],
    metrics: {
      users: "2,000+",
      arr: "$500K",
      growth: "40% MoM",
      retention: "95%"
    }
  };
  const handleRequestAccess = () => {
    setShowRequestModal(true);
  };
  const confirmRequest = () => {
    setRequestSent(true);
    setShowRequestModal(false);
  };
  const handleUnlock = () => {
    setHasAccess(true);
  };
  return <div className="min-h-screen bg-black">
      {
    /* Navigation Bar */
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
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {
    /* Main Content */
  }
          <div className="lg:col-span-2 space-y-6">
            {
    /* Hero Section */
  }
            <Card className="bg-gradient-to-br from-[#06120b] to-[#0c0c0c] border-[#01F27B]/20 p-8">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-[#01F27B] rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
                  {deal.logo}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{deal.name}</h1>
                    <Badge className="bg-[#01F27B]/10 text-[#01F27B] border-[#01F27B]/20">
                      Verified
                    </Badge>
                  </div>
                  <p className="text-xl text-white/70 mb-4">{deal.tagline}</p>
                  <div className="flex flex-wrap gap-3">
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
                    <div className="flex items-center gap-1 text-sm text-white/60">
                      <Calendar className="w-3 h-3" />
                      Founded {deal.founded}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {
    /* Tabs */
  }
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-[#0c0c0c] border border-white/10 w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="traction">Traction</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <Card className="bg-[#0c0c0c] border-white/10 p-6">
                  <h3 className="text-xl font-semibold mb-4">About</h3>
                  <p className="text-white/70 leading-relaxed">{deal.description}</p>
                </Card>

                <Card className="bg-[#0c0c0c] border-white/10 p-6">
                  <h3 className="text-xl font-semibold mb-4">Problem</h3>
                  <p className="text-white/70 leading-relaxed">{deal.problem}</p>
                </Card>

                <Card className="bg-[#0c0c0c] border-white/10 p-6">
                  <h3 className="text-xl font-semibold mb-4">Solution</h3>
                  <p className="text-white/70 leading-relaxed">{deal.solution}</p>
                </Card>

                <Card className="bg-[#0c0c0c] border-white/10 p-6">
                  <h3 className="text-xl font-semibold mb-4">Market Opportunity</h3>
                  <p className="text-white/70 leading-relaxed">{deal.market}</p>
                </Card>

                <Card className="bg-[#0c0c0c] border-white/10 p-6">
                  <h3 className="text-xl font-semibold mb-4">Business Model</h3>
                  <p className="text-white/70 leading-relaxed">{deal.businessModel}</p>
                </Card>
              </TabsContent>

              <TabsContent value="traction" className="space-y-6 mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-[#01F27B]/10 via-[#0c0c0c] to-[#06120b] border-[#01F27B]/20 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#01F27B]/20 to-transparent rounded-full blur-2xl" />
                    <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-[#01F27B]" />
                      <span className="text-white/60">Users</span>
                    </div>
                    <div className="text-3xl font-bold">{deal.metrics.users}</div>
                    </div>
                  </Card>
                  <Card className="bg-gradient-to-br from-[#01F27B]/10 via-[#0c0c0c] to-[#06120b] border-[#01F27B]/20 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#01F27B]/20 to-transparent rounded-full blur-2xl" />
                    <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="w-5 h-5 text-[#01F27B]" />
                      <span className="text-white/60">ARR</span>
                    </div>
                    <div className="text-3xl font-bold">{deal.metrics.arr}</div>
                    </div>
                  </Card>
                  <Card className="bg-gradient-to-br from-[#01F27B]/10 via-[#0c0c0c] to-[#06120b] border-[#01F27B]/20 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#01F27B]/20 to-transparent rounded-full blur-2xl" />
                    <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-5 h-5 text-[#01F27B]" />
                      <span className="text-white/60">Growth</span>
                    </div>
                    <div className="text-3xl font-bold">{deal.metrics.growth}</div>
                    </div>
                  </Card>
                  <Card className="bg-gradient-to-br from-[#01F27B]/10 via-[#0c0c0c] to-[#06120b] border-[#01F27B]/20 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#01F27B]/20 to-transparent rounded-full blur-2xl" />
                    <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="w-5 h-5 text-[#01F27B]" />
                      <span className="text-white/60">Retention</span>
                    </div>
                    <div className="text-3xl font-bold">{deal.metrics.retention}</div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="team" className="space-y-4 mt-6">
                {deal.team.map((member, idx) => <Card key={idx} className="bg-[#0c0c0c] border-white/10 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#01F27B]/10 rounded-full flex items-center justify-center text-lg">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{member.name}</h4>
                        <p className="text-white/60 text-sm mb-2">{member.role}</p>
                        <p className="text-white/50 text-sm">{member.background}</p>
                      </div>
                    </div>
                  </Card>)}
              </TabsContent>

              <TabsContent value="documents" className="space-y-4 mt-6">
                {hasAccess ? <>
                    <Card className="bg-[#0c0c0c] border-white/10 p-6 hover:border-[#01F27B]/30 cursor-pointer transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Download className="w-5 h-5 text-[#01F27B]" />
                          <div>
                            <h4 className="font-semibold">Pitch Deck</h4>
                            <p className="text-sm text-white/60">Updated April 2026</p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-white/40" />
                      </div>
                    </Card>
                    <Card className="bg-[#0c0c0c] border-white/10 p-6 hover:border-[#01F27B]/30 cursor-pointer transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Download className="w-5 h-5 text-[#01F27B]" />
                          <div>
                            <h4 className="font-semibold">Financial Model</h4>
                            <p className="text-sm text-white/60">Q1 2026 projections</p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-white/40" />
                      </div>
                    </Card>
                  </> : <Card className="bg-[#0c0c0c] border-white/10 p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 backdrop-blur-sm bg-black/60" />
                    <div className="relative z-10">
                      <Lock className="w-12 h-12 text-[#01F27B] mx-auto mb-4" />
                      <h4 className="text-xl font-semibold mb-2">Premium Content Locked</h4>
                      <p className="text-white/60 mb-6">Request access to view pitch deck, financials, and data room</p>
                      <Button
    onClick={handleUnlock}
    className="bg-[#01F27B] hover:bg-[#01F27B]/90 text-black"
  >
                        Unlock Full Access
                      </Button>
                    </div>
                  </Card>}
              </TabsContent>
            </Tabs>
          </div>

          {
    /* Sticky Sidebar */
  }
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <Card className="bg-[#0c0c0c] border-white/10 p-6">
                <h3 className="font-semibold mb-4">Deal Information</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-white/60 mb-1">Total Raised</div>
                    <div className="text-lg font-semibold text-[#01F27B]">{deal.raised}</div>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <div className="text-sm text-white/60 mb-1">Current Traction</div>
                    <div className="text-lg font-semibold">{deal.traction}</div>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <div className="text-sm text-white/60 mb-1">Stage</div>
                    <Badge variant="outline" className="border-white/20">{deal.stage}</Badge>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#0c0c0c] border-white/10 p-6">
                <h3 className="font-semibold mb-4">Founder</h3>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#01F27B]/10 rounded-full flex items-center justify-center">
                    {deal.founder.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{deal.founder.name}</div>
                    <div className="text-sm text-white/60">{deal.founder.title}</div>
                  </div>
                </div>
                <p className="text-sm text-white/70">{deal.founder.bio}</p>
              </Card>

              <div className="space-y-3">
                {requestSent ? <div className="p-4 bg-[#01F27B]/10 border border-[#01F27B]/20 rounded-xl text-center">
                    <CheckCircle className="w-6 h-6 text-[#01F27B] mx-auto mb-2" />
                    <p className="text-sm text-[#01F27B]">Request sent! The founder will review it.</p>
                  </div> : <Button
    onClick={handleRequestAccess}
    className="w-full bg-[#01F27B] hover:bg-[#01F27B]/90 text-black h-12"
  >
                    Request Access
                  </Button>}
                <Button
    variant="outline"
    className="w-full border-white/20 hover:bg-white/5"
  >
                  Save Deal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {
    /* Request Access Modal */
  }
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="bg-[#0c0c0c] border-white/10">
          <DialogHeader>
            <DialogTitle>Request Access to {deal.name}</DialogTitle>
            <DialogDescription className="text-white/60">
              Send a connection request to the founder. They will review your profile and respond.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-[#01F27B]/10 border border-[#01F27B]/20 rounded-xl">
              <p className="text-sm text-white/80">
                Your investor profile will be shared with the founder, including your investment history and areas of interest.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
    variant="outline"
    onClick={() => setShowRequestModal(false)}
    className="flex-1 border-white/20"
  >
                Cancel
              </Button>
              <Button
    onClick={confirmRequest}
    className="flex-1 bg-[#01F27B] hover:bg-[#01F27B]/90 text-black"
  >
                Send Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
}
