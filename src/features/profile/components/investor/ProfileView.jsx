import React from 'react';
import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Mail, MapPin, Phone, Globe, Linkedin, Twitter, Github, DollarSign, Briefcase } from 'lucide-react';
import { formatCurrency } from '@/features/deal/utils/dealUtils';

export default function ProfileView({ profile }) {
  const socialLinks = profile?.socialLinks || {};
  const preferences = profile?.investmentPreferences || { sectors: [] };
  
  const hasSocials = socialLinks.linkedin || socialLinks.twitter || socialLinks.facebook || socialLinks.github;

  return (
    <div className="space-y-6">
      {/* Personal Info Card */}
      <Card className="bg-[#0c0c0c] border-white/10 p-6 sm:p-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#01F27B] rounded-full"></span>
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-white/50 mb-1">First Name</p>
            <p className="text-white font-medium">{profile?.firstName || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-white/50 mb-1">Last Name</p>
            <p className="text-white font-medium">{profile?.lastName || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-white/50 mb-1">Email Address</p>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-white/40" />
              <p className="text-white font-medium">{profile?.email || '—'}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-white/50 mb-1">Phone Number</p>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-white/40" />
              <p className="text-white font-medium">{profile?.phone || '—'}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* About Section */}
      <Card className="bg-[#0c0c0c] border-white/10 p-6 sm:p-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#01F27B] rounded-full"></span>
          About Summary
        </h3>
        <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
          {profile?.bio || <span className="text-white/40 italic">No bio provided yet. Add a short summary to tell founders about your background.</span>}
        </p>
      </Card>

      {/* Investment Preferences */}
      <Card className="bg-[#0c0c0c] border-white/10 p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#01F27B]/5 rounded-full blur-3xl pointer-events-none" />
        
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#01F27B] rounded-full"></span>
          Investment Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <p className="text-sm text-white/50 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Min Investment Check
            </p>
            <p className="text-2xl font-bold text-[#01F27B]">
              {formatCurrency(preferences.minInvestment || 0)}
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <p className="text-sm text-white/50 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Max Investment Check
            </p>
            <p className="text-2xl font-bold text-[#01F27B]">
              {formatCurrency(preferences.maxInvestment || 0)}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-white/50 mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Target Sectors & Industries
          </p>
          {preferences.sectors?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {preferences.sectors.map((sector, idx) => (
                <Badge key={idx} className="bg-white/10 text-white hover:bg-white/15 border-white/5 py-1.5 px-3">
                  {sector}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-white/40 italic text-sm">No specific sectors specified.</p>
          )}
        </div>
      </Card>

      {/* Social Links */}
      <Card className="bg-[#0c0c0c] border-white/10 p-6 sm:p-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#01F27B] rounded-full"></span>
          Online Presence
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
            <Globe className="w-5 h-5 text-white/40" />
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-white/50 mb-0.5">Website</p>
              {profile?.website ? (
                <a href={profile.website} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline truncate block">
                  {profile.website}
                </a>
              ) : (
                <p className="text-sm text-white/30">—</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
            <Linkedin className="w-5 h-5 text-[#0077b5]" />
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-white/50 mb-0.5">LinkedIn</p>
              {socialLinks.linkedin ? (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline truncate block">
                  {socialLinks.linkedin}
                </a>
              ) : (
                <p className="text-sm text-white/30">—</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
            <Twitter className="w-5 h-5 text-[#1DA1F2]" />
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-white/50 mb-0.5">Twitter / X</p>
              {socialLinks.twitter ? (
                <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline truncate block">
                  {socialLinks.twitter}
                </a>
              ) : (
                <p className="text-sm text-white/30">—</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
            <Github className="w-5 h-5 text-white" />
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-white/50 mb-0.5">GitHub</p>
              {socialLinks.github ? (
                <a href={socialLinks.github} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline truncate block">
                  {socialLinks.github}
                </a>
              ) : (
                <p className="text-sm text-white/30">—</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
