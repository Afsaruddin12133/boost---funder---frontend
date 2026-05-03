import { useState, useRef, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  CheckCircle, Edit3, Save, X, Camera, MapPin, Users,
  DollarSign, Globe, Linkedin, Twitter, Github, Facebook,
  Building2, RefreshCw, AlertCircle, User
} from "lucide-react";
import { Button, Card, Badge, Loader } from "@/shared/ui";
import { getFounderProfile, updateFounderProfile } from "../services/profile.service";
import { useVerificationStatus } from "@/features/verification/hooks/useVerification";
import { useAuth } from "@/features/auth/hooks/useAuth";

// ─── Flatten { user: { ..., profile: {...}|null } } → flat object ──────────────
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
    linkedin:           ext.socialLinks?.linkedin  || "",
    twitter:            ext.socialLinks?.twitter   || "",
    github:             ext.socialLinks?.github    || "",
    facebook:           ext.socialLinks?.facebook  || "",
  };
}

const COMPLETION_FIELDS = [
  "firstName","lastName","bio","location","phone",
  "companyName","companyWebsite","startupStage","startupDescription",
  "fundingGoal","teamSize","linkedin","twitter",
];
function calcCompletion(flat) {
  if (!flat) return 0;
  const filled = COMPLETION_FIELDS.filter(
    (k) => flat[k] !== null && flat[k] !== undefined && String(flat[k]).trim() !== ""
  );
  return Math.round((filled.length / COMPLETION_FIELDS.length) * 100);
}

const STAGES = ["Idea","Pre-Seed","Seed","MVP","Early Traction","Series A","Series B","Growth"];

// ─── Plain text for view mode ──────────────────────────────────────────────────
function ViewValue({ value, placeholder = "Not set" }) {
  const v = value !== null && value !== undefined ? String(value).trim() : "";
  return v
    ? <p className="text-sm text-white py-2">{v}</p>
    : <p className="text-sm text-white/25 italic py-2">{placeholder}</p>;
}

// ─── Edit mode inputs ──────────────────────────────────────────────────────────
function EditInput({ value, onChange, placeholder, type = "text", className = "" }) {
  return (
    <input type={type} value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-white/5 border border-[#01F27B]/30 rounded-xl px-4 py-2.5 text-sm text-white
        placeholder:text-white/25 focus:outline-none focus:border-[#01F27B]/70 transition-all ${className}`}
    />
  );
}
function EditTextarea({ value, onChange, placeholder, rows = 4, maxLength }) {
  const len = (value ?? "").length;
  return (
    <div className="relative">
      <textarea value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder} rows={rows} maxLength={maxLength}
        className="w-full bg-white/5 border border-[#01F27B]/30 rounded-xl px-4 py-3 text-sm text-white
          placeholder:text-white/25 focus:outline-none focus:border-[#01F27B]/70 transition-all resize-none"
      />
      {maxLength && (
        <span className={`absolute bottom-3 right-3 text-[10px] ${len > maxLength * 0.9 ? "text-amber-400" : "text-white/20"}`}>
          {len}/{maxLength}
        </span>
      )}
    </div>
  );
}
function EditSelect({ value, onChange, options, placeholder }) {
  return (
    <select value={value ?? ""} onChange={(e) => onChange?.(e.target.value)}
      className="w-full bg-[#0c0c0c] border border-[#01F27B]/30 rounded-xl px-4 py-2.5 text-sm text-white
        focus:outline-none focus:border-[#01F27B]/70 transition-all
        [&>option]:bg-[#0c0c0c] [&>option]:text-white">
      <option value="">{placeholder || "Select…"}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ─── UI helpers ────────────────────────────────────────────────────────────────
function Field({ label, children, hint, error }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-white/25">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
function Section({ icon: Icon, title, children }) {
  return (
    <Card className="bg-[#0c0c0c] border-white/10 p-6 space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-white/5">
        <div className="w-7 h-7 rounded-lg bg-[#01F27B]/10 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-[#01F27B]" />
        </div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      {children}
    </Card>
  );
}
function SocialRow({ icon: Icon, viewValue, editValue, onChange, placeholder, editing }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-white/40" />
      </div>
      {editing
        ? <EditInput value={editValue} onChange={onChange} placeholder={placeholder} className="flex-1" />
        : <div className="flex-1">
            {viewValue
              ? <a href={viewValue} target="_blank" rel="noreferrer" className="text-sm text-[#01F27B] hover:underline truncate block">{viewValue}</a>
              : <p className="text-sm text-white/25 italic">Not set</p>}
          </div>}
    </div>
  );
}
function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-[#01F27B] shrink-0 mt-0.5" />
      <div className="min-w-0">
        <span className="text-[10px] text-white/35 uppercase tracking-wider block">{label}</span>
        <span className="text-xs text-white/85 font-medium break-words">{value || "—"}</span>
      </div>
    </div>
  );
}
function CompletionBar({ percent }) {
  const color = percent < 40 ? "bg-red-400" : percent < 70 ? "bg-amber-400" : "bg-[#01F27B]";
  const text  = percent < 40 ? "text-red-400" : percent < 70 ? "text-amber-400" : "text-[#01F27B]";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <span className="text-[10px] text-white/40 uppercase tracking-widest">Profile Completion</span>
        <span className={`text-xs font-bold ${text}`}>{percent}%</span>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${percent}%` }} />
      </div>
      {percent < 100 && <p className="text-[10px] text-white/30">Fill in more details to build investor trust</p>}
    </div>
  );
}
function Skeleton({ className }) { return <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />; }
function PageSkeleton() {
  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6">
      <Card className="bg-[#0c0c0c] border-white/10 p-6 space-y-4">
        <Skeleton className="w-24 h-24 rounded-2xl mx-auto" />
        <Skeleton className="h-5 w-32 mx-auto" /><Skeleton className="h-3 w-20 mx-auto" />
        <Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-4/5" />
      </Card>
      <div className="space-y-4">
        {[1,2,3].map((i) => (
          <Card key={i} className="bg-[#0c0c0c] border-white/10 p-6 space-y-4">
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10" /><Skeleton className="h-10" />
              <Skeleton className="h-10" /><Skeleton className="h-10" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function FounderProfilePage() {
  const { data: verStatus } = useVerificationStatus();
  const { user: authUser } = useAuth();
  
  // Direct fetch — bypasses React Query data pipeline completely
  const [rawUser, setRawUser] = useState(null);
  const [loading, setLoading]  = useState(true);
  const [fetchErr, setFetchErr] = useState(null);
  const [saving, setSaving]    = useState(false);

  const [editing, setEditing]   = useState(false);
  const [form, setForm]         = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile]       = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const fileRef = useRef(null);

  // Fetch on mount
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setFetchErr(null);
    try {
      const data = await getFounderProfile();
      console.log("[FounderProfilePage] fetched rawUser:", data);
      setRawUser(data);
    } catch (e) {
      console.error("[FounderProfilePage] fetch error:", e);
      setFetchErr(e?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // Flatten API data
  const profile   = flattenProfile(rawUser);
  const isVerified = verStatus?.status === "approved" && authUser?.isVerified !== false;
  const completion = calcCompletion(profile);

  // VIEW → read directly from `profile` (live data)
  // EDIT → read from `form` (mutable snapshot)
  const d = editing ? form : (profile || {});

  const enterEditMode = () => {
    setForm(profile ? { ...profile } : {});
    setEditing(true);
  };
  const set = (key) => (val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setValidationErrors((prev) => ({ ...prev, [key]: undefined }));
  };
  const validate = () => {
    const e = {};
    if (!form.firstName?.trim()) e.firstName = "Required";
    if (!form.lastName?.trim())  e.lastName  = "Required";
    if ((form.bio?.length || 0) > 1000)             e.bio = "Max 1000 chars";
    if ((form.startupDescription?.length || 0) > 2000) e.startupDescription = "Max 2000 chars";
    if (form.fundingGoal !== "" && Number(form.fundingGoal) < 0) e.fundingGoal = "Must be ≥ 0";
    if (form.teamSize    !== "" && Number(form.teamSize)    < 1) e.teamSize    = "Must be ≥ 1";
    setValidationErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleCancel = () => {
    setEditing(false);
    setAvatarPreview(null);
    setAvatarFile(null);
    setValidationErrors({});
  };
  const handleSave = async () => {
    if (!validate()) { toast.error("Please fix the errors before saving."); return; }
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== undefined && String(v).trim() !== "") fd.append(k, v);
    });
    if (avatarFile) fd.append("profileImage", avatarFile);

    setSaving(true);
    try {
      await updateFounderProfile(fd);
      toast.success("Profile updated successfully! 🎉");
      setEditing(false);
      setAvatarPreview(null);
      setAvatarFile(null);
      await fetchProfile(); // re-fetch to show latest data
    } catch (e) {
      toast.error(e?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file."); return; }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  if (loading) return <Loader fullPage label="Loading profile..." />;
  if (fetchErr) return (
    <Card className="bg-[#0c0c0c] border-white/10 p-8 text-center">
      <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
      <p className="text-white/70">{fetchErr}</p>
      <Button onClick={fetchProfile} className="mt-4 bg-white/5 border border-white/10 text-white rounded-xl px-4 h-9 text-sm">
        <RefreshCw className="w-4 h-4 mr-2" /> Retry
      </Button>
    </Card>
  );

  const displayName = `${d.firstName || ""} ${d.lastName || ""}`.trim() || "Unnamed Founder";
  const avatarSrc   = avatarPreview || d.profileImage;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-white/40 text-sm mt-1">Manage how investors see you</p>
        </div>
        {!editing ? (
          <Button onClick={enterEditMode}
            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl h-10 px-5 flex items-center gap-2">
            <Edit3 className="w-4 h-4" /> Edit Profile
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Button onClick={handleCancel} variant="ghost" disabled={saving}
              className="text-white/50 hover:text-white h-10 px-5 rounded-xl">
              <X className="w-4 h-4 mr-1.5" /> Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}
              className="bg-[#01F27B] hover:bg-[#01F27B]/90 text-black font-semibold h-10 px-6 rounded-xl
                shadow-[0_0_20px_rgba(1,242,123,0.2)] flex items-center gap-2 disabled:opacity-50">
              {saving ? <><Loader size="sm" className="mr-2" /> Saving…</>
                      : <><Save className="w-4 h-4" /> Save Changes</>}
            </Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">

        {/* ── SIDEBAR ───────────────────────────────────────────────── */}
        <div className="space-y-4 lg:sticky lg:top-6">
          <Card className="bg-[#0c0c0c] border-white/10 p-6 text-center">
            {/* Avatar */}
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-24 h-24 rounded-2xl bg-[#01F27B]/10 border border-white/10 overflow-hidden flex items-center justify-center">
                {avatarSrc
                  ? <img src={avatarSrc} alt={displayName} className="w-full h-full object-cover" />
                  : <User className="w-10 h-10 text-[#01F27B]/60" />}
              </div>
              {editing && (
                <>
                  <button onClick={() => fileRef.current?.click()}
                    className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </>
              )}
              {isVerified && (
                <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-[#01F27B] rounded-full border-2 border-[#0c0c0c] flex items-center justify-center shadow-[0_0_12px_rgba(1,242,123,0.6)]">
                  <CheckCircle className="w-3.5 h-3.5 text-black" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 flex-wrap mb-1">
              <h2 className="text-lg font-bold text-white">{displayName}</h2>
              {isVerified && (
                <Badge className="bg-[#01F27B] text-black border-0 rounded-full text-[9px] font-bold px-2 py-0.5 flex items-center gap-1">
                  <CheckCircle className="w-2.5 h-2.5" /> Verified
                </Badge>
              )}
            </div>
            <p className="text-xs text-white/40 mb-2">{d.email || "—"}</p>
            {d.startupStage && (
              <Badge className="bg-[#01F27B]/10 text-[#01F27B] border-[#01F27B]/20 rounded-full text-[10px] mb-4">
                {d.startupStage}
              </Badge>
            )}
            {d.bio && (
              <p className="text-xs text-white/55 leading-relaxed text-center mb-4 px-1">
                {d.bio.slice(0, 120)}{d.bio.length > 120 ? "…" : ""}
              </p>
            )}
            <div className="space-y-3 text-left border-t border-white/5 pt-4">
              <StatPill icon={MapPin}     label="Location"     value={d.location} />
              <StatPill icon={Users}      label="Team Size"    value={d.teamSize ? `${d.teamSize} members` : null} />
              <StatPill icon={DollarSign} label="Funding Goal"
                value={d.fundingGoal ? `$${Number(d.fundingGoal).toLocaleString()}` : null} />
              <StatPill icon={Building2}  label="Company"      value={d.companyName} />
            </div>
            <div className="mt-5 border-t border-white/5 pt-5">
              <CompletionBar percent={completion} />
            </div>
          </Card>
        </div>

        {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Section 1: Personal Info */}
          <Section icon={User} title="Personal Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="First Name" error={validationErrors.firstName}>
                {editing ? <EditInput value={form.firstName} onChange={set("firstName")} placeholder="John" />
                         : <ViewValue value={d.firstName} />}
              </Field>
              <Field label="Last Name" error={validationErrors.lastName}>
                {editing ? <EditInput value={form.lastName} onChange={set("lastName")} placeholder="Smith" />
                         : <ViewValue value={d.lastName} />}
              </Field>
              <Field label="Email">
                <ViewValue value={d.email} />
              </Field>
              <Field label="Phone">
                {editing ? <EditInput value={form.phone} onChange={set("phone")} placeholder="+1 234 567 8900" />
                         : <ViewValue value={d.phone} />}
              </Field>
              <Field label="Location">
                {editing ? <EditInput value={form.location} onChange={set("location")} placeholder="City, Country" />
                         : <ViewValue value={d.location} />}
              </Field>
            </div>
            <Field label="Bio" hint="Brief summary shown on your public profile" error={validationErrors.bio}>
              {editing
                ? <EditTextarea value={form.bio} onChange={set("bio")} placeholder="Tell investors about yourself…" rows={4} maxLength={1000} />
                : <ViewValue value={d.bio} />}
            </Field>
          </Section>

          {/* Section 2: Social Links */}
          <Section icon={Globe} title="Social Links">
            <div className="space-y-3">
              <SocialRow icon={Linkedin} viewValue={d.linkedin}  editValue={form.linkedin}  onChange={set("linkedin")}  placeholder="https://linkedin.com/in/yourname" editing={editing} />
              <SocialRow icon={Twitter}  viewValue={d.twitter}   editValue={form.twitter}   onChange={set("twitter")}   placeholder="https://twitter.com/yourhandle"  editing={editing} />
              <SocialRow icon={Github}   viewValue={d.github}    editValue={form.github}    onChange={set("github")}    placeholder="https://github.com/yourhandle"   editing={editing} />
              <SocialRow icon={Facebook} viewValue={d.facebook}  editValue={form.facebook}  onChange={set("facebook")}  placeholder="https://facebook.com/yourpage"   editing={editing} />
            </div>
          </Section>

          {/* Section 3: Company & Startup */}
          <Section icon={Building2} title="Company & Startup">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Company Name">
                {editing ? <EditInput value={form.companyName} onChange={set("companyName")} placeholder="OrbitAnalytics Inc." />
                         : <ViewValue value={d.companyName} />}
              </Field>
              <Field label="Company Website">
                {editing ? <EditInput value={form.companyWebsite} onChange={set("companyWebsite")} placeholder="https://yourcompany.com" />
                         : d.companyWebsite
                           ? <a href={d.companyWebsite} target="_blank" rel="noreferrer" className="text-sm text-[#01F27B] hover:underline py-2 block">{d.companyWebsite}</a>
                           : <ViewValue value={null} />}
              </Field>
              <Field label="Startup Stage">
                {editing
                  ? <EditSelect value={form.startupStage} onChange={set("startupStage")} options={STAGES} placeholder="Select stage" />
                  : d.startupStage
                    ? <div className="py-2"><Badge className="bg-[#01F27B]/10 text-[#01F27B] border-[#01F27B]/20 rounded-full">{d.startupStage}</Badge></div>
                    : <ViewValue value={null} />}
              </Field>
            </div>
            <Field label="Startup Description" hint="Max 2000 characters" error={validationErrors.startupDescription}>
              {editing
                ? <EditTextarea value={form.startupDescription} onChange={set("startupDescription")} placeholder="Describe your startup…" rows={5} maxLength={2000} />
                : <ViewValue value={d.startupDescription} />}
            </Field>
          </Section>

          {/* Section 4: Funding & Team */}
          <Section icon={DollarSign} title="Funding & Team">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Funding Goal (USD)" hint="Total amount you aim to raise" error={validationErrors.fundingGoal}>
                {editing
                  ? <EditInput value={form.fundingGoal} onChange={set("fundingGoal")} placeholder="500000" type="number" />
                  : <ViewValue value={d.fundingGoal ? `$${Number(d.fundingGoal).toLocaleString()}` : null} />}
              </Field>
              <Field label="Team Size" hint="Full-time members" error={validationErrors.teamSize}>
                {editing
                  ? <EditInput value={form.teamSize} onChange={set("teamSize")} placeholder="5" type="number" />
                  : <ViewValue value={d.teamSize ? `${d.teamSize} members` : null} />}
              </Field>
            </div>
          </Section>

          {!editing && (
            <div className="lg:hidden">
              <Button onClick={enterEditMode}
                className="w-full bg-[#01F27B] hover:bg-[#01F27B]/90 text-black font-semibold h-12 rounded-xl">
                <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
