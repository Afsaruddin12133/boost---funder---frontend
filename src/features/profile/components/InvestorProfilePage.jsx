import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  CheckCircle, Edit3, Save, X, Camera, MapPin, Target,
  DollarSign, Globe, Linkedin, Twitter, Github, Facebook,
  Briefcase, RefreshCw, AlertCircle, User, Mail, Phone,
  ChevronRight, ExternalLink, Plus, Tag
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Loader } from "@/shared/ui/loader";
import { getInvestorProfile, updateInvestorProfile } from "../services/profile.service";
import { useInvestorVerificationStatus } from "@/features/verification/hooks/useInvestorVerification";
import { useAuth } from "@/features/auth/hooks/useAuth";

// ─── Flatten API Response ──────────────────────────────────────────────────
function flattenProfile(user) {
  if (!user) return null;
  const ext = user.profile || {};
  const prefs = ext.investmentPreferences || {};
  
  return {
    firstName:          user.firstName            || "",
    lastName:           user.lastName             || "",
    email:              user.email                || "",
    isVerified:         !!user.isVerified,
    phone:              ext.phone                 || "",
    location:           ext.location              || "",
    bio:                ext.bio                   || "",
    website:            ext.website               || "",
    interests:          Array.isArray(ext.interests) ? ext.interests : [],
    sectors:            Array.isArray(prefs.sectors) ? prefs.sectors : [],
    minInvestment:      prefs.minInvestment       ?? "",
    maxInvestment:      prefs.maxInvestment       ?? "",
    profileImage:       ext.profileImage          || null,
    linkedin:           ext.socialLinks?.linkedin  || "",
    twitter:            ext.socialLinks?.twitter   || "",
    github:             ext.socialLinks?.github    || "",
    facebook:           ext.socialLinks?.facebook  || "",
  };
}

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

const ChipInput = ({ values, onAdd, onRemove, placeholder }) => {
  const [input, setInput] = useState("");
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      onAdd(input.trim());
      setInput("");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {values.map((v, i) => (
          <Badge key={i} className="bg-[#01F27B]/10 text-[#01F27B] border-[#01F27B]/20 py-1.5 px-3 rounded-xl flex items-center gap-2 group">
            <span className="text-xs font-bold">{v}</span>
            <button onClick={() => onRemove(v)} className="hover:text-white transition-colors">
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="relative">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-white/[0.03] border border-white/10 text-white focus:border-[#01F27B]/50 focus:bg-[#01F27B]/5 rounded-2xl px-5 py-3.5 text-sm transition-all outline-none placeholder:text-white/20"
        />
        <Plus className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function InvestorProfilePage() {
  const { data: verStatus } = useInvestorVerificationStatus();
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
      const data = await getInvestorProfile();
      setRawUser(data);
      updateUser(data); 
    } catch (e) {
      setFetchErr(e?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

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
    const e = {};
    if (!form.firstName?.trim()) e.firstName = "Required";
    if (Object.keys(e).length > 0) {
      setValidationErrors(e);
      toast.error("Please fill in required fields.");
      return;
    }

    const fd = new FormData();
    
    // Account Info
    ['firstName', 'lastName', 'email', 'phone', 'location', 'bio', 'website'].forEach(key => {
      if (form[key] !== null && form[key] !== undefined) fd.append(key, form[key]);
    });

    // Preferences
    fd.append('investmentPreferences.minInvestment', form.minInvestment || 0);
    fd.append('investmentPreferences.maxInvestment', form.maxInvestment || 0);
    
    form.interests.forEach(i => fd.append('interests[]', i));
    form.sectors.forEach(s => fd.append('investmentPreferences.sectors[]', s));

    // Socials
    ['linkedin', 'twitter', 'facebook', 'github'].forEach(key => {
      if (form[key]) fd.append(`socialLinks.${key}`, form[key]);
    });

    if (avatarFile) fd.append("profileImage", avatarFile);

    setSaving(true);
    try {
      await updateInvestorProfile(fd);
      toast.success("Elite profile updated!");
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

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader label="Synchronizing profile data..." /></div>;

  if (fetchErr) return (
    <Card className="bg-white/5 border-white/10 p-12 text-center max-w-lg mx-auto mt-20">
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Sync Interrupted</h3>
      <p className="text-white/40 mb-6">{fetchErr}</p>
      <Button onClick={fetchProfile} className="bg-[#01F27B] text-black font-bold rounded-xl px-8">
        <RefreshCw className="w-4 h-4 mr-2" /> Reconnect
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
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#01F27B]/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
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
                  <span className="text-[10px] font-black text-[#01F27B] uppercase tracking-widest">Update Identity</span>
                </button>
              )}
            </div>
            
            {isVerified && (
              <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-[#01F27B] rounded-2xl border-4 border-black flex items-center justify-center shadow-[0_0_20px_rgba(1,242,123,0.4)] z-20">
                <CheckCircle className="w-5 h-5 text-black" strokeWidth={3} />
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase italic">
                  {d.firstName || "Elite"} <span className="text-[#01F27B]">{d.lastName || "Investor"}</span>
                </h1>
                {isVerified && (
                  <Badge className="bg-[#01F27B]/10 text-[#01F27B] border-[#01F27B]/20 py-1.5 px-4 rounded-full font-black tracking-widest text-[10px] uppercase">
                    Verified Alpha
                  </Badge>
                )}
              </div>
              <p className="text-white/40 font-bold tracking-wide flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4 text-[#01F27B]/50" />
                {d.email}
              </p>
            </div>

            <p className="text-white/60 text-base lg:text-lg leading-relaxed max-w-2xl font-medium">
              {d.bio || "High-net-worth individual focused on disruptive technology and early-stage ventures. Complete your profile to build trust with top-tier founders."}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                <MapPin className="w-4 h-4 text-[#01F27B]" />
                <span className="text-sm font-bold text-white/80">{d.location || "Global Capital"}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                <Briefcase className="w-4 h-4 text-[#01F27B]" />
                <span className="text-sm font-bold text-white/80">{d.minInvestment ? `$${Number(d.minInvestment).toLocaleString()} Min` : "Venture Capital"}</span>
              </div>
            </div>
          </div>

          <div className="flex-none pt-4 md:pt-0">
            {!editing ? (
              <Button 
                onClick={enterEditMode}
                className="bg-[#01F27B] hover:bg-[#00d66d] text-black font-black px-8 h-12 rounded-2xl flex items-center gap-2 shadow-[0_10px_25px_rgba(1,242,123,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Edit3 className="w-5 h-5" />
                <span>Refine Profile</span>
              </Button>
            ) : (
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#01F27B] hover:bg-[#00d66d] text-black font-black px-10 h-12 rounded-2xl flex items-center gap-2 shadow-[0_10px_25px_rgba(1,242,123,0.3)]"
                >
                  {saving ? <Loader size="sm" className="border-black" /> : <Save className="w-5 h-5" />}
                  <span>{saving ? "Updating..." : "Commit Changes"}</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Strategy & Social */}
        <div className="lg:col-span-4 space-y-8">
          <Section icon={Target} title="Investment Strategy">
            <div className="space-y-6">
              <InputGroup label="Min Investment ($)" icon={DollarSign}>
                {editing ? <PremiumInput type="number" value={form.minInvestment} onChange={(v) => setForm(f => ({...f, minInvestment: v}))} placeholder="10000" />
                         : <ViewBox value={d.minInvestment ? `$${Number(d.minInvestment).toLocaleString()}` : null} />}
              </InputGroup>
              <InputGroup label="Max Investment ($)" icon={DollarSign}>
                {editing ? <PremiumInput type="number" value={form.maxInvestment} onChange={(v) => setForm(f => ({...f, maxInvestment: v}))} placeholder="100000" />
                         : <ViewBox value={d.maxInvestment ? `$${Number(d.maxInvestment).toLocaleString()}` : null} />}
              </InputGroup>
              <InputGroup label="Preferred Sectors" icon={Tag}>
                {editing ? (
                  <ChipInput 
                    values={form.sectors} 
                    onAdd={(v) => setForm(f => ({...f, sectors: [...f.sectors, v]}))}
                    onRemove={(v) => setForm(f => ({...f, sectors: f.sectors.filter(s => s !== v)}))}
                    placeholder="Type sector and press Enter..."
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {d.sectors.length > 0 ? d.sectors.map((s, i) => <Badge key={i} className="bg-white/5 text-white/70 border-white/10 px-3 py-1">{s}</Badge>) : <p className="text-sm text-white/20 italic">No sectors specified</p>}
                  </div>
                )}
              </InputGroup>
            </div>
          </Section>

          <Section icon={Globe} title="Network">
            <div className="space-y-4">
              <SocialItem icon={Linkedin} label="LinkedIn" value={d.linkedin} editing={editing} onChange={(v) => setForm(f => ({...f, linkedin: v}))} />
              <SocialItem icon={Twitter} label="Twitter / X" value={d.twitter} editing={editing} onChange={(v) => setForm(f => ({...f, twitter: v}))} />
              <SocialItem icon={Github} label="GitHub" value={d.github} editing={editing} onChange={(v) => setForm(f => ({...f, github: v}))} />
              <SocialItem icon={Facebook} label="Facebook" value={d.facebook} editing={editing} onChange={(v) => setForm(f => ({...f, facebook: v}))} />
            </div>
          </Section>
        </div>

        {/* Right Column: Profile Details */}
        <div className="lg:col-span-8 space-y-8">
          <Section icon={User} title="Identity & Contact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="First Name" icon={User} error={validationErrors.firstName}>
                {editing ? <PremiumInput value={form.firstName} onChange={(v) => setForm(f => ({...f, firstName: v}))} /> 
                         : <ViewBox value={d.firstName} />}
              </InputGroup>
              <InputGroup label="Last Name" icon={User}>
                {editing ? <PremiumInput value={form.lastName} onChange={(v) => setForm(f => ({...f, lastName: v}))} />
                         : <ViewBox value={d.lastName} />}
              </InputGroup>
              <InputGroup label="Email" icon={Mail}>
                <PremiumInput value={d.email} readOnly />
              </InputGroup>
              <InputGroup label="Phone" icon={Phone}>
                {editing ? <PremiumInput value={form.phone} onChange={(v) => setForm(f => ({...f, phone: v}))} placeholder="+1..." />
                         : <ViewBox value={d.phone} />}
              </InputGroup>
              <InputGroup label="Location" icon={MapPin}>
                {editing ? <PremiumInput value={form.location} onChange={(v) => setForm(f => ({...f, location: v}))} placeholder="London, UK" />
                         : <ViewBox value={d.location} />}
              </InputGroup>
              <InputGroup label="Personal Website" icon={Globe}>
                {editing ? <PremiumInput value={form.website} onChange={(v) => setForm(f => ({...f, website: v}))} placeholder="https://..." />
                         : <ViewBox value={d.website} isLink />}
              </InputGroup>
            </div>
          </Section>

          <Section icon={Tag} title="About & Interests">
            <div className="space-y-6">
              <InputGroup label="Professional Bio" icon={Edit3}>
                {editing ? <PremiumTextarea value={form.bio} onChange={(v) => setForm(f => ({...f, bio: v}))} placeholder="Describe your investment thesis..." />
                         : <ViewBox value={d.bio} long />}
              </InputGroup>
              <InputGroup label="Personal Interests" icon={Tag}>
                {editing ? (
                  <ChipInput 
                    values={form.interests} 
                    onAdd={(v) => setForm(f => ({...f, interests: [...f.interests, v]}))}
                    onRemove={(v) => setForm(f => ({...f, interests: f.interests.filter(s => s !== v)}))}
                    placeholder="Type interest and press Enter..."
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {d.interests.length > 0 ? d.interests.map((s, i) => <Badge key={i} className="bg-white/5 text-white/70 border-white/10 px-3 py-1">{s}</Badge>) : <p className="text-sm text-white/20 italic">No interests listed</p>}
                  </div>
                )}
              </InputGroup>
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
  const content = String(value || "").trim();
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
