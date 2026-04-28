import { Rocket } from "lucide-react";

const defaultSections = [
  {
    title: "Explore",
    links: [
      { label: "Featured Deals", type: "scroll", target: "featured" },
      { label: "Why BoostFundr", type: "scroll", target: "features" },
      { label: "How It Works", type: "scroll", target: "how" }
    ]
  },
  {
    title: "Get Started",
    links: [
      { label: "Create Account", type: "route", target: "auth" },
      { label: "Sign In", type: "route", target: "auth" },
      { label: "Explore Deals", type: "route", target: "deal-feed" }
    ]
  }
];

export default function SiteFooter({
  brand = "BoostFundr",
  year = "2026",
  onNavigate,
  onScrollTo,
  onLinkAction,
  sections = defaultSections
}) {
  const handleLinkClick = link => {
    if (onLinkAction && onLinkAction(link)) {
      return;
    }
    if (link.type === "scroll") {
      if (onScrollTo) {
        onScrollTo(link.target);
        return;
      }
      const fallbackTarget = document.getElementById(link.target);
      if (fallbackTarget) {
        fallbackTarget.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }
    if (link.type === "route" && onNavigate) {
      onNavigate(link.target);
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-br from-black via-[#08140e] to-black">
      <div className="absolute inset-0 noise-overlay opacity-25" />
      <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-gradient-to-br from-[#01F27B]/20 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-gradient-to-tr from-[#01F27B]/15 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#01F27B]">
                <Rocket className="h-5 w-5 text-black" />
              </div>
              <div>
                <p className="text-xl font-semibold">{brand}</p>
                <p className="text-sm text-white/50">Premium startup deal platform</p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-white/60">
              Built for investors and founders who want faster access to high-quality
              private market opportunities.
            </p>
          </div>

          {sections.map(section => (
            <div key={section.title}>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/40">
                {section.title}
              </p>
              <div className="space-y-3">
                {section.links.map(link => (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => handleLinkClick(link)}
                    className="block text-left text-white/70 transition hover:text-[#01F27B]"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
          <span>
            (c) {year} {brand}. All rights reserved.
          </span>
          <span>Crafted for private market deal flow.</span>
        </div>
      </div>
    </footer>
  );
}
