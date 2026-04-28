import { useAuth } from "@/features/auth/hooks/useAuth";
import SiteFooter from "@/shared/components/SiteFooter";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { ArrowRight, CheckCircle, Rocket, Shield, TrendingUp, Users, Zap, ArrowUpRight } from "lucide-react";
import { useEffect } from "react";
export default function LandingPage({ onNavigate }) {
  const { isAuthenticated, role } = useAuth();
  const featuredDeals = [
    {
      id: 1,
      name: "TechFlow AI",
      category: "AI/ML",
      stage: "Seed",
      traction: "$500K ARR",
      description: "Building the future of autonomous coding"
    },
    {
      id: 2,
      name: "HealthSync",
      category: "HealthTech",
      stage: "Series A",
      traction: "100K users",
      description: "Revolutionizing healthcare data management"
    },
    {
      id: 3,
      name: "GreenCharge",
      category: "CleanTech",
      stage: "Pre-Seed",
      traction: "10 partnerships",
      description: "EV charging infrastructure at scale"
    }
  ];
  const features = [
    { icon: Shield, title: "Verified Founders", desc: "Every startup is vetted and verified" },
    { icon: TrendingUp, title: "Quality Deals", desc: "Curated high-potential opportunities" },
    { icon: Users, title: "Direct Access", desc: "Connect directly with founders" },
    { icon: Rocket, title: "Fast Process", desc: "Request and unlock deals instantly" }
  ];
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    if (!elements.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px"
    });
    elements.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  const handleScrollTo = sectionId => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const handleExploreDeals = () => {
    if (!isAuthenticated) {
      onNavigate("auth");
      return;
    }
    if (role === "founder") {
      onNavigate("founder-dashboard");
      return;
    }
    onNavigate("investor-dashboard");
  };
  return <div className="min-h-screen text-white bg-black scroll-smooth snap-y snap-mandatory">
      {
    /* Navigation */
  }
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#081b12]/90 via-black/70 to-[#0b1f14]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#01F27B] rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-black" />
            </div>
            <span className="text-sm sm:text-xl font-semibold">BoostFundr</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" className="hover:bg-white/5" onClick={() => handleScrollTo("hero")}
  >
              Home
            </Button>
            <Button variant="ghost" className="hover:bg-white/5" onClick={() => handleScrollTo("featured")}
  >
              Deals
            </Button>
            <Button variant="ghost" className="hover:bg-white/5" onClick={() => handleScrollTo("features")}
  >
              Why Us
            </Button>
            <Button variant="ghost" className="hover:bg-white/5" onClick={() => handleScrollTo("how")}
  >
              How It Works
            </Button>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
    variant="ghost"
    onClick={() => onNavigate("auth")}
    className="hidden sm:inline-flex hover:bg-white/5"
  >
              Sign In
            </Button>
            <Button
    onClick={() => onNavigate("auth")}
    className="bg-[#01F27B] hover:bg-[#01F27B]/90 text-black h-10 px-4 text-sm sm:h-11 sm:px-5 sm:text-base"
  >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {
    /* Hero Section */
  }
      <section id="hero" className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden snap-start flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c2014] via-black to-[#040806]" />
        <div
    className="absolute inset-0"
    style={{
      backgroundImage: `radial-gradient(circle at 50% 0%, rgba(1, 242, 123, 0.35), transparent 42%),
                             radial-gradient(circle at 85% 25%, rgba(1, 242, 123, 0.2), transparent 35%),
                             radial-gradient(circle at 15% 80%, rgba(1, 242, 123, 0.15), transparent 42%)`
    }}
  />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#01F27B]/20 via-transparent to-transparent" />
        <div className="absolute inset-0 noise-overlay opacity-30" />

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Column - Content */}
            <div className="text-left max-w-2xl">
              {/* Badge */}
              <div 
                data-reveal
                className="reveal inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[#01F27B] text-xs font-semibold tracking-wider mb-8"
                style={{ "--reveal-delay": "0ms" }}
              >
              </div>

              {/* Title */}
              <h1
                data-reveal
                className="reveal text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-bold mb-6 leading-[1.1] tracking-tight"
                style={{ "--reveal-delay": "100ms" }}
              >
                Discover startup<br className="hidden sm:block" /> opportunities.
                <span className="block text-[#01F27B]">Connect directly with<br className="hidden sm:block" /> founders.</span>
              </h1>

              {/* Description */}
              <p
                data-reveal
                className="reveal text-base sm:text-lg text-white/70 mb-10"
                style={{ "--reveal-delay": "200ms" }}
              >
                The private ecosystem where elite capital meets world-class innovation.<br className="hidden sm:block" /> Access pre-seed to Series B rounds before they hit the public market.
              </p>

              {/* Buttons */}
              <div
                data-reveal
                className="reveal flex flex-wrap gap-4 mb-16"
                style={{ "--reveal-delay": "300ms" }}
              >
                <Button
                  size="lg"
                  onClick={handleExploreDeals}
                  className="bg-[#01F27B] hover:bg-[#00d66d] text-black text-base px-6 sm:px-8 h-12 sm:h-14 font-semibold shadow-[0_0_20px_rgba(1,242,123,0.3)] transition-all rounded-lg"
                >
                  Explore Deals
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate("auth")}
                  className="border-white/10 bg-transparent hover:bg-white/5 text-white text-base px-6 sm:px-8 h-12 sm:h-14 font-semibold rounded-lg"
                >
                  Join as Investor
                </Button>
              </div>

              {/* Stats */}
              <div 
                data-reveal
                className="reveal flex items-center gap-8 text-left"
                style={{ "--reveal-delay": "400ms" }}
              >
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">$2.4B+</div>
                  <div className="text-sm text-white/50">Capital Deployed</div>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">450+</div>
                  <div className="text-sm text-white/50">Active Startups</div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual/Widgets */}
            <div 
              data-reveal
              className="reveal hidden lg:block relative"
              style={{ "--reveal-delay": "500ms" }}
            >
              <div className="relative w-full max-w-lg mx-auto mt-20">
                {/* EcoVolt Energy Card */}
                <Card className="absolute -right-8 -top-24 w-96 bg-[#0a120e] border-white/5 p-5 shadow-2xl z-0 transform rotate-2 rounded-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#01F27B]/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-[#01F27B]" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white/90 text-lg">EcoVolt Energy</div>
                      <div className="text-sm text-[#01F27B]">Series A • Sustainability</div>
                    </div>
                    <div className="text-xs font-bold bg-[#01F27B]/10 text-[#01F27B] px-3 py-1.5 rounded-full whitespace-nowrap">
                      75% RAISED
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-[#01F27B] w-[75%] rounded-full" />
                  </div>
                </Card>

                {/* Testimonial Card */}
                <Card className="relative z-10 w-full bg-[#0a120e]/90 border-white/5 p-6 shadow-2xl transform -translate-x-12 translate-y-8 backdrop-blur-md rounded-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden border border-white/10">
                      <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-medium text-white/90 flex items-center gap-1.5 text-lg">
                        Marcus Chen 
                        <CheckCircle className="w-4 h-4 text-[#01F27B]" />
                      </div>
                      <div className="text-sm text-white/50">CEO, AI-Core</div>
                    </div>
                  </div>
                  <p className="text-sm text-white/60 italic leading-relaxed">
                    "DealFlow Elite helped us close our bridge round in record time with strategic partners."
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {
    /* Featured Deals */
  }
      <section id="featured" className="min-h-[85vh] pt-28 pb-24 px-6 relative overflow-hidden snap-start">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a1b12] to-black" />
        <div className="absolute -top-32 right-0 w-[30rem] h-[30rem] bg-gradient-to-br from-[#01F27B]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-0 w-[26rem] h-[26rem] bg-gradient-to-tr from-[#01F27B]/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute inset-0 noise-overlay opacity-25" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 data-reveal className="reveal text-4xl font-bold mb-4 tracking-tight" style={{ "--reveal-delay": "0ms" }}>
              Featured Deals
            </h2>
            <p data-reveal className="reveal text-white/60" style={{ "--reveal-delay": "120ms" }}>
              Hand-picked opportunities from verified founders
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredDeals.map((deal, idx) => <Card
    key={deal.id}
    data-reveal
    className="reveal bg-gradient-to-br from-[#0b0f0d] via-[#0b0f0d] to-[#06120b] border-white/10 p-6 hover:border-[#01F27B]/30 transition-all hover:scale-[1.02] cursor-pointer group relative overflow-hidden shadow-[0_0_40px_rgba(1,242,123,0.05)]"
    style={{ "--reveal-delay": `${idx * 140}ms` }}
    onClick={() => onNavigate("deal-feed")}
  >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#01F27B]/10 to-transparent rounded-full blur-2xl" />
                <div className="absolute -bottom-16 -left-10 w-48 h-48 bg-gradient-to-tr from-[#01F27B]/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="px-3 py-1 rounded-full bg-[#01F27B]/10 text-[#01F27B] text-sm">
                    {deal.category}
                  </div>
                  <div className="text-white/60 text-sm">{deal.stage}</div>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-[#01F27B] transition-colors">
                  {deal.name}
                </h3>
                <p className="text-white/60 mb-4">{deal.description}</p>
                <div className="flex items-center gap-2 text-[#01F27B]">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">{deal.traction}</span>
                </div>
                </div>
              </Card>)}
          </div>
        </div>
      </section>

      {
    /* Features */
  }
      <section id="features" className="min-h-[85vh] pt-28 pb-24 px-6 relative overflow-hidden snap-start">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0b1f14] to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#01F27B]/15 via-transparent to-transparent" />
        <div className="absolute inset-0 noise-overlay opacity-25" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 data-reveal className="reveal text-4xl font-bold mb-4 tracking-tight" style={{ "--reveal-delay": "0ms" }}>
              Why BoostFundr?
            </h2>
            <p data-reveal className="reveal text-white/60" style={{ "--reveal-delay": "120ms" }}>
              The premium platform for startup investment
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, idx) => <div
    key={idx}
              data-reveal
              className="reveal text-center p-6 rounded-2xl bg-gradient-to-b from-[#0b0f0d] via-[#0a1410] to-black/60 border border-white/10 hover:border-[#01F27B]/30 transition-all hover:shadow-[0_0_30px_rgba(1,242,123,0.12)] relative group overflow-hidden"
              style={{ "--reveal-delay": `${idx * 120}ms` }}
  >
                <div className="absolute inset-0 bg-gradient-to-br from-[#01F27B]/0 to-[#01F27B]/0 group-hover:from-[#01F27B]/5 group-hover:to-transparent transition-all duration-500" />
                <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-[#01F27B]/20 to-[#01F27B]/5 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-[0_0_20px_rgba(1,242,123,0.3)] transition-all">
                  <feature.icon className="w-6 h-6 text-[#01F27B]" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-white/60">{feature.desc}</p>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {
    /* How It Works */
  }
      <section id="how" className="min-h-[85vh] pt-28 pb-24 px-6 relative overflow-hidden snap-start">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a1a12] to-black" />
        <div className="absolute -top-24 left-10 w-64 h-64 bg-gradient-to-br from-[#01F27B]/18 to-transparent rounded-full blur-3xl" />
        <div className="absolute inset-0 noise-overlay opacity-25" />
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 data-reveal className="reveal text-4xl font-bold mb-4 tracking-tight" style={{ "--reveal-delay": "0ms" }}>
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div
              data-reveal
              className="reveal rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b0f0d] via-[#0a1410] to-black/70 p-8 shadow-[0_0_30px_rgba(1,242,123,0.06)]"
              style={{ "--reveal-delay": "0ms" }}
            >
              <h3 className="text-2xl font-semibold mb-6 text-[#01F27B]">For Investors</h3>
              <div className="space-y-4">
                {["Browse curated deals", "Request access to startups", "Connect with founders", "Make investments"].map((step, idx) => <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#01F27B] mt-1 flex-shrink-0" />
                    <span className="text-white/80">{step}</span>
                  </div>)}
              </div>
            </div>

            <div
              data-reveal
              className="reveal rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b0f0d] via-[#0a1410] to-black/70 p-8 shadow-[0_0_30px_rgba(1,242,123,0.06)]"
              style={{ "--reveal-delay": "140ms" }}
            >
              <h3 className="text-2xl font-semibold mb-6 text-[#01F27B]">For Founders</h3>
              <div className="space-y-4">
                {["Create startup profile", "Upload pitch materials", "Manage investor requests", "Close deals faster"].map((step, idx) => <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#01F27B] mt-1 flex-shrink-0" />
                    <span className="text-white/80">{step}</span>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {
    /* CTA */
  }
      <section id="cta" className="min-h-[85vh] pt-28 pb-24 px-6 relative overflow-hidden snap-start">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0b1f14] to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#01F27B]/20 via-transparent to-transparent" />
        <div className="absolute inset-0 noise-overlay opacity-30" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div
            data-reveal
            className="reveal bg-gradient-to-br from-[#06120b] via-[#0c0c0c] to-black border border-[#01F27B]/30 rounded-3xl p-12 relative overflow-hidden shadow-[0_0_50px_rgba(1,242,123,0.1)]"
            style={{ "--reveal-delay": "0ms" }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#01F27B]/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#01F27B]/5 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Ready to Get Started?</h2>
            <p className="text-white/70 mb-8 text-lg">
              Join thousands of investors and founders building the future
            </p>
            <Button
    size="lg"
    onClick={() => onNavigate("auth")}
    className="bg-gradient-to-r from-[#01F27B] to-[#00d66d] hover:from-[#01F27B]/90 hover:to-[#00d66d]/90 text-black text-lg px-8 h-14 shadow-[0_0_30px_rgba(1,242,123,0.4)] hover:shadow-[0_0_50px_rgba(1,242,123,0.5)] transition-all"
  >
              Create Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            </div>
          </div>
        </div>
      </section>

      {
    /* Footer */
  }
      <SiteFooter
        onNavigate={onNavigate}
        onScrollTo={handleScrollTo}
        onLinkAction={(link) => {
          if (link.type === "route" && link.target === "deal-feed") {
            handleExploreDeals();
            return true;
          }
          return false;
        }}
      />
    </div>;
}
