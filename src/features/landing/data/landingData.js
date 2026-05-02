import { Rocket, Shield, TrendingUp, Users } from "lucide-react";

/**
 * Featured deals data for the landing page
 */
export const featuredDeals = [
  {
    id: "1",
    startupName: "Resend",
    startupLogo: "https://resend.com/static/favicons/favicon-marketing@180x180.png?v=1",
    category: "Developer Tools",
    goalAmount: 900000,
    raisedAmount: 650000,
    deadline: "2026-12-15",
    verificationBadge: { isVerified: true }
  },
  {
    id: "2",
    startupName: "Supabase",
    startupLogo: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/supabase.webp",
    category: "Cloud Infrastructure",
    goalAmount: 500000,
    raisedAmount: 320000,
    deadline: "2026-08-28",
    verificationBadge: { isVerified: true }
  },
  {
    id: "3",
    startupName: "Mintlify",
    startupLogo: "https://cdn.prod.website-files.com/5e9dc792e1210c5325f7ebbc/655e018062de96b18e72dec7_mintlify.3e5350dd.svg",
    category: "B2B SaaS",
    goalAmount: 800000,
    raisedAmount: 660000,
    deadline: "2026-07-10",
    verificationBadge: { isVerified: true }
  },
  {
    id: "4",
    startupName: "Tavily",
    startupLogo: "https://qjkcnuesiiqjpohzdjjm.supabase.co/storage/v1/object/public/aops_marketplace/logos/tavily.png",
    category: "AI Research",
    goalAmount: 950000,
    raisedAmount: 850000,
    deadline: "2026-06-01",
    verificationBadge: { isVerified: true }
  },
  {
    id: "5",
    startupName: "Raycast",
    startupLogo: "https://images.seeklogo.com/logo-png/65/1/raycast-icon-logo-png_seeklogo-653418.png",
    category: "Productivity",
    goalAmount: 600000,
    raisedAmount: 480000,
    deadline: "2026-06-20",
    verificationBadge: { isVerified: true }
  },
  {
    id: "6",
    startupName: "PostHog",
    startupLogo: "https://images.g2crowd.com/uploads/product/image/d454e5361d4095df745ece8807a7f730/posthog.png",
    category: "Data Analytics",
    goalAmount: 400000,
    raisedAmount: 380000,
    deadline: "2026-05-30",
    verificationBadge: { isVerified: true }
  }
];

/**
 * Platform features data for the landing page
 */
export const features = [
  { icon: Shield, title: "Verified Founders", desc: "Every startup is vetted and verified" },
  { icon: TrendingUp, title: "Quality Deals", desc: "Curated high-potential opportunities" },
  { icon: Users, title: "Direct Access", desc: "Connect directly with founders" },
  { icon: Rocket, title: "Fast Process", desc: "Request and unlock deals instantly" }
];
