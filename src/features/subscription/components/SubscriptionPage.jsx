import { Check, ArrowLeft, Rocket, LogOut, Sparkles, Zap, Crown } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
export default function SubscriptionPage({ onNavigate, userRole, onLogout }) {
  const investorPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      icon: Rocket,
      description: "Get started with basic access",
      features: [
        "Browse all deals",
        "Save up to 5 deals",
        "Basic filters",
        "Email notifications"
      ],
      limitations: [
        "No direct founder access",
        "Limited deal details"
      ]
    },
    {
      name: "Pro",
      price: "$99",
      period: "per month",
      icon: Zap,
      description: "For active investors",
      features: [
        "Everything in Free",
        "Unlimited saved deals",
        "Request access to founders",
        "Full deal details",
        "Advanced filters",
        "Priority support",
        "Analytics dashboard"
      ],
      popular: true
    },
    {
      name: "Elite",
      price: "$299",
      period: "per month",
      icon: Crown,
      description: "For power investors",
      features: [
        "Everything in Pro",
        "Unlimited deal unlocks",
        "Direct founder messages",
        "Early access to deals",
        "Investment pipeline tracking",
        "Dedicated account manager",
        "Quarterly market reports"
      ]
    }
  ];
  const founderPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      icon: Rocket,
      description: "List your startup",
      features: [
        "Create startup profile",
        "Basic visibility",
        "Receive investor requests",
        "Up to 3 team members"
      ]
    },
    {
      name: "Boost",
      price: "$149",
      period: "per month",
      icon: Zap,
      description: "Increase visibility",
      features: [
        "Everything in Free",
        "Featured in search results",
        "Advanced analytics",
        "Unlimited team members",
        "Investor insights",
        "Priority verification"
      ],
      popular: true
    },
    {
      name: "Scale",
      price: "$299",
      period: "per month",
      icon: Sparkles,
      description: "Maximum exposure",
      features: [
        "Everything in Boost",
        "Homepage featured spot",
        "Dedicated support",
        "Custom deal room",
        "Investor targeting",
        "Campaign management"
      ]
    },
    {
      name: "Raise Pro",
      price: "$499",
      period: "per month",
      icon: Crown,
      description: "Active fundraising",
      features: [
        "Everything in Scale",
        "Dedicated success manager",
        "Investor introductions",
        "Pitch deck review",
        "Data room hosting",
        "Deal closing support"
      ]
    }
  ];
  const plans = userRole === "investor" ? investorPlans : founderPlans;
  return <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#01F27B]/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10">
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

      <div className="max-w-7xl mx-auto px-6 py-12">
        {
    /* Header */
  }
        <div className="text-center mb-12">
          <Badge className="bg-[#01F27B]/10 text-[#01F27B] border-[#01F27B]/20 mb-4">
            {userRole === "investor" ? "Investor" : "Founder"} Plans
          </Badge>
          <h1 className="text-5xl font-bold mb-4">
            Choose Your <span className="text-[#01F27B]">Plan</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            {userRole === "investor" ? "Get access to exclusive deals and connect with verified founders" : "Showcase your startup and connect with serious investors"}
          </p>
        </div>

        {
    /* Pricing Cards */
  }
        <div className={`grid ${plans.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3"} gap-6 mb-12`}>
          {plans.map((plan, idx) => <Card
    key={idx}
    className={`border p-8 transition-all hover:scale-[1.02] relative overflow-hidden ${plan.popular ? "border-[#01F27B] bg-gradient-to-b from-[#01F27B]/15 via-[#0c0c0c] to-[#06120b] shadow-[0_0_40px_rgba(1,242,123,0.2)]" : "bg-gradient-to-b from-[#0c0c0c] to-[#06120b] border-white/10 hover:border-[#01F27B]/30 hover:shadow-[0_0_30px_rgba(1,242,123,0.1)]"}`}
  >
              {plan.popular && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#01F27B] to-transparent" />}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#01F27B]/10 to-transparent rounded-full blur-2xl" />
              <div className="relative z-10">
              {plan.popular && <div className="absolute -top-11 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[#01F27B] text-black border-[#01F27B]">
                    Most Popular
                  </Badge>
                </div>}

              <div className="mb-6">
                <div className="w-12 h-12 bg-[#01F27B]/10 rounded-xl flex items-center justify-center mb-4">
                  <plan.icon className="w-6 h-6 text-[#01F27B]" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-white/60 text-sm mb-4">{plan.description}</p>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-white/60 ml-2">/{plan.period}</span>
                </div>
              </div>

              <Button
    className={`w-full mb-6 ${plan.popular ? "bg-[#01F27B] hover:bg-[#01F27B]/90 text-black" : "border-white/20 hover:bg-white/5"}`}
    variant={plan.popular ? "default" : "outline"}
  >
                {plan.name === "Free" ? "Current Plan" : "Upgrade"}
              </Button>

              <div className="space-y-3">
                {plan.features.map((feature, fidx) => <div key={fidx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#01F27B] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80">{feature}</span>
                  </div>)}
                {plan.limitations?.map((limitation, lidx) => <div key={lidx} className="flex items-start gap-3 opacity-50">
                    <span className="text-white/40 text-sm">✗</span>
                    <span className="text-sm text-white/60 line-through">{limitation}</span>
                  </div>)}
              </div>
              </div>
            </Card>)}
        </div>

        {
    /* Features Comparison */
  }
        <Card className="bg-[#0c0c0c] border-white/10 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">All Plans Include</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-[#01F27B]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-[#01F27B]" />
              </div>
              <h3 className="font-semibold mb-2">Verified Users</h3>
              <p className="text-sm text-white/60">All profiles are verified and vetted</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-[#01F27B]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-[#01F27B]" />
              </div>
              <h3 className="font-semibold mb-2">Secure Platform</h3>
              <p className="text-sm text-white/60">Enterprise-grade security and privacy</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-[#01F27B]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-[#01F27B]" />
              </div>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-sm text-white/60">Get help whenever you need it</p>
            </div>
          </div>
        </Card>

        {
    /* CTA */
  }
        <div className="text-center mt-12">
          <p className="text-white/60 mb-6">
            Not sure which plan is right for you?
          </p>
          <Button
    variant="outline"
    className="border-white/20 hover:bg-white/5"
  >
            Contact Sales
          </Button>
        </div>
      </div>
      </div>
    </div>;
}
