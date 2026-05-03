import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Shield, 
  Mail, 
  Smartphone, 
  CreditCard,
  ChevronRight,
  Save,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { useAuth } from '@/features/auth/hooks/useAuth';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully!');
    }, 1500);
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-black tracking-tighter text-white mb-2">Settings</h1>
        <p className="text-white/40 text-sm lg:text-base font-medium tracking-wide">
          Manage your account preferences and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 border ${
                activeTab === tab.id 
                  ? 'bg-[#01F27B]/10 border-[#01F27B]/20 text-[#01F27B] shadow-[0_0_20px_rgba(1,242,123,0.1)]' 
                  : 'bg-white/[0.03] border-white/5 text-white/50 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[#01F27B]' : 'text-white/30'}`} />
              <span className="font-bold tracking-tight">{tab.label}</span>
              {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <Card className="bg-white/[0.03] backdrop-blur-2xl border-white/10 p-6 lg:p-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#01F27B]/5 rounded-full blur-[100px] pointer-events-none" />

            {activeTab === 'account' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <section className="space-y-6">
                  <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-[#01F27B]/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-[#01F27B]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Profile Information</h2>
                      <p className="text-white/40 text-sm">Update your public profile details</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">First Name</label>
                      <Input 
                        defaultValue={user?.firstName}
                        className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-[#01F27B]/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Last Name</label>
                      <Input 
                        defaultValue={user?.lastName}
                        className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-[#01F27B]/30"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Email Address</label>
                      <Input 
                        defaultValue={user?.email}
                        readOnly
                        className="bg-white/5 border-white/5 h-12 rounded-xl text-white/30 cursor-not-allowed"
                      />
                      <p className="text-[10px] text-white/20 ml-1 italic">Email cannot be changed manually for security reasons.</p>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-[#01F27B]/10 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-[#01F27B]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Regional Preferences</h2>
                      <p className="text-white/40 text-sm">Set your language and timezone</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Timezone</label>
                      <select className="w-full bg-white/5 border border-white/10 h-12 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#01F27B]/30 transition-all">
                        <option value="UTC">UTC (Universal Time Coordinated)</option>
                        <option value="EST">EST (Eastern Standard Time)</option>
                        <option value="PST">PST (Pacific Standard Time)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Currency</label>
                      <select className="w-full bg-white/5 border border-white/10 h-12 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#01F27B]/30 transition-all">
                        <option value="USD">USD ($) - US Dollar</option>
                        <option value="EUR">EUR (€) - Euro</option>
                        <option value="GBP">GBP (£) - British Pound</option>
                      </select>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <section className="space-y-6">
                  <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-[#01F27B]/10 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-[#01F27B]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Change Password</h2>
                      <p className="text-white/40 text-sm">Secure your account with a strong password</p>
                    </div>
                  </div>

                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Current Password</label>
                      <Input type="password" underline className="bg-white/5 border-white/10 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">New Password</label>
                      <Input type="password" underline className="bg-white/5 border-white/10 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Confirm New Password</label>
                      <Input type="password" underline className="bg-white/5 border-white/10 rounded-xl" />
                    </div>
                  </div>
                </section>

                <section className="p-6 rounded-2xl bg-[#01F27B]/5 border border-[#01F27B]/10">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#01F27B]/20 flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-[#01F27B]" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-white font-bold tracking-tight">Two-Factor Authentication</h3>
                      <p className="text-white/50 text-sm leading-relaxed">
                        Add an extra layer of security to your account by requiring more than just a password to log in.
                      </p>
                      <Button className="bg-[#01F27B] hover:bg-[#00d66d] text-black font-bold h-10 px-6 rounded-xl mt-2">
                        Enable 2FA
                      </Button>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <section className="space-y-6">
                  <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-[#01F27B]/10 flex items-center justify-center">
                      <Bell className="w-6 h-6 text-[#01F27B]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Notification Settings</h2>
                      <p className="text-white/40 text-sm">Choose how you want to be notified</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 'n1', label: 'Deal Alerts', desc: 'Notify me when a new deal matches my interests', icon: Mail },
                      { id: 'n2', label: 'Message Notifications', desc: 'Get notified when an investor/founder messages you', icon: Smartphone },
                      { id: 'n3', label: 'System Updates', desc: 'Stay informed about platform changes and new features', icon: AlertCircle },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-[#01F27B]/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#01F27B]/10 transition-colors">
                            <item.icon className="w-5 h-5 text-white/30 group-hover:text-[#01F27B]" />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-sm tracking-tight">{item.label}</h4>
                            <p className="text-white/40 text-xs">{item.desc}</p>
                          </div>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#01F27B]"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <section className="space-y-6">
                  <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-[#01F27B]/10 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-[#01F27B]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Billing & Subscription</h2>
                      <p className="text-white/40 text-sm">Manage your plan and payment methods</p>
                    </div>
                  </div>

                  <Card className="bg-gradient-to-br from-[#01F27B]/10 to-transparent border-[#01F27B]/20 p-6 rounded-3xl border-2 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4">
                      <Badge className="bg-[#01F27B] text-black font-black uppercase tracking-widest text-[10px]">Active</Badge>
                    </div>
                    <div className="relative z-10 space-y-4">
                      <p className="text-[10px] font-black text-[#01F27B] uppercase tracking-[0.2em]">Current Plan</p>
                      <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Free Starter</h3>
                      <p className="text-white/50 text-sm max-w-sm">
                        You are currently on the Free plan. Upgrade to unlock premium features and accelerate your funding journey.
                      </p>
                      <Button className="bg-white text-black font-black hover:bg-white/90 rounded-xl px-8 h-12 transition-all shadow-[0_10px_20px_rgba(255,255,255,0.1)]">
                        Upgrade to Pro
                      </Button>
                    </div>
                  </Card>

                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-white/40 uppercase tracking-widest ml-1">Payment Methods</h3>
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-white/5 rounded flex items-center justify-center">
                          <span className="text-[10px] font-bold text-white/40 italic">VISA</span>
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">•••• •••• •••• 4242</p>
                          <p className="text-white/40 text-xs">Expires 12/25</p>
                        </div>
                      </div>
                      <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8 px-3 rounded-lg text-xs font-bold uppercase tracking-widest">
                        Remove
                      </Button>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <section className="space-y-6">
                  <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-[#01F27B]/10 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-[#01F27B]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Privacy Controls</h2>
                      <p className="text-white/40 text-sm">Manage your data and visibility</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'Public Profile', desc: 'Allow anyone on the platform to see your profile details' },
                      { label: 'Show Online Status', desc: 'Let others know when you are active on the platform' },
                      { label: 'Share Analytics', desc: 'Help us improve by sharing anonymous usage data' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div>
                          <h4 className="text-white font-bold text-sm tracking-tight">{item.label}</h4>
                          <p className="text-white/40 text-xs">{item.desc}</p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#01F27B]"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="pt-8 border-t border-white/5">
                  <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center sm:text-left">
                      <h3 className="text-red-400 font-bold tracking-tight flex items-center justify-center sm:justify-start gap-2">
                        <Trash2 className="w-4 h-4" />
                        Danger Zone
                      </h3>
                      <p className="text-white/30 text-xs max-w-xs">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <Button variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:border-red-500/40 rounded-xl px-6 h-11 font-bold uppercase tracking-widest text-xs">
                      Delete Account
                    </Button>
                  </div>
                </section>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-12 flex justify-end">
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#01F27B] hover:bg-[#00d66d] text-black font-black px-8 h-12 rounded-xl flex items-center gap-2 shadow-[0_10px_20px_rgba(1,242,123,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>Save Changes</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
