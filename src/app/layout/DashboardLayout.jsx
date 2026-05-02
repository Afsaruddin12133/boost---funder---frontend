import {
  Bookmark,
  Briefcase,
  Building,
  Compass,
  CreditCard,
  LayoutDashboard,
  LineChart,
  LogOut,
  Plus,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  TrendingUp,
  User,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from "@/shared/ui/sidebar";

function SidebarNavContent({ navItems, currentPath, navigateRouter, onLogout, userRole }) {
  const { setOpenMobile } = useSidebar();

  return (
    <>
      <SidebarContent className="px-5 py-8 overflow-y-auto scrollbar-none">
        <SidebarMenu className="space-y-3">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  isActive={isActive}
                  onClick={() => {
                    navigateRouter(item.path);
                    setOpenMobile(false);
                  }}
                  className={`h-14 px-6 rounded-2xl transition-all duration-300 ${isActive
                    ? "bg-[#01F27B] text-black font-bold shadow-[0_0_25px_rgba(1,242,123,0.35)] hover:bg-[#00d66d] hover:text-black"
                    : "text-white/60 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10"
                    }`}
                >
                  <item.icon className={`w-6 h-6 mr-4 ${isActive ? "text-black" : "text-[#01F27B]/70"}`} />
                  <span className="text-base tracking-tight">{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-5 border-t border-white/5 space-y-3">
        {/* Create Deal - Desktop Only */}
        {userRole === "founder" && (
          <div className="relative group hidden md:block">
            <div className="absolute inset-0 bg-[#01F27B] blur-[20px] rounded-xl opacity-20 group-hover:opacity-40 animate-pulse transition-opacity" />
            <Button
              onClick={() => {
                navigateRouter("/dashboard/founder/deals?action=create");
                setOpenMobile(false);
              }}
              className="relative w-full h-12 bg-[#01F27B] hover:bg-[#00d66d] text-black font-black rounded-xl text-base shadow-[0_0_25px_rgba(1,242,123,0.4)] hover:shadow-[0_0_35px_rgba(1,242,123,0.6)] transition-all duration-300 items-center justify-center gap-2 border border-[#01F27B]/50"
            >
              <Plus className="w-5 h-5" />
              <span>Create Deal</span>
            </Button>
          </div>
        )}

        {/* Logout - Mobile Only */}
        <Button
          variant="ghost"
          onClick={() => {
            onLogout();
            setOpenMobile(false);
          }}
          className="flex md:hidden w-full h-12 items-center justify-start gap-4 px-6 text-red-400 hover:text-red-300 hover:bg-red-400/10 border border-transparent hover:border-red-400/20 rounded-2xl transition-all duration-300"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-base font-bold tracking-tight">Logout</span>
        </Button>
      </SidebarFooter>
    </>
  );
}

export default function DashboardLayout({ children, userRole, onNavigate, onLogout }) {
  const { user: authUser } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const navigateRouter = useNavigate();
  const [searchParams] = useSearchParams();

  // Watch for payment gateway redirects
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');

    if (paymentStatus === 'success') {
      toast.success('Payment successful! Your subscription is now active. 🎉', { duration: 5000 });
      // Remove query param without triggering full reload
      navigateRouter(currentPath, { replace: true });
    } else if (paymentStatus === 'failed') {
      toast.error('Payment failed or was canceled. Please try again.', { duration: 5000 });
      // Remove query param
      navigateRouter(currentPath, { replace: true });
    }
  }, [searchParams, navigateRouter, currentPath]);

  const founderNav = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard/founder" },
    { name: "My Deals", icon: Briefcase, path: "/dashboard/founder/deals" },
    { name: "Verification", icon: ShieldCheck, path: "/dashboard/founder/verification" },
    { name: "Subscription", icon: CreditCard, path: "/dashboard/founder/subscription" },
    { name: "Analytics", icon: LineChart, path: "/dashboard/founder/analytics" },
    { name: "My Profile", icon: Building, path: "/dashboard/founder/profile" },
    { name: "Settings", icon: Settings, path: "/dashboard/founder/settings" },
  ];

  const investorNav = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard/investor" },
    { name: "Explore Deals", icon: Compass, path: "/dashboard/investor/deals" },
    { name: "Saved Deals", icon: Bookmark, path: "/dashboard/investor/saved" },
    { name: "Verification", icon: ShieldCheck, path: "/dashboard/investor/verification" },
    { name: "Subscription", icon: CreditCard, path: "/dashboard/investor/subscription" },
    { name: "My Profile", icon: Building, path: "/dashboard/investor/profile" },
    { name: "Settings", icon: Settings, path: "/dashboard/investor/settings" },
  ];

  const navItems = userRole === "founder" ? founderNav : investorNav;

  return (
    <SidebarProvider defaultOpen={true} className="h-screen overflow-hidden">
      <Sidebar variant="sidebar" className="bg-gradient-to-b from-[#06120b] via-[#040c07] to-black backdrop-blur-xl border-r border-white/5 relative overflow-hidden scrollbar-none">
        {/* Subtle background glow for sidebar */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#01F27B]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <SidebarHeader className="p-6 pt-8">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 bg-[#01F27B] rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg leading-none">B</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white leading-none">BoostFundr</span>
              <span className="text-xs text-[#01F27B] font-medium mt-1">
                {userRole === "founder" ? "Founder Portal" : "Investor Portal"}
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarNavContent 
          navItems={navItems} 
          currentPath={currentPath} 
          navigateRouter={navigateRouter} 
          onLogout={onLogout}
          userRole={userRole}
        />
      </Sidebar>

      <SidebarInset className="bg-gradient-to-br from-[#0c2014] via-black to-[#0a1b12] h-screen overflow-hidden relative flex flex-col">
        {/* Global ambient background glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#01F27B]/10 rounded-full blur-[150px] pointer-events-none" />
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-2xl border-b border-white/10 h-20 flex items-center justify-between px-8 shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-6">
            <SidebarTrigger className="md:hidden text-white/70 hover:text-[#01F27B] transition-colors" />
            <div className="relative hidden lg:block w-[450px] group">
              <div className="absolute inset-0 bg-[#01F27B]/5 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#01F27B]/60 group-focus-within:text-[#01F27B] transition-colors z-10" />
              <Input
                placeholder="Search deals, investors, or startups..."
                className="w-full h-12 bg-white/10 border-white/10 hover:border-white/20 rounded-2xl pl-12 pr-12 text-base text-white placeholder:text-white/30 focus-visible:ring-[#01F27B]/30 focus:border-[#01F27B]/50 transition-all shadow-2xl relative z-0"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded-md pointer-events-none">
                <span className="text-[10px] font-bold text-white/40">⌘</span>
                <span className="text-[10px] font-bold text-white/40">K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-4 pl-8 border-l border-white/10 cursor-pointer group">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-semibold text-white group-hover:text-[#01F27B] transition-colors">{authUser?.firstName} {authUser?.lastName}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#01F27B] animate-pulse" />
                      <span className="text-[10px] text-[#01F27B]/70 font-bold uppercase tracking-widest group-hover:text-[#01F27B] transition-colors">{authUser?.subscription?.plan || 'Free'} Plan</span>
                    </div>
                  </div>
                  <div className="relative">
                    <Avatar className="w-11 h-11 border-2 border-white/10 group-hover:border-[#01F27B]/50 transition-all shadow-xl">
                      <AvatarImage src={authUser?.profile?.profileImage || `https://ui-avatars.com/api/?name=${authUser?.firstName}+${authUser?.lastName}&background=01F27B&color=000`} />
                      <AvatarFallback className="bg-[#01F27B]/10 text-[#01F27B]">{authUser?.firstName?.charAt(0)}{authUser?.lastName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0c0c0c] border border-white/10 rounded-full flex items-center justify-center">
                      <ChevronDown className="w-2.5 h-2.5 text-white/40 group-hover:text-[#01F27B] transition-colors" />
                    </div>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#0c0c0c]/95 backdrop-blur-xl border-white/10 p-2 mt-2">
                <DropdownMenuLabel className="text-xs font-bold text-white/40 uppercase tracking-widest px-2 py-1.5">User Account</DropdownMenuLabel>
                <DropdownMenuItem 
                  onClick={() => navigateRouter(userRole === 'founder' ? '/dashboard/founder/profile' : '/dashboard/investor/profile')}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 cursor-pointer transition-all"
                >
                  <User className="w-4 h-4 text-[#01F27B]" />
                  <span className="font-semibold">Bio Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigateRouter(userRole === 'founder' ? '/dashboard/founder/settings' : '/dashboard/investor/settings')}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 cursor-pointer transition-all"
                >
                  <Settings className="w-4 h-4 text-white/40" />
                  <span className="font-semibold">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5 my-2" />
                <DropdownMenuItem 
                  onClick={onLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/10 cursor-pointer transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-bold">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area - Independently Scrollable */}
        <main className="flex-1 overflow-y-auto p-4 md:p-5 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
