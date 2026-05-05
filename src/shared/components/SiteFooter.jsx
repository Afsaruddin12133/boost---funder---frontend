import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  ShieldCheck, 
  CreditCard,
  Lock,
  Download,
  Apple,
  Play
} from "lucide-react";
import Logo from "./Logo";

const SiteFooter = ({
  brand = "BoostFundr",
  year = "2026",
  onNavigate,
  onScrollTo,
  onLinkAction,
}) => {
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

  const sections = [
    {
      title: "Platform",
      links: [
        { label: "Featured Deals", type: "scroll", target: "featured" },
        { label: "Why BoostFundr", type: "scroll", target: "features" },
        { label: "How It Works", type: "scroll", target: "how" },
        { label: "Explore Market", type: "route", target: "deal-feed" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "About Us", type: "route", target: "about" },
        { label: "Privacy Policy", type: "route", target: "privacy" },
        { label: "Terms & Conditions", type: "route", target: "terms" },
        { label: "Disclaimer", type: "route", target: "disclaimer" }
      ]
    }
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#020804]">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
      <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-gradient-to-br from-[#01F27B]/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-gradient-to-tr from-[#01F27B]/10 to-transparent blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-12">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.5fr]">
          
          {/* Column 1: Brand & Social */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Logo size="md" className="-ml-4" animated={false} />
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                The elite ecosystem where world-class innovation meets strategic capital. Empowering the next generation of global founders.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-black text-[#01F27B] uppercase tracking-[0.2em]">Connect With Us</p>
              <div className="flex gap-4">
                {[
                  { icon: Facebook, href: "#" },
                  { icon: Twitter, href: "#" },
                  { icon: Linkedin, href: "#" },
                  { icon: Instagram, href: "#" }
                ].map((social, i) => (
                  <a key={i} href={social.href} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#01F27B] hover:border-[#01F27B]/40 hover:bg-[#01F27B]/10 transition-all duration-300">
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2 & 3: Links */}
          {sections.map(section => (
            <div key={section.title} className="space-y-6">
              <p className="text-sm font-black text-white uppercase tracking-[0.2em]">
                {section.title}
              </p>
              <div className="flex flex-col gap-4">
                {section.links.map(link => (
                  <button
                    key={link.label}
                    onClick={() => handleLinkClick(link)}
                    className="text-sm text-white/60 text-left hover:text-[#01F27B] transition-colors flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-[#01F27B] mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Column 4: Contact & App */}
          <div className="space-y-10">
            {/* Support Info */}
            <div className="space-y-6">
              <p className="text-sm font-black text-white uppercase tracking-[0.2em]">Contact Support</p>
              <div className="space-y-4">
                <a href="mailto:support@boostfundr.com" className="flex items-center gap-3 text-white/60 hover:text-[#01F27B] transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#01F27B]/10">
                    <Mail size={14} className="text-[#01F27B]" />
                  </div>
                  <span className="text-sm">support@boostfundr.com</span>
                </a>
                <a href="tel:+1234567890" className="flex items-center gap-3 text-white/60 hover:text-[#01F27B] transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#01F27B]/10">
                    <Phone size={14} className="text-[#01F27B]" />
                  </div>
                  <span className="text-sm">+1 (234) 567-890</span>
                </a>
                <a href="https://wa.me/1234567890" className="flex items-center gap-3 text-white/60 hover:text-[#01F27B] transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#01F27B]/10">
                    <MessageCircle size={14} className="text-[#01F27B]" />
                  </div>
                  <span className="text-sm font-bold">WhatsApp Support</span>
                </a>
              </div>
            </div>

            {/* App Downloads */}
            <div className="space-y-4">
              <p className="text-xs font-black text-[#01F27B] uppercase tracking-[0.2em]">Get Mobile App</p>
              <div className="flex flex-wrap gap-3">
                {/* App Store */}
                <button className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all text-left">
                  <Apple size={24} className="text-white" />
                  <div>
                    <p className="text-[10px] text-white/50 leading-none">Download on</p>
                    <p className="text-sm font-bold text-white leading-none mt-1">App Store</p>
                  </div>
                </button>
                {/* Play Store */}
                <button className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all text-left">
                  <Play size={20} className="text-white fill-current" />
                  <div>
                    <p className="text-[10px] text-white/50 leading-none">Get it on</p>
                    <p className="text-sm font-bold text-white leading-none mt-1">Google Play</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payments */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Copyright */}
          <div className="flex flex-col gap-2 text-center md:text-left">
            <p className="text-xs text-white/30">
              © {year} {brand}. All rights reserved. Registered FinTech platform.
            </p>
          </div>

          {/* Payments & Security */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex flex-col items-center md:items-end gap-3 px-6 py-4 bg-white/[0.03] border border-white/5 rounded-[2rem] backdrop-blur-md">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em]">Secure Payments via</span>
                <span className="text-sm font-black text-white italic tracking-tight">MyFatoorah</span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-4 opacity-80 hover:opacity-100 transition-opacity duration-500">
                {/* Visa */}
                <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                  <rect width="40" height="25" rx="4" fill="#1A1F71"/>
                  <path d="M15.4 17.5L17.2 11.2H19.5L17.7 17.5H15.4ZM24.2 11.4C23.6 11.2 22.8 11.1 22 11.1C19.7 11.1 18.1 12.3 18.1 14.1C18.1 15.4 19.3 16.1 20.2 16.5C21.1 16.9 21.4 17.2 21.4 17.6C21.4 18.2 20.7 18.4 20.1 18.4C19.3 18.4 18.6 18.2 17.8 17.8L17.4 19.5C17.9 19.7 18.9 20 20 20C22.4 20 23.9 18.8 23.9 17C23.9 14.2 20.1 14 20.1 12.8C20.1 12.4 20.5 12.1 21.3 12C21.7 12 22.5 12 23.3 12.3L24.2 11.4ZM29.5 11.2L27.6 17.5H25.4L23.4 11.2H25.8L27.1 15.4L28.2 11.2H29.5ZM13.8 11.2L11.5 17.5L10.1 11.2H13.8Z" fill="white"/>
                </svg>
                {/* Mastercard */}
                <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                  <rect width="40" height="25" rx="4" fill="#333333"/>
                  <circle cx="16" cy="12.5" r="8" fill="#EB001B" fillOpacity="0.8"/>
                  <circle cx="24" cy="12.5" r="8" fill="#F79E1B" fillOpacity="0.8"/>
                </svg>
                {/* AMEX */}
                <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                  <rect width="40" height="25" rx="4" fill="#016FD0"/>
                  <text x="50%" y="65%" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">AMEX</text>
                </svg>
                {/* Apple Pay */}
                <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-md h-5">
                  <Apple size={10} className="text-black fill-current" />
                  <span className="text-[10px] font-bold text-black">Pay</span>
                </div>
                {/* Google Pay */}
                <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-md h-5">
                  <span className="text-[10px] font-bold"><span className="text-[#4285F4]">G</span> <span className="text-black">Pay</span></span>
                </div>
                {/* Mada */}
                <div className="flex items-center justify-center px-2 py-1 bg-[#2C2C2C] rounded-md h-5">
                  <span className="text-[8px] font-black text-white tracking-widest">MADA</span>
                </div>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 text-white/20">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Bank-Grade Security</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
