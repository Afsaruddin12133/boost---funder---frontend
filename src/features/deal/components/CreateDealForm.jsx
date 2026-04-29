import { useState, useRef } from "react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { createDeal, updateDeal } from "../services/deal.service";
import toast from "react-hot-toast";
import {
  ArrowLeft, ArrowRight, CheckCircle, Upload,
  Rocket, DollarSign, Calendar, Tag, Layers,
  Briefcase, Globe, Users, FileText, HelpCircle,
  Image as ImageIcon, Loader2, X, Plus
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = ["tech", "health", "finance", "education", "cleantech", "ecommerce", "saas", "other"];
const STAGES = ["idea", "MVP", "growth", "scale"];
const CURRENCIES = ["USD", "AED", "EUR", "GBP", "SAR"];

const STEPS = [
  { id: 1, label: "Basics",   icon: Rocket,    desc: "Core deal details" },
  { id: 2, label: "Story",    icon: FileText,   desc: "Your startup narrative" },
  { id: 3, label: "Team",     icon: Users,      desc: "People & funds" },
  { id: 4, label: "Media",    icon: ImageIcon,  desc: "Upload assets" },
];

// ─── Small field components ───────────────────────────────────────────────────

function Field({ label, icon: Icon, error, children }) {
  return (
    <div>
      <Label className="text-white/70 text-sm mb-2 flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-[#01F27B]" />}
        {label}
      </Label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function StyledInput({ className = "", ...props }) {
  return (
    <Input
      className={`bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#01F27B]/50 focus:ring-[#01F27B]/20 rounded-xl h-11 ${className}`}
      {...props}
    />
  );
}

function StyledSelect({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full h-11 rounded-xl bg-white/5 border border-white/10 text-white px-3 text-sm focus:outline-none focus:border-[#01F27B]/50 appearance-none cursor-pointer"
    >
      {placeholder && <option value="" disabled className="bg-[#0c0c0c]">{placeholder}</option>}
      {options.map(o => (
        <option key={o.value ?? o} value={o.value ?? o} className="bg-[#0c0c0c]">
          {o.label ?? o}
        </option>
      ))}
    </select>
  );
}

function StyledTextarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#01F27B]/50 px-3 py-2.5 text-sm resize-none ${className}`}
      {...props}
    />
  );
}

// ─── Step 1 – Basic Info ──────────────────────────────────────────────────────

function Step1({ data, onChange, errors }) {
  return (
    <div className="space-y-5">
      <Field label="Startup Name" icon={Rocket} error={errors.startupName}>
        <StyledInput
          placeholder="e.g. EcoPulse Solutions"
          value={data.startupName}
          onChange={e => onChange("startupName", e.target.value)}
        />
      </Field>

      <Field label="Short Pitch (max 200 chars)" icon={Tag} error={errors.shortPitch}>
        <StyledTextarea
          rows={3}
          placeholder="One-liner that explains what you do and why it matters..."
          value={data.shortPitch}
          onChange={e => onChange("shortPitch", e.target.value)}
          maxLength={200}
        />
        <p className="text-right text-xs text-white/30 mt-1">{data.shortPitch.length}/200</p>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Category" icon={Tag} error={errors.category}>
          <StyledSelect
            value={data.category}
            onChange={e => onChange("category", e.target.value)}
            placeholder="Select category"
            options={CATEGORIES.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))}
          />
        </Field>

        <Field label="Stage" icon={Layers} error={errors.stage}>
          <StyledSelect
            value={data.stage}
            onChange={e => onChange("stage", e.target.value)}
            placeholder="Select stage"
            options={STAGES.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
          />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Field label="Goal Amount" icon={DollarSign} error={errors.goalAmount}>
            <StyledInput
              type="number"
              placeholder="250000"
              value={data.goalAmount}
              onChange={e => onChange("goalAmount", e.target.value)}
              min={1}
            />
          </Field>
        </div>
        <Field label="Currency" error={errors.currency}>
          <StyledSelect
            value={data.currency}
            onChange={e => onChange("currency", e.target.value)}
            placeholder="Currency"
            options={CURRENCIES}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Deadline" icon={Calendar} error={errors.deadline}>
          <StyledInput
            type="date"
            value={data.deadline}
            onChange={e => onChange("deadline", e.target.value)}
            className="cursor-pointer"
          />
        </Field>
        <Field label="Location" icon={Globe}>
          <StyledInput
            placeholder="e.g. Dubai, UAE"
            value={data.location}
            onChange={e => onChange("location", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Tagline">
        <StyledInput
          placeholder="A catchy one-liner for your brand"
          value={data.tagline}
          onChange={e => onChange("tagline", e.target.value)}
        />
      </Field>
    </div>
  );
}

// ─── Step 2 – Story ───────────────────────────────────────────────────────────

function Step2({ data, onChange }) {
  const textFields = [
    { key: "problem",       label: "Problem",        placeholder: "What problem are you solving?" },
    { key: "solution",      label: "Solution",       placeholder: "How does your product solve it?" },
    { key: "businessModel", label: "Business Model", placeholder: "How do you make money?" },
    { key: "market",        label: "Market",         placeholder: "Who are your customers? How big is the market?" },
    { key: "traction",      label: "Traction",       placeholder: "MRR, users, partnerships, key milestones..." },
  ];

  return (
    <div className="space-y-5">
      {textFields.map(({ key, label, placeholder }) => (
        <Field key={key} label={label} icon={FileText}>
          <StyledTextarea
            rows={3}
            placeholder={placeholder}
            value={data[key]}
            onChange={e => onChange(key, e.target.value)}
          />
        </Field>
      ))}
    </div>
  );
}

// ─── Step 3 – Team & Funds ────────────────────────────────────────────────────

function Step3({ data, onChange }) {
  const textFields = [
    { key: "founderDetails", label: "About the Founder",   icon: Users,     placeholder: "Your background, experience, vision..." },
    { key: "team",           label: "Team",                icon: Users,     placeholder: "Who are the key team members?" },
    { key: "geography",      label: "Geography",           icon: Globe,     placeholder: "Where are you operating?" },
    { key: "useOfFunds",     label: "Use of Funds",        icon: DollarSign, placeholder: "How will you deploy the capital raised?" },
    { key: "founderContact", label: "Founder Contact",     icon: Briefcase, placeholder: "Email or LinkedIn for investor outreach" },
  ];

  return (
    <div className="space-y-5">
      {textFields.map(({ key, label, icon, placeholder }) => (
        <Field key={key} label={label} icon={icon}>
          <StyledTextarea
            rows={3}
            placeholder={placeholder}
            value={data[key]}
            onChange={e => onChange(key, e.target.value)}
          />
        </Field>
      ))}

      {/* Traction Highlights */}
      <TractionHighlights value={data.tractionHighlights} onChange={v => onChange("tractionHighlights", v)} />

      {/* FAQ */}
      <FAQEditor value={data.faq} onChange={v => onChange("faq", v)} />
    </div>
  );
}

function TractionHighlights({ value, onChange }) {
  const [input, setInput] = useState("");
  const add = () => {
    if (input.trim()) { onChange([...value, input.trim()]); setInput(""); }
  };
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  return (
    <Field label="Traction Highlights" icon={CheckCircle}>
      <div className="flex gap-2 mb-2">
        <StyledInput
          placeholder="e.g. $500K ARR"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
        />
        <Button type="button" onClick={add} className="bg-[#01F27B]/10 border border-[#01F27B]/20 text-[#01F27B] hover:bg-[#01F27B]/20 rounded-xl px-3">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((h, i) => (
          <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#01F27B]/10 border border-[#01F27B]/20 text-[#01F27B] text-xs font-medium">
            {h}
            <button type="button" onClick={() => remove(i)} className="hover:text-white ml-1">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </Field>
  );
}

function FAQEditor({ value, onChange }) {
  const [input, setInput] = useState("");
  const add = () => {
    if (input.trim()) { onChange([...value, input.trim()]); setInput(""); }
  };
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  return (
    <Field label="FAQ" icon={HelpCircle}>
      <div className="flex gap-2 mb-2">
        <StyledInput
          placeholder="Add a frequently asked question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
        />
        <Button type="button" onClick={add} className="bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl px-3">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {value.map((q, i) => (
          <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-white/5 border border-white/5 text-sm text-white/80">
            <span className="flex-1">{q}</span>
            <button type="button" onClick={() => remove(i)} className="text-white/40 hover:text-red-400 mt-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </Field>
  );
}

// ─── Step 4 – Media ───────────────────────────────────────────────────────────

function Step4({ data, onChange, errors }) {
  const mediaRef = useRef();
  const privateRef = useRef();

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    onChange("mediaFiles", [...(data.mediaFiles || []), ...files]);
  };

  const handlePrivateChange = (e) => {
    const files = Array.from(e.target.files);
    onChange("privateFiles", [...(data.privateFiles || []), ...files]);
  };

  const removeMedia = (i) => onChange("mediaFiles", data.mediaFiles.filter((_, idx) => idx !== i));
  const removePrivate = (i) => onChange("privateFiles", data.privateFiles.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-6">
      {/* Media Upload */}
      <Field label="Deal Media (images/videos) *" icon={ImageIcon} error={errors.mediaFiles}>
        <div
          onClick={() => mediaRef.current.click()}
          className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-[#01F27B]/40 hover:bg-[#01F27B]/5 transition-all group"
        >
          <div className="w-12 h-12 bg-[#01F27B]/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#01F27B]/20 transition-colors">
            <Upload className="w-6 h-6 text-[#01F27B]" />
          </div>
          <p className="text-white/60 text-sm mb-1">Drag & drop or click to upload</p>
          <p className="text-white/30 text-xs">PNG, JPG, MP4 — at least 1 required</p>
          <input ref={mediaRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleMediaChange} />
        </div>
        {data.mediaFiles?.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {data.mediaFiles.map((f, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden bg-white/5 border border-white/10 p-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#01F27B] shrink-0" />
                <span className="text-xs text-white/70 truncate flex-1">{f.name}</span>
                <button type="button" onClick={() => removeMedia(i)} className="text-white/30 hover:text-red-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Field>

      {/* Pitch Deck */}
      <Field label="Pitch Deck URL" icon={FileText}>
        <StyledInput
          placeholder="https://drive.google.com/..."
          value={data.pitchDeck}
          onChange={e => onChange("pitchDeck", e.target.value)}
        />
      </Field>

      {/* Financial Details */}
      <Field label="Financial Details" icon={DollarSign}>
        <StyledTextarea
          rows={3}
          placeholder="Revenue projections, burn rate, runway..."
          value={data.financialDetails}
          onChange={e => onChange("financialDetails", e.target.value)}
        />
      </Field>

      {/* Detailed Traction */}
      <Field label="Detailed Traction Data">
        <StyledTextarea
          rows={3}
          placeholder="MoM growth charts, cohort analysis, key metrics..."
          value={data.detailedTractionData}
          onChange={e => onChange("detailedTractionData", e.target.value)}
        />
      </Field>

      {/* Private Documents */}
      <Field label="Private Documents (NDA-protected)" icon={FileText}>
        <div
          onClick={() => privateRef.current.click()}
          className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center cursor-pointer hover:border-white/20 hover:bg-white/5 transition-all"
        >
          <Upload className="w-5 h-5 text-white/40 mx-auto mb-2" />
          <p className="text-white/40 text-xs">Upload confidential documents</p>
          <input ref={privateRef} type="file" multiple accept=".pdf,.doc,.docx" className="hidden" onChange={handlePrivateChange} />
        </div>
        {data.privateFiles?.length > 0 && (
          <div className="mt-2 space-y-1">
            {data.privateFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 text-xs text-white/70">
                <FileText className="w-3.5 h-3.5 text-white/40" />
                <span className="flex-1 truncate">{f.name}</span>
                <button type="button" onClick={() => removePrivate(i)} className="text-white/30 hover:text-red-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Field>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const INITIAL = {
  startupName: "", shortPitch: "", category: "", stage: "", goalAmount: "",
  currency: "USD", deadline: "", location: "", tagline: "", problem: "",
  solution: "", businessModel: "", market: "", traction: "", founderDetails: "",
  team: "", geography: "", useOfFunds: "", founderContact: "",
  pitchDeck: "", financialDetails: "", detailedTractionData: "",
  tractionHighlights: [], faq: [],
  mediaFiles: [], privateFiles: [],
};

function validateStep1(d) {
  const e = {};
  if (!d.startupName.trim()) e.startupName = "Required";
  if (!d.shortPitch.trim()) e.shortPitch = "Required";
  if (!d.category) e.category = "Select a category";
  if (!d.stage) e.stage = "Select a stage";
  if (!d.goalAmount || Number(d.goalAmount) < 1) e.goalAmount = "Must be > 0";
  if (!d.currency) e.currency = "Required";
  if (!d.deadline) e.deadline = "Required";
  return e;
}

function validateStep4(d) {
  const e = {};
  if (!d.mediaFiles?.length) e.mediaFiles = "At least one media file is required";
  return e;
}

export default function CreateDealForm({ onSuccess, onCancel, initialData }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(() => {
    if (initialData) {
      return {
        ...INITIAL,
        ...initialData,
        deadline: initialData.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : "",
        mediaFiles: [], // keep empty initially, can't pre-fill File objects from URLs
        privateFiles: [],
      };
    }
    return INITIAL;
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(initialData?._id || initialData?.id);

  const onChange = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const next = () => {
    if (step === 1) {
      const e = validateStep1(data);
      if (Object.keys(e).length) { setErrors(e); return; }
    }
    setErrors({});
    setStep(s => Math.min(s + 1, 4));
  };

  const back = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    const e = validateStep4(data);
    if (Object.keys(e).length) { setErrors(e); return; }

    setSubmitting(true);
    try {
      const fd = new FormData();
      // Required fields
      fd.append("startupName", data.startupName);
      fd.append("shortPitch", data.shortPitch);
      fd.append("category", data.category);
      fd.append("stage", data.stage);
      fd.append("goalAmount", data.goalAmount);
      fd.append("currency", data.currency);
      fd.append("deadline", data.deadline);

      // Optional text fields
      const optionals = [
        "location","tagline","problem","solution","businessModel","market",
        "traction","founderDetails","team","geography","useOfFunds",
        "founderContact","pitchDeck","financialDetails","detailedTractionData",
      ];
      optionals.forEach(k => { if (data[k]) fd.append(k, data[k]); });

      // Arrays
      data.tractionHighlights.forEach(h => fd.append("tractionHighlights[]", h));
      data.faq.forEach(q => fd.append("faq[]", q));

      // Files
      data.mediaFiles.forEach(f => fd.append("media", f));
      data.privateFiles.forEach(f => fd.append("privateDocuments", f));

      if (isEditing) {
        await updateDeal(initialData._id || initialData.id, fd);
        toast.success("🚀 Deal updated successfully!");
      } else {
        await createDeal(fd);
        toast.success("🚀 Deal created successfully!");
      }
      
      onSuccess?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || `Failed to ${isEditing ? "update" : "create"} deal. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  const stepComponents = [
    <Step1 key={1} data={data} onChange={onChange} errors={errors} />,
    <Step2 key={2} data={data} onChange={onChange} errors={errors} />,
    <Step3 key={3} data={data} onChange={onChange} errors={errors} />,
    <Step4 key={4} data={data} onChange={onChange} errors={errors} />,
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#01F27B] rounded-xl flex items-center justify-center">
            <Rocket className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{isEditing ? "Edit Deal" : "Create New Deal"}</h1>
            <p className="text-white/50 text-sm">
              {isEditing ? "Update your startup details" : "Fill in the details to list your startup"}
            </p>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((s, i) => {
          const active = step === s.id;
          const done = step > s.id;
          return (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  done ? "bg-[#01F27B] text-black" :
                  active ? "bg-[#01F27B]/20 border-2 border-[#01F27B] text-[#01F27B]" :
                  "bg-white/5 border border-white/10 text-white/30"
                }`}>
                  {done ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                </div>
                <span className={`mt-1.5 text-xs font-medium ${active ? "text-[#01F27B]" : done ? "text-white/70" : "text-white/30"}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mt-[-12px] rounded-full transition-colors ${done ? "bg-[#01F27B]" : "bg-white/10"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Form Card */}
      <Card className="bg-[#0a0f0c] border-white/10 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(1,242,123,0.05)]">
        {/* Step label bar */}
        <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-white">{STEPS[step - 1].label}</h2>
            <p className="text-xs text-white/40 mt-0.5">{STEPS[step - 1].desc}</p>
          </div>
          <span className="text-xs text-white/30 font-mono">Step {step} of {STEPS.length}</span>
        </div>

        {/* Content */}
        <div className="px-8 py-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {stepComponents[step - 1]}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-white/5 flex items-center justify-between bg-black/20">
          <Button
            type="button"
            variant="ghost"
            onClick={step === 1 ? onCancel : back}
            className="text-white/60 hover:text-white hover:bg-white/5 rounded-xl px-5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {step === 1 ? "Cancel" : "Back"}
          </Button>

          {step < 4 ? (
            <Button
              type="button"
              onClick={next}
              className="bg-[#01F27B] hover:bg-[#01F27B]/90 text-black font-semibold rounded-xl px-6 shadow-[0_0_20px_rgba(1,242,123,0.25)] hover:shadow-[0_0_30px_rgba(1,242,123,0.4)] transition-all"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-[#01F27B] hover:bg-[#01F27B]/90 text-black font-semibold rounded-xl px-8 shadow-[0_0_20px_rgba(1,242,123,0.25)] hover:shadow-[0_0_30px_rgba(1,242,123,0.4)] transition-all disabled:opacity-60"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  {isEditing ? "Save Changes" : "Launch Deal"}
                </span>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
