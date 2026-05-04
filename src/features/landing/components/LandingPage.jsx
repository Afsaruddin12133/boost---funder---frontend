import { useAuth } from "@/features/auth/hooks/useAuth";
import { featuredDeals, features } from "@/features/landing/data/landingData";
import { formatCurrency, getProgress, handleScrollTo } from "@/features/landing/utils/landingUtils";
import SiteFooter from "@/shared/components/SiteFooter";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { ArrowRight, ArrowUpRight, CheckCircle, Rocket, Zap } from "lucide-react";
import { useEffect } from "react";
import Logo from "@/shared/components/Logo";
export default function LandingPage({ onNavigate }) {
  
  const { isAuthenticated, role } = useAuth();

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
    <nav className="fixed top-0 left-0 right-0 z-50 
  bg-black/70 backdrop-blur-xl 
  border-b border-white/12">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center">
          <Logo size="md" className="cursor-pointer" />
        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-6">

          {[
            { label: "Home", id: "hero" },
            { label: "Deals", id: "featured" },
            { label: "Why Us", id: "features" },
            { label: "How It Works", id: "how" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleScrollTo(item.id)}
              className="
            relative text-sm font-medium text-white/70 
            transition-all duration-300

            hover:text-white

            after:absolute after:left-0 after:-bottom-1 
            after:h-[2px] after:w-0 
            after:bg-[#01F27B] 
            after:transition-all after:duration-300

            hover:after:w-full
          "
            >
              {item.label}
            </button>
          ))}

        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">

          <Button
            variant="ghost"
            onClick={() => onNavigate("auth")}
            className="
          hidden sm:inline-flex 
          text-white/70 
          hover:text-white 
          hover:bg-white/5 
          transition-all
        "
          >
            Sign In
          </Button>

          <Button
            onClick={() => onNavigate("auth")}
            className="
          bg-[#01F27B] 
          hover:bg-[#01F27B]/90 
          text-black 
          font-semibold 
          h-10 px-5 rounded-lg
          shadow-[0_0_15px_rgba(1,242,123,0.3)]
          transition-all duration-300
        "
          >
            Get Started
          </Button>

        </div>
      </div>
    </nav>

    {
      /* Hero Section */
    }
    <section id="hero" className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden flex items-center">
      {/* Flowing Gradient: Top to Bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c2014] via-black to-[#0a1b12] pointer-events-none" />
      {/* Hero center glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vh] bg-[#01F27B]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Column - Content */}
          <div className="text-left max-w-2xl">

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
                className="
                  border-white/20 
                  bg-white/5 
                  text-white 
                  text-base 
                  px-6 sm:px-8 
                  h-12 sm:h-14 
                  font-semibold 
                  rounded-lg 
                  backdrop-blur-md
                  transition-all duration-300
                  hover:bg-gradient-to-r 
                  hover:from-[#01F27B]/10 
                  hover:to-transparent 
                  hover:border-[#01F27B]/40 
                  hover:text-[#01F27B]
                "
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
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">$1.4B+</div>
                <div className="text-sm text-white/50">Capital Deployed</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">150+</div>
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
                    <div className="text-sm text-[#01F27B]">MVP • Sustainability</div>
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
                  "BoostFundr helped us close our bridge round in record time with strategic partners."
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
    <section id="featured" className="min-h-[85vh] pt-28 pb-24 px-6 relative overflow-hidden">
      {/* Flowing Gradient: Connects from Hero to Features */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1b12] via-[#060f0a] to-[#0b1f14] pointer-events-none" />

      {/* Ambient orbs */}
      <div className="absolute -top-48 right-0 w-[50rem] h-[50rem] bg-[#01F27B]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 left-0 w-[35rem] h-[35rem] bg-[#01F27B]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 data-reveal className="reveal text-4xl font-bold mb-4 tracking-tight" style={{ "--reveal-delay": "0ms" }}>
            Featured Deals
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 lg:gap-18 gap-8">

          {featuredDeals.map((deal, idx) => (
            <Card
              key={deal.id}
              data-reveal
              onClick={() => {
                if (!isAuthenticated) {
                  onNavigate('auth');
                } else if (role === 'investor') {
                  onNavigate('investor-dashboard');
                } else if (role === 'founder') {
                  onNavigate('founder-dashboard');
                } else {
                  onNavigate('dashboard');
                }
              }}
              className="
                  reveal group cursor-pointer relative overflow-hidden flex flex-col h-full
                  bg-white/5 backdrop-blur-xl border border-white/10
                  p-5 rounded-xl
                  transition-all duration-500 ease-in-out
                  hover:scale-105 hover:border-[#01F27B]/40 hover:bg-white/10 hover:-translate-y-2
                  shadow-xl lg:mt-8"
              style={{ "--reveal-delay": `${idx * 120}ms` }}
            >
              {/* Glow */}
              <div className="absolute -top-10 right-0 w-32 h-32 bg-[#01F27B]/10 blur-2xl rounded-full pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full">

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={deal.startupLogo}
                    alt={deal.startupName}
                    className="w-12 h-12 rounded-lg object-cover border border-white/10"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg leading-tight group-hover:text-[#01F27B] transition">
                      {deal.startupName}
                    </h3>
                    <p className="text-xs text-white/50">{deal.category}</p>
                  </div>

                  {/* Verified */}
                  {deal.verificationBadge?.isVerified && (
                    <div className="text-xs px-2 py-1 rounded-full bg-[#01F27B]/10 text-[#01F27B]">
                      ✔ Verified
                    </div>
                  )}
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>{formatCurrency(deal.raisedAmount)}</span>
                    <span>{formatCurrency(deal.goalAmount)}</span>
                  </div>

                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#01F27B] transition-all duration-500"
                      style={{ width: `${getProgress(deal.raisedAmount, deal.goalAmount)}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center text-xs text-white/60">
                  <span>
                    Ends:{" "}
                    {new Date(deal.deadline).toLocaleDateString()}
                  </span>

                  <span className="text-[#01F27B] font-medium">
                    {getProgress(deal.raisedAmount, deal.goalAmount).toFixed(0)}%
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {
      /* Features */
    }
    <section id="features" className="min-h-[85vh] pt-28 pb-24 px-6 relative overflow-hidden lg: min-h-[25vh]">
      {/* Flowing Gradient: Connects from Featured to How It Works */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1f14] via-[#051009] to-[#0a1a12] pointer-events-none" />

      {/* Central glow for features section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-[#01F27B]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 lg:mt-8">
          <h2 data-reveal className="reveal text-4xl font-bold mb-4 tracking-tight" style={{ "--reveal-delay": "0ms" }}>
            Why BoostFundr?
          </h2>
          <p data-reveal className="reveal text-white/60" style={{ "--reveal-delay": "120ms" }}>
            The premium platform for startup investment
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 lg: mt-22 lg:gap-8">
          {features.map((feature, idx) => <div
            key={idx}
            data-reveal
            className="reveal text-center p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#01F27B]/40 hover:bg-white/10 transition-all duration-300 relative group overflow-hidden shadow-xl"
            style={{ "--reveal-delay": `${idx * 120}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#01F27B]/0 to-transparent group-hover:from-[#01F27B]/10 transition-all duration-500 pointer-events-none" />
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
    <section id="how" className="min-h-[85vh] pt-28 pb-24 px-6 relative overflow-hidden">
      {/* Flowing Gradient: Connects from Features to CTA */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a12] via-[#030906] to-[#0b1f14] pointer-events-none" />

      {/* Side glow for How it Works */}
      <div className="absolute top-1/4 -left-20 w-[40vw] h-[40vw] bg-[#01F27B]/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 lg:mt-8">
          <h2 data-reveal className="reveal text-4xl font-bold mb-4 tracking-tight" style={{ "--reveal-delay": "0ms" }}>
            How It Works
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-18 lg:mt-28  lg:gap-36">
          <div
            data-reveal
            className="reveal rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 sm:p-12 shadow-2xl hover:border-white/20 transition-all"
            style={{ "--reveal-delay": "0ms" }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-[#01F27B]">For Investors</h3>
            <div className="space-y-4">
              {["Browse curated deals", "See details of the startups", "Connect with founders", "Make investments"].map((step, idx) => <div key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#01F27B] mt-1 flex-shrink-0" />
                <span className="text-white/80">{step}</span>
              </div>)}
            </div>
          </div>

          <div
            data-reveal
            className="reveal rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 sm:p-12 shadow-2xl hover:border-white/20 transition-all"
            style={{ "--reveal-delay": "140ms" }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-[#01F27B]">For Founders</h3>
            <div className="space-y-4">
              {["Create startup profile", "Upload pitch materials", "Knock from investors", "Close deals faster"].map((step, idx) => <div key={idx} className="flex items-start gap-3">
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
    <section id="cta" className="min-h-[70vh] pt-28 pb-32 px-6 relative overflow-hidden flex items-center">
      {/* Flowing Gradient: Connects from How It Works to Footer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1f14] via-[#07140b] to-black pointer-events-none" />

      {/* Bottom massive glow */}
      <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] bg-[#01F27B]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div
          data-reveal
          className="reveal bg-white/5 backdrop-blur-2xl border border-[#01F27B]/30 rounded-[3rem] p-12 sm:p-16 relative overflow-hidden shadow-[0_0_80px_rgba(1,242,123,0.15)]"
          style={{ "--reveal-delay": "0ms" }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#01F27B]/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#01F27B]/10 rounded-full blur-[80px] pointer-events-none" />
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
