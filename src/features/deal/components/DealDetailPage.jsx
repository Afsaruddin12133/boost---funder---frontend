import { useState } from "react";
import {
  ArrowLeft, Lock, Download, ExternalLink, Users,
  TrendingUp, MapPin, DollarSign, CheckCircle, FileText
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
import { getStatusMeta, formatCurrency } from "../utils/dealUtils";

export default function DealDetailPage({ deal, onBack, userRole }) {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [hasAccess, setHasAccess] = useState(userRole === "founder");
  const [requestSent, setRequestSent] = useState(false);

  if (!deal) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-white/60">No deal data available.</p>
      </div>
    );
  }

  // Safely extract nested schema properties
  const basicInfo    = deal.basicInfo    || {};
  const story        = deal.story        || {};
  const execution    = deal.execution    || {};
  const funding      = deal.funding      || {};
  const documents    = deal.documents    || {};

  const name     = basicInfo.startupName || "Untitled Deal";
  const tagline  = basicInfo.tagline     || "";
  const category = basicInfo.category   || "—";
  const stage    = basicInfo.stage      || "—";
  const location = basicInfo.location   || "—";
  const website  = basicInfo.startupWebsite || null;

  const problem       = story.problem      || "—";
  const solution      = story.solution     || "—";
  const market        = story.targetMarket || "—";
  const whyNow        = story.whyNow       || "—";
  const vision        = story.vision       || null;

  const businessModel = execution.businessModel || "—";
  const goToMarket    = execution.goToMarket    || "—";
  const advantage     = execution.advantage     || "—";
  const topCompetitor = execution.topCompetitor || "—";
  const team          = execution.team          || [];
  const useOfFunds    = execution.useOfFunds    || [];

  const raised  = funding.raisedAmount      || 0;
  const goal    = funding.goalAmount        || 0;
  const minInvest = funding.minimumInvestment || 0;
  const deadline  = funding.deadline        || null;

  const metrics = {
    users:  execution.users   || funding.users  || "—",
    arr:    execution.revenue || "—",
    growth: execution.growthRate || funding.growthRate || "—",
  };

  const statusMeta   = getStatusMeta(deal.status);
  const profileScore = deal.profileCompletionScore || 0;
  const verified     = deal.verificationBadge?.isVerified || false;

  const docLabels = {
    pitchDeck:               "Pitch Deck",
    safeAgreement:           "SAFE Agreement",
    termSheet:               "Term Sheet",
    registrationCertificate: "Registration Certificate",
    tradeLicense:            "Trade License",
    balanceSheet:            "Balance Sheet",
    revenueProof:            "Revenue Proof",
    capTable:                "Cap Table",
    shareholderAgreement:    "Shareholder Agreement",
  };

  return (
    <div className="space-y-6">
      {/* Back Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="border border-white/10 hover:bg-white/5 text-white/70 hover:text-white rounded-xl"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-white/50 text-sm">{tagline || `${category} · ${stage}`}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Badge className={`border ${statusMeta.className}`}>{statusMeta.label}</Badge>
          {verified && (
            <Badge className="bg-[#01F27B]/10 text-[#01F27B] border-[#01F27B]/20">Verified</Badge>
          )}
        </div>
      </div>

      {/* Hero Card */}
      <Card className="bg-gradient-to-br from-[#06120b] to-[#0c0c0c] border-[#01F27B]/20 p-6 md:p-8">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-black/60 border border-white/10 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 overflow-hidden">
            {basicInfo.startupLogo
              ? <img src={basicInfo.startupLogo} alt={name} className="w-full h-full object-cover" />
              : "🚀"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="border-white/20">{category}</Badge>
              <Badge variant="outline" className="border-white/20">{stage}</Badge>
              {location !== "—" && (
                <span className="flex items-center gap-1 text-xs text-white/50">
                  <MapPin className="w-3 h-3" />{location}
                </span>
              )}
              {website && (
                <a href={website} target="_blank" rel="noreferrer"
                  className="text-xs text-[#01F27B] hover:underline flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" /> Website
                </a>
              )}
            </div>

            {/* Profile Completion */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#01F27B] rounded-full transition-all duration-700"
                  style={{ width: `${profileScore}%` }}
                />
              </div>
              <span className="text-xs text-[#01F27B] font-semibold min-w-[36px]">{profileScore}%</span>
              <span className="text-xs text-white/40">Profile Complete</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Funding Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Raised", value: formatCurrency(raised), icon: DollarSign },
          { label: "Goal",   value: formatCurrency(goal),   icon: TrendingUp },
          { label: "Min. Investment", value: formatCurrency(minInvest), icon: CheckCircle },
          { label: "Deadline", value: deadline ? new Date(deadline).toLocaleDateString("en-US", { month:"short", day:"2-digit", year:"numeric" }) : "—", icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="bg-[#0c0c0c] border-white/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-[#01F27B]" />
              <span className="text-xs text-white/50">{label}</span>
            </div>
            <p className="text-lg font-semibold text-white">{value}</p>
          </Card>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-[#0c0c0c] border border-white/10 w-full justify-start flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="execution">Execution</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4 mt-6">
          {[
            { title: "The Problem",     body: problem  },
            { title: "The Solution",    body: solution },
            { title: "Target Market",   body: market   },
            { title: "Why Now?",        body: whyNow   },
            ...(vision ? [{ title: "Long-term Vision", body: vision }] : []),
            { title: "Business Model",  body: businessModel },
          ].map(({ title, body }) => (
            <Card key={title} className="bg-[#0c0c0c] border-white/10 p-5">
              <h3 className="text-sm font-semibold text-[#01F27B] mb-2">{title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{body}</p>
            </Card>
          ))}
        </TabsContent>

        {/* Execution */}
        <TabsContent value="execution" className="space-y-4 mt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: "Users / Customers", value: metrics.users,  icon: Users      },
              { label: "Current ARR / Revenue", value: typeof metrics.arr === "number" ? formatCurrency(metrics.arr) : metrics.arr, icon: DollarSign },
              { label: "Growth Rate (MoM)",  value: metrics.growth !== "—" ? `${metrics.growth}%` : "—", icon: TrendingUp },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label} className="bg-gradient-to-br from-[#01F27B]/10 to-[#0c0c0c] border-[#01F27B]/20 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-[#01F27B]" />
                  <span className="text-xs text-white/60">{label}</span>
                </div>
                <p className="text-2xl font-bold">{value}</p>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: "Go-to-Market Strategy", value: goToMarket    },
              { label: "Unfair Advantage",       value: advantage     },
              { label: "Top Competitor",         value: topCompetitor },
            ].map(({ label, value }) => (
              <Card key={label} className="bg-[#0c0c0c] border-white/10 p-5">
                <h4 className="text-xs text-white/50 mb-1">{label}</h4>
                <p className="text-white/80 text-sm">{value}</p>
              </Card>
            ))}
          </div>

          {useOfFunds.length > 0 && (
            <Card className="bg-[#0c0c0c] border-white/10 p-5">
              <h4 className="text-sm font-semibold text-[#01F27B] mb-4">Use of Funds</h4>
              <div className="space-y-4">
                {useOfFunds.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-white/70">{item.category || `Allocation ${i + 1}`}</span>
                      <span className="text-xs font-semibold text-[#01F27B]">{item.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#01F27B] to-[#01F27B]/70 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Team */}
        <TabsContent value="team" className="space-y-4 mt-6">
          {team.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {team.map((member, idx) => (
                <Card key={idx} className="bg-[#0c0c0c] border-white/10 p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#01F27B]/10 rounded-full flex items-center justify-center font-bold text-[#01F27B] text-lg shrink-0">
                      {member.name?.charAt(0)?.toUpperCase() || (idx + 1)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{member.name || "Unnamed Member"}</h4>
                      <p className="text-sm text-white/50 mt-0.5">{member.role || "Team Member"}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-[#0c0c0c] border-white/10 p-8 text-center">
              <p className="text-white/40 text-sm">No team members added yet.</p>
            </Card>
          )}
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" className="mt-6">
          {hasAccess ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(documents).map(([key, url]) => {
                if (!url) return null;
                const label = docLabels[key] || key;
                return (
                  <Card
                    key={key}
                    onClick={() => window.open(url, "_blank")}
                    className="bg-[#0c0c0c] border-white/10 p-5 hover:border-[#01F27B]/40 cursor-pointer transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#01F27B]/10 rounded-lg flex items-center justify-center group-hover:bg-[#01F27B]/20 transition-all">
                        <FileText className="w-5 h-5 text-[#01F27B]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{label}</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider">PDF · Click to open</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-[#01F27B] transition-all" />
                  </Card>
                );
              })}
              {Object.keys(documents).length === 0 && (
                <p className="text-white/40 text-sm col-span-2">No documents uploaded yet.</p>
              )}
            </div>
          ) : (
            <Card className="bg-[#0c0c0c] border-white/10 p-10 text-center">
              <Lock className="w-12 h-12 text-[#01F27B] mx-auto mb-4 opacity-60" />
              <h4 className="text-lg font-semibold mb-2">Documents Locked</h4>
              <p className="text-white/50 text-sm mb-6">Request access to view the data room documents.</p>
              {requestSent ? (
                <div className="flex items-center justify-center gap-2 text-[#01F27B]">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Request sent! Awaiting founder approval.</span>
                </div>
              ) : (
                <Button
                  onClick={() => setShowRequestModal(true)}
                  className="bg-[#01F27B] hover:bg-[#01F27B]/90 text-black font-semibold"
                >
                  Request Access
                </Button>
              )}
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Request Access Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="bg-[#0c0c0c] border-white/10">
          <DialogHeader>
            <DialogTitle>Request Access to {name}</DialogTitle>
            <DialogDescription className="text-white/60">
              Your investor profile will be shared with the founder for review.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowRequestModal(false)} className="flex-1 border-white/20">
              Cancel
            </Button>
            <Button
              onClick={() => { setRequestSent(true); setShowRequestModal(false); }}
              className="flex-1 bg-[#01F27B] hover:bg-[#01F27B]/90 text-black"
            >
              Send Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
