import React from "react";
import { useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard, Building, Briefcase, LineChart,
  ShieldCheck, CreditCard, Settings, Compass,
  Bookmark, PieChart, Search, Bell, Plus, LogOut
} from "lucide-react";

import {
  SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu,
  SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset, SidebarTrigger
} from "@/shared/ui/sidebar";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

export default function DashboardLayout({ children, userRole, onNavigate, onLogout }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigateRouter = useNavigate();

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
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="inset" className="bg-[#06120b] border-r border-white/5">
        <SidebarHeader className="p-4 pt-6">
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

        <SidebarContent className="px-3 py-6">
          <SidebarMenu className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    isActive={isActive}
                    onClick={() => {
                      // Navigate via react-router to the actual path
                      navigateRouter(item.path);
                    }}
                    className={`h-11 px-4 rounded-xl transition-all ${isActive
                        ? "bg-[#01F27B] text-black font-semibold hover:bg-[#01F27B]/90 hover:text-black"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-black" : "text-white/50"}`} />
                    <span className="text-sm">{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        {userRole === "founder" && (
          <SidebarFooter className="p-4 pb-6">
            <Button
              onClick={() => navigateRouter("/dashboard/founder/deals")}
              className="w-full h-12 bg-[#01F27B] hover:bg-[#01F27B]/90 text-black font-semibold rounded-xl text-base shadow-[0_0_20px_rgba(1,242,123,0.2)] hover:shadow-[0_0_30px_rgba(1,242,123,0.35)] transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Deal
            </Button>
          </SidebarFooter>
        )}
      </Sidebar>

      <SidebarInset className="bg-[#0c0c0c] min-h-screen relative flex flex-col">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-[#0c0c0c]/80 backdrop-blur-xl border-b border-white/5 h-20 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden text-white/70 hover:text-white" />
            <div className="relative hidden md:block w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                placeholder="Search deals, investors..."
                className="w-full h-10 bg-black/50 border-white/10 rounded-full pl-10 text-sm text-white placeholder:text-white/40 focus-visible:ring-[#01F27B]/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-white/70 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute 0 right-0 w-2 h-2 bg-[#01F27B] rounded-full border border-[#0c0c0c]" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium text-white">Alex Chen</span>
                <span className="text-xs text-[#01F27B]">Pro {userRole === "founder" ? "Founder" : "Investor"}</span>
              </div>
              <Avatar className="w-10 h-10 border-2 border-white/10">
                <AvatarImage src="https://i.pravatar.cc/150?u=alex" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
            </div>
            <Button
              variant="ghost"
              onClick={onLogout}
              className="hidden md:flex items-center gap-2 text-white/60 hover:text-white hover:bg-white/5 border border-white/10 rounded-xl px-4 h-9 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
