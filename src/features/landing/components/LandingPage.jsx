import { ArrowRight, Rocket, Users, Shield, TrendingUp, CheckCircle, Star } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
export default function LandingPage({ onNavigate }) {
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
  return <div className="min-h-screen">
      {
    /* Navigation */
  }
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#01F27B] rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-semibold">BoostFundr</span>
          </div>
          <div className="flex gap-4">
            <Button
    variant="ghost"
    onClick={() => onNavigate("auth")}
    className="hover:bg-white/5"
  >
              Sign In
            </Button>
            <Button
    onClick={() => onNavigate("auth")}
    className="bg-[#01F27B] hover:bg-[#01F27B]/90 text-black"
  >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {
    /* Hero Section */
  }
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#06120b] via-black to-black" />
        <div
    className="absolute inset-0"
    style={{
      backgroundImage: `radial-gradient(circle at 50% 0%, rgba(1, 242, 123, 0.2), transparent 40%),
                             radial-gradient(circle at 80% 20%, rgba(1, 242, 123, 0.1), transparent 30%),
                             radial-gradient(circle at 20% 80%, rgba(1, 242, 123, 0.05), transparent 40%)`
    }}
  />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#01F27B]/10 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#01F27B]/10 border border-[#01F27B]/20 mb-8">
              <Star className="w-4 h-4 text-[#01F27B]" />
              <span className="text-sm text-[#01F27B]">Premium Startup Deal Platform</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Discover Private
              <span className="block text-[#01F27B]">Startup Deals</span>
            </h1>

            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Connect directly with founders. Access exclusive deal flow. Invest in the next generation of startups.
            </p>

            <div className="flex gap-4 justify-center">
              <Button
    size="lg"
    onClick={() => onNavigate("auth")}
    className="bg-gradient-to-r from-[#01F27B] to-[#00d66d] hover:from-[#01F27B]/90 hover:to-[#00d66d]/90 text-black text-lg px-8 h-14 shadow-[0_0_30px_rgba(1,242,123,0.3)] hover:shadow-[0_0_40px_rgba(1,242,123,0.4)] transition-all"
  >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
    size="lg"
    variant="outline"
    onClick={() => onNavigate("deal-feed")}
    className="border-white/20 hover:bg-white/5 text-lg px-8 h-14"
  >
                Explore Deals
              </Button>
            </div>
          </div>
        </div>
      </section>

      {
    /* Featured Deals */
  }
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Deals</h2>
            <p className="text-white/60">Hand-picked opportunities from verified founders</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredDeals.map((deal, idx) => <Card
    key={deal.id}
    className="bg-gradient-to-br from-[#0c0c0c] via-[#0c0c0c] to-[#06120b] border-white/10 p-6 hover:border-[#01F27B]/30 transition-all hover:scale-[1.02] cursor-pointer group relative overflow-hidden"
    onClick={() => onNavigate("deal-feed")}
  >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#01F27B]/5 to-transparent rounded-full blur-2xl" />
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
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#06120b]/50 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#01F27B]/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why BoostFundr?</h2>
            <p className="text-white/60">The premium platform for startup investment</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, idx) => <div
    key={idx}
    className="text-center p-6 rounded-2xl bg-gradient-to-b from-[#0c0c0c] to-black/40 border border-white/10 hover:border-[#01F27B]/30 transition-all hover:shadow-[0_0_30px_rgba(1,242,123,0.1)] relative group overflow-hidden"
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
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-[#01F27B]">For Investors</h3>
              <div className="space-y-4">
                {["Browse curated deals", "Request access to startups", "Connect with founders", "Make investments"].map((step, idx) => <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#01F27B] mt-1 flex-shrink-0" />
                    <span className="text-white/80">{step}</span>
                  </div>)}
              </div>
            </div>

            <div>
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
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#01F27B]/10 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="bg-gradient-to-br from-[#06120b] via-[#0c0c0c] to-black border border-[#01F27B]/30 rounded-3xl p-12 relative overflow-hidden shadow-[0_0_50px_rgba(1,242,123,0.1)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#01F27B]/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#01F27B]/5 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
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
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-white/40 text-sm">
          <p>© 2026 BoostFundr. Premium startup deal platform.</p>
        </div>
      </footer>
    </div>;
}
