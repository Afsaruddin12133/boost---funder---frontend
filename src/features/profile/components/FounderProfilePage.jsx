import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  CheckCircle, Edit3, Save, X, Camera, MapPin, Users,
  DollarSign, Globe, Linkedin, Twitter, Github, Facebook,
  Building2, RefreshCw, AlertCircle, User, Mail, Phone,
  ChevronRight, ExternalLink
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Loader } from "@/shared/ui/loader";
import { getFounderProfile, updateFounderProfile } from "../services/profile.service";
import { useVerificationStatus } from "@/features/verification/hooks/useVerification";
import { useAuth } from "@/features/auth/hooks/useAuth";

// ─── Flatten API Response ──────────────────────────────────────────────────
function flattenProfile(user) {
  if (!user) return null;
  const ext = user.profile || {};
  return {
    firstName:          user.firstName            || "",
    lastName:           user.lastName             || "",
    email:              user.email                || "",
    isVerified:         !!user.isVerified,
    phone:              ext.phone                 || "",
    location:           ext.location              || "",
    bio:                ext.bio                   || "",
    companyName:        ext.companyName           || "",
    companyWebsite:     ext.companyWebsite        || "",
    startupStage:       ext.startupStage          || "",
    startupDescription: ext.startupDescription    || "",
    fundingGoal:        ext.fundingGoal           ?? "",
    teamSize:           ext.teamSize              ?? "",
    profileImage:       ext.profileImage          || null,
    website:            ext.website               || "",
    linkedin:           ext.socialLinks?.linkedin  || "",
    twitter:            ext.socialLinks?.twitter   || "",
    github:             ext.socialLinks?.github    || "",
    facebook:           ext.socialLinks?.facebook  || "",
  };
}

const STAGES = ["Idea", "Pre-Seed", "Seed", "MVP", "Early Traction", "Series A", "Series B", "Growth"];

// ─── Visual Components ──────────────────────────────────────────────────────
const InputGroup = ({ label, icon: Icon, error, children }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </label>
    {children}
    {error && <p className="text-[10px] text-red-400 font-bold ml-1">{error}</p>}
  </div>
);

const PremiumInput = ({ value, onChange, placeholder, type = "text", readOnly = false }) => (
  <input
    type={type}
    value={value ?? ""}
    onChange={(e) => onChange?.(e.target.value)}
    placeholder={placeholder}
    readOnly={readOnly}
    className={`w-full bg-white/[0.03] border ${readOnly ? 'border-white/5 text-white/30 cursor-not-allowed' : 'border-white/10 text-white focus:border-[#01F27B]/50 focus:bg-[#01F27B]/5'} rounded-2xl px-5 py-3.5 text-sm transition-all duration-300 outline-none placeholder:text-white/20`}
  />
);

const PremiumTextarea = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea
    value={value ?? ""}
    onChange={(e) => onChange?.(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="w-full bg-white/[0.03] border border-white/10 text-white focus:border-[#01F27B]/50 focus:bg-[#01F27B]/5 rounded-2xl px-5 py-4 text-sm transition-all duration-300 outline-none placeholder:text-white/20 resize-none"
  />
);

// ─── Main Component ──────────────────────────────────────────────────────────
export default function FounderProfilePage() {
  const { data: verStatus } = useVerificationStatus();
  const { user: authUser, updateUser } = useAuth();
  
  const [rawUser, setRawUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const fileRef = useRef(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setFetchErr(null);
    try {
      const data = await getFounderProfile();
      setRawUser(data);
      updateUser(data); // Sync with navigation bar
    } catch (e) {
      setFetchErr(e?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const profile = flattenProfile(rawUser);
  const statusString = (verStatus?.status || verStatus?.verification?.status || "").toLowerCase();
  const isVerified = authUser?.isVerified === true || statusString === "approved" || statusString === "verified";

  const enterEditMode = () => {
    setForm(profile ? { ...profile } : {});
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setAvatarPreview(null);
    setAvatarFile(null);
    setValidationErrors({});
  };

  const handleSave = async () => {
    // Basic Validation
    const e = {};
    if (!form.firstName?.trim()) e.firstName = "Required";
    if (!form.lastName?.trim()) e.lastName = "Required";
    if (Object.keys(e).length > 0) {
      setValidationErrors(e);
      toast.error("Please fill in required fields.");
      return;
    }

    const fd = new FormData();
    
    // Core fields
    const coreFields = [
      'firstName', 'lastName', 'email', 'phone', 'location', 'bio', 
      'companyName', 'companyWebsite', 'startupStage', 'startupDescription', 
      'fundingGoal', 'teamSize', 'website'
    ];

    coreFields.forEach(key => {
      if (form[key] !== null && form[key] !== undefined && String(form[key]).trim() !== "") {
        fd.append(key, form[key]);
      }
    });

    // Social fields (Nested in backend)
    const socialFields = ['linkedin', 'twitter', 'facebook', 'github'];
    socialFields.forEach(key => {
      if (form[key] !== null && form[key] !== undefined && String(form[key]).trim() !== "") {
        fd.append(`socialLinks.${key}`, form[key]);
      }
    });

    if (avatarFile) fd.append("profileImage", avatarFile);

    setSaving(true);
    try {
      await updateFounderProfile(fd);
      toast.success("Profile updated successfully!");
      setEditing(false);
      await fetchProfile();
    } catch (e) {
      toast.error(e?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader label="Preparing your profile..." /></div>;

  if (fetchErr) return (
    <Card className="bg-white/5 border-white/10 p-12 text-center max-w-lg mx-auto mt-20">
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
      <p className="text-white/40 mb-6">{fetchErr}</p>
      <Button onClick={fetchProfile} className="bg-[#01F27B] text-black font-bold rounded-xl px-8">
        <RefreshCw className="w-4 h-4 mr-2" /> Try Again
      </Button>
    </Card>
  );

  const d = editing ? form : (profile || {});
  const avatarSrc = avatarPreview || d.profileImage;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8 pb-20"
    >
      {/* ── HEADER CARD ───────────────────────────────────────────────── */}
      <Card className="relative bg-gradient-to-br from-white/[0.05] to-transparent border-white/10 overflow-hidden p-8 lg:p-12">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#01F27B]/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#01F27B]/5 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
          {/* Avatar Section */}
          <div className="relative shrink-0">
            <div className={`w-32 h-32 lg:w-40 lg:h-40 rounded-3xl overflow-hidden border-4 ${isVerified ? 'border-[#01F27B]/30' : 'border-white/10'} bg-black shadow-2xl relative group`}>
              {avatarSrc ? (
                <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/5">
                  <User className="w-16 h-16 text-[#01F27B]/40" />
                </div>
              )}
              
              {editing && (
                <button 
                  onClick={() => fileRef.current?.click()}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <Camera className="w-8 h-8 text-[#01F27B] mb-2" />
                  <span className="text-[10px] font-black text-[#01F27B] uppercase tracking-widest">Change Photo</span>
                </button>
              )}
            </div>
            
            <AnimatePresence>
              {isVerified && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-3 -right-3 w-10 h-10 bg-[#01F27B] rounded-2xl border-4 border-black flex items-center justify-center shadow-[0_0_20px_rgba(1,242,123,0.4)] z-20"
                >
                  <CheckCircle className="w-5 h-5 text-black" strokeWidth={3} />
                </motion.div>
              )}
            </AnimatePresence>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Identity Section */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase italic">
                  {d.firstName || "New"} <span className="text-[#01F27B]">{d.lastName || "Founder"}</span>
                </h1>
                {isVerified && (
                  <Badge className="bg-[#01F27B]/10 text-[#01F27B] border-[#01F27B]/20 py-1.5 px-4 rounded-full font-black tracking-widest text-[10px] uppercase">
                    Elite Verified
                  </Badge>
                )}
              </div>
              <p className="text-white/40 font-bold tracking-wide flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4 text-[#01F27B]/50" />
                {d.email}
              </p>
            </div>

            <p className="text-white/60 text-base lg:text-lg leading-relaxed max-w-2xl font-medium">
              {d.bio || "Crafting the next big thing in the startup ecosystem. Complete your bio to share your vision with elite investors."}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                <MapPin className="w-4 h-4 text-[#01F27B]" />
                <span className="text-sm font-bold text-white/80">{d.location || "Global"}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                <Building2 className="w-4 h-4 text-[#01F27B]" />
                <span className="text-sm font-bold text-white/80">{d.companyName || "Stealth Startup"}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex-none pt-4 md:pt-0">
            {!editing ? (
              <Button 
                onClick={enterEditMode}
                className="bg-[#01F27B] hover:bg-[#00d66d] text-black font-black px-8 h-12 rounded-2xl flex items-center gap-2 shadow-[0_10px_25px_rgba(1,242,123,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Edit3 className="w-5 h-5" />
                <span>Edit Profile</span>
              </Button>
            ) : (
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#01F27B] hover:bg-[#00d66d] text-black font-black px-10 h-12 rounded-2xl flex items-center gap-2 shadow-[0_10px_25px_rgba(1,242,123,0.3)]"
                >
                  {saving ? <Loader size="sm" className="border-black" /> : <Save className="w-5 h-5" />}
                  <span>{saving ? "Saving..." : "Save Profile"}</span>
                </Button>
                <Button 
                  onClick={handleCancel}
                  variant="ghost"
                  className="text-white/40 hover:text-white hover:bg-white/5 h-12 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* ── DETAILS GRID ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Stats & Social */}
        <div className="lg:col-span-4 space-y-8">
          <Section icon={TrendingUp} title="Quick Stats">
            <div className="grid grid-cols-1 gap-4">
              <StatCard icon={Users} label="Team Size" value={d.teamSize ? `${d.teamSize} Experts` : "Solo Founder"} />
              <StatCard icon={DollarSign} label="Funding Goal" value={d.fundingGoal ? `$${Number(d.fundingGoal).toLocaleString()}` : "Not Disclosed"} />
              <StatCard icon={Rocket} label="Startup Stage" value={d.startupStage || "Exploration"} />
            </div>
          </Section>

          <Section icon={Globe} title="Digital Presence">
            <div className="space-y-4">
              <SocialItem icon={Globe} label="Professional Website" value={d.website} editing={editing} onChange={(v) => setForm(f => ({...f, website: v}))} />
              <SocialItem icon={Linkedin} label="LinkedIn" value={d.linkedin} editing={editing} onChange={(v) => setForm(f => ({...f, linkedin: v}))} />
              <SocialItem icon={Twitter} label="Twitter / X" value={d.twitter} editing={editing} onChange={(v) => setForm(f => ({...f, twitter: v}))} />
              <SocialItem icon={Github} label="GitHub" value={d.github} editing={editing} onChange={(v) => setForm(f => ({...f, github: v}))} />
              <SocialItem icon={Facebook} label="Facebook" value={d.facebook} editing={editing} onChange={(v) => setForm(f => ({...f, facebook: v}))} />
            </div>
          </Section>
        </div>

        {/* Right Column: Information Forms */}
        <div className="lg:col-span-8 space-y-8">
          <Section icon={User} title="Core Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="First Name" icon={User} error={validationErrors.firstName}>
                {editing ? <PremiumInput value={form.firstName} onChange={(v) => setForm(f => ({...f, firstName: v}))} placeholder="Rabiul" /> 
                         : <ViewBox value={d.firstName} />}
              </InputGroup>
              <InputGroup label="Last Name" icon={User} error={validationErrors.lastName}>
                {editing ? <PremiumInput value={form.lastName} onChange={(v) => setForm(f => ({...f, lastName: v}))} placeholder="Islam" />
                         : <ViewBox value={d.lastName} />}
              </InputGroup>
              <InputGroup label="Email Address" icon={Mail}>
                <PremiumInput value={d.email} readOnly />
              </InputGroup>
              <InputGroup label="Phone Number" icon={Phone}>
                {editing ? <PremiumInput value={form.phone} onChange={(v) => setForm(f => ({...f, phone: v}))} placeholder="+1 234 567 890" />
                         : <ViewBox value={d.phone} />}
              </InputGroup>
              <div className="md:col-span-2">
                <InputGroup label="Professional Bio" icon={Edit3}>
                  {editing ? <PremiumTextarea value={form.bio} onChange={(v) => setForm(f => ({...f, bio: v}))} placeholder="Tell us your story..." />
                           : <ViewBox value={d.bio} long />}
                </InputGroup>
              </div>
            </div>
          </Section>

          <Section icon={Building2} title="Venture Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Startup Name" icon={Building2}>
                {editing ? <PremiumInput value={form.companyName} onChange={(v) => setForm(f => ({...f, companyName: v}))} placeholder="My Venture" />
                         : <ViewBox value={d.companyName} />}
              </InputGroup>
              <InputGroup label="Venture Website" icon={Globe}>
                {editing ? <PremiumInput value={form.companyWebsite} onChange={(v) => setForm(f => ({...f, companyWebsite: v}))} placeholder="https://venture.com" />
                         : <ViewBox value={d.companyWebsite} isLink />}
              </InputGroup>
              <InputGroup label="Startup Stage" icon={Rocket}>
                {editing ? (
                  <select 
                    value={form.startupStage || ""} 
                    onChange={(e) => setForm(f => ({...f, startupStage: e.target.value}))}
                    className="w-full bg-white/[0.03] border border-white/10 text-white focus:border-[#01F27B]/50 focus:bg-[#01F27B]/5 rounded-2xl px-5 py-3.5 text-sm outline-none transition-all"
                  >
                    <option value="" className="bg-black">Select Stage</option>
                    {STAGES.map(s => <option key={s} value={s} className="bg-black">{s}</option>)}
                  </select>
                ) : <ViewBox value={d.startupStage} />}
              </InputGroup>
              <InputGroup label="Location" icon={MapPin}>
                {editing ? <PremiumInput value={form.location} onChange={(v) => setForm(f => ({...f, location: v}))} placeholder="New York, NY" />
                         : <ViewBox value={d.location} />}
              </InputGroup>
              <div className="md:col-span-2">
                <InputGroup label="Startup Mission" icon={ShieldCheck}>
                  {editing ? <PremiumTextarea value={form.startupDescription} onChange={(v) => setForm(f => ({...f, startupDescription: v}))} placeholder="What problem are you solving?" />
                           : <ViewBox value={d.startupDescription} long />}
                </InputGroup>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Sub-Components ─────────────────────────────────────────────────────────

function Section({ icon: Icon, title, children }) {
  return (
    <Card className="bg-white/[0.03] backdrop-blur-xl border-white/10 p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-[#01F27B]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#01F27B]" />
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight uppercase">{title}</h3>
      </div>
      {children}
    </Card>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-[#01F27B]/30 transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#01F27B]/10 transition-colors">
        <Icon className="w-6 h-6 text-white/30 group-hover:text-[#01F27B]" />
      </div>
      <div>
        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{label}</p>
        <p className="text-base font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function SocialItem({ icon: Icon, label, value, editing, onChange }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-white/30" />
      </div>
      {editing ? (
        <PremiumInput value={value} onChange={onChange} placeholder={`https://${label.toLowerCase()}.com/...`} />
      ) : (
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">{label}</p>
          {value ? (
            <a href={value} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#01F27B] hover:underline truncate block flex items-center gap-1.5 group">
              {value}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ) : (
            <p className="text-sm font-medium text-white/20 italic">Not connected</p>
          )}
        </div>
      )}
    </div>
  );
}

function ViewBox({ value, long = false, isLink = false }) {
  const content = value?.trim();
  if (!content) return <p className="text-sm font-medium text-white/20 italic p-3.5 bg-white/[0.02] rounded-2xl border border-dashed border-white/5">Not provided</p>;
  
  return (
    <div className={`p-4 bg-white/[0.02] rounded-2xl border border-white/5 transition-all hover:bg-white/[0.04]`}>
      {isLink ? (
        <a href={content} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#01F27B] hover:underline flex items-center gap-2">
          {content}
          <ExternalLink className="w-3 h-3" />
        </a>
      ) : (
        <p className={`text-sm text-white/80 leading-relaxed ${long ? 'whitespace-pre-wrap' : 'truncate'}`}>
          {content}
        </p>
      )}
    </div>
  );
}

const TrendingUp = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;
const ShieldCheck = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>;
const Rocket = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3"></path><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5"></path></svg>;
