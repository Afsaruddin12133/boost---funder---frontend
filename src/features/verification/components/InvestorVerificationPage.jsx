import { Badge, Button, Card, Loader } from "@/shared/ui";
import {
    AlertTriangle,
    Camera,
    CheckCircle,
    ChevronRight,
    Clock,
    FileText,
    Lock,
    RefreshCw,
    ShieldCheck,
    ShieldX,
    Upload,
    X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
    useInvestorVerificationStatus,
    useSubmitInvestorVerification,
} from "../hooks/useInvestorVerification";
import { useAuth } from "../../auth/hooks/useAuth";

const DOC_TYPES = [
  {
    id: "nic",
    label: "National ID Card (NIC)",
    description: "Front and back photos of your NIC",
    fields: [
      { key: "nicFront", label: "NIC - Front Side", hint: "Clear photo of the front" },
      { key: "nicBack", label: "NIC - Back Side", hint: "Clear photo of the back" },
    ],
  },
  {
    id: "passport",
    label: "Passport",
    description: "Bio-data page of your valid passport",
    fields: [
      { key: "passport", label: "Passport Bio-Data Page", hint: "Photo must show your name and photo clearly" },
    ],
  },
  {
    id: "drivingLicence",
    label: "Driving Licence",
    description: "Clear photo of your driving licence",
    fields: [
      { key: "drivingLicence", label: "Driving Licence", hint: "Front side showing your details" },
    ],
  },
];

const STEPS = [
  { id: 1, label: "Document Type" },
  { id: 2, label: "Documents" },
  { id: 3, label: "Selfie" },
  { id: 4, label: "Review" },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "pdf"];

const STATUS_META = {
  approved: {
    icon: ShieldCheck,
    color: "text-[#01F27B]",
    bg: "bg-[#01F27B]/10 border-[#01F27B]/20",
    badge: "bg-[#01F27B]/10 text-[#01F27B] border-[#01F27B]/30",
    label: "Verified",
    headline: "Your identity has been verified",
    sub: "You now have a verified badge on your investor profile.",
  },
  pending: {
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    label: "Under Review",
    headline: "Documents under review",
    sub: "Our team is reviewing your documents. This usually takes 1 to 2 business days.",
  },
  rejected: {
    icon: ShieldX,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
    label: "Rejected",
    headline: "Verification rejected",
    sub: "Please review the reason below and re-submit corrected documents.",
  },
};

const getExtension = (name = "") => name.split(".").pop().toLowerCase();

const validateFile = (file) => {
  if (!file) return "File required";
  if (file.size > MAX_FILE_SIZE) return "File exceeds 5MB limit";

  const ext = getExtension(file.name);
  const isAllowedType = ALLOWED_MIME_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext);
  if (!isAllowedType) return "Unsupported file type";

  return null;
};

function FileDropZone({
  fieldKey,
  label,
  hint,
  file,
  error,
  onChange,
  disabled,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (file && file.type?.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl("");
    return undefined;
  }, [file]);

  const handleFile = (candidate) => {
    const nextError = validateFile(candidate);
    if (nextError) {
      onChange(fieldKey, null, nextError);
      toast.error(nextError);
      return;
    }
    onChange(fieldKey, candidate, null);
  };

  const onPick = (filesList) => {
    if (!filesList?.length) return;
    handleFile(filesList[0]);
  };

  return (
    <div>
      <p className="text-sm font-medium text-white/80 mb-2">{label}</p>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          if (disabled) return;
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          if (disabled) return;
          e.preventDefault();
          setDragging(false);
          onPick(e.dataTransfer.files);
        }}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center p-4 min-h-[120px] ${
          disabled
            ? "border-white/5 bg-white/[0.02] opacity-60 cursor-not-allowed"
            : file
            ? "border-[#01F27B]/50 bg-[#01F27B]/5"
            : dragging
            ? "border-[#01F27B] bg-[#01F27B]/10"
            : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
          className="hidden"
          disabled={disabled}
          onChange={(e) => onPick(e.target.files)}
        />

        {file ? (
          <>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#01F27B]/10 rounded-lg flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />
                ) : (
                  <FileText className="w-5 h-5 text-[#01F27B]" />
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-white/40">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(fieldKey, null, "File required");
                }}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/10 hover:bg-red-500/20 flex items-center justify-center transition-all"
              >
                <X className="w-3 h-3 text-white/60" />
              </button>
            )}
            <p className="text-xs text-[#01F27B] mt-3">File selected - click to change</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <Upload className="w-5 h-5 text-white/30" />
            </div>
            <p className="text-sm text-white/50 mb-1">Drop file here or <span className="text-[#01F27B]">click to upload</span></p>
            <p className="text-xs text-white/30">{hint}</p>
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
    </div>
  );
}

export default function InvestorVerificationPage() {
  const {
    data: statusData,
    isLoading: statusLoading,
    refetch: refetchStatus,
  } = useInvestorVerificationStatus();
  const { user } = useAuth();
  const submitMutation = useSubmitInvestorVerification();

  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState("");
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [allowResubmit, setAllowResubmit] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isRecentlySubmitted, setIsRecentlySubmitted] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const userRaw = localStorage.getItem("boostfundr_user");
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (u?.id) {
          return localStorage.getItem(`investor_verification_submitted_${u.id}`) === "true";
        }
      }
    } catch (e) {
      console.error("Error reading persistence flag", e);
    }
    return false;
  });

  const status = statusData?.verification?.status || statusData?.status || null;
  const rejectionReason = statusData?.verification?.rejectionReason || statusData?.rejectionReason || null;

  // Persist submission state
  useEffect(() => {
    if (!user?.id) return;
    const storageKey = `investor_verification_submitted_${user.id}`;
    const wasSubmitted = localStorage.getItem(storageKey);

    if (wasSubmitted === "true") {
      if (status === "pending" || status === "approved" || status === "rejected") {
        localStorage.removeItem(storageKey);
        setIsRecentlySubmitted(false);
      } else {
        setIsRecentlySubmitted(true);
      }
    }
  }, [status, user?.id]);

  const selectedDocType = useMemo(
    () => DOC_TYPES.find((d) => d.id === selectedType) || null,
    [selectedType]
  );

  const docFields = selectedDocType?.fields?.map((f) => f.key) || [];
  const requiredKeys = useMemo(() => [...docFields, "selfie"], [docFields]);
  const fieldLabels = useMemo(() => {
    const map = { selfie: "Selfie" };
    DOC_TYPES.forEach((type) => {
      type.fields.forEach((field) => {
        map[field.key] = field.label;
      });
    });
    return map;
  }, []);

  const docReady = docFields.length > 0 && docFields.every((key) => files[key] && !errors[key]);
  const selfieReady = !!files.selfie && !errors.selfie;
  const canSubmit = docReady && selfieReady && !submitMutation.isPending;

  const markMissing = (keys) => {
    setErrors((prev) => {
      const next = { ...prev };
      keys.forEach((key) => {
        if (!files[key]) next[key] = "File required";
      });
      return next;
    });
  };

  const handleFileChange = (key, file, error) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
    setErrors((prev) => ({ ...prev, [key]: error }));
  };

  const resetForm = () => {
    setStep(0);
    setSelectedType("");
    setFiles({});
    setErrors({});
  };

  const handleNext = () => {
    if (step === 0) {
      if (!selectedType) {
        toast.error("Select a document type to continue.");
        return;
      }
      setStep(1);
      return;
    }

    if (step === 1) {
      markMissing(docFields);
      if (!docReady) {
        toast.error("Upload all required document files.");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      markMissing(["selfie"]);
      if (!selfieReady) {
        toast.error("Selfie is required for verification.");
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    if (status === "pending" || status === "approved") {
      toast.error("Verification is already in progress or approved.");
      return;
    }

    const formData = new FormData();
    if (selectedType === "nic") {
      formData.append("nicFront", files.nicFront);
      formData.append("nicBack", files.nicBack);
    } else if (selectedType === "passport") {
      formData.append("passport", files.passport);
    } else if (selectedType === "drivingLicence") {
      formData.append("drivingLicence", files.drivingLicence);
    }
    formData.append("selfie", files.selfie);

    submitMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Documents submitted for review.");
        if (user?.id) {
          localStorage.setItem(`investor_verification_submitted_${user.id}`, "true");
        }
        setIsRecentlySubmitted(true);
        resetForm();
        setAllowResubmit(false);
        refetchStatus();
      },
      onError: (err) => {
        const message = err?.message || "Submission failed. Please try again.";
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes("409") || lowerMessage.includes("conflict")) {
          toast.error("You already have a verification request. Please check your status.");
        } else {
          toast.error(message);
        }
        refetchStatus();
      },
    });
  };

  if (statusLoading) {
    return <Loader label="Loading verification status..." />;
  }

  const meta = STATUS_META[status];
  const showForm = !isRecentlySubmitted && ((status === null && isStarted) || (status === "rejected" && allowResubmit));

  return (
    <div className="w-full pb-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 md:gap-6 border-b border-white/5 pb-6 md:pb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1 md:mb-1.5">
            <ShieldCheck className="w-6 h-6 text-[#01F27B] md:hidden shrink-0" />
            <h1 className="text-2xl md:text-4xl font-bold md:font-black tracking-normal md:tracking-tighter text-white uppercase italic">Investor Verification</h1>
          </div>
          <p className="text-white/50 md:text-white/40 text-sm md:text-base md:font-medium md:tracking-wide">
            Verify your identity to unlock premium investor features and priority deal access.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full">
        <Card className="bg-gradient-to-br from-[#0a1b12] via-[#060f0a] to-[#0b1f14] border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#01F27B]/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="p-6 md:p-8 space-y-8 relative z-10">
            {status === "rejected" && allowResubmit && meta && (
              <div className={`border p-5 rounded-xl ${meta.bg}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-500/20`}>
                    <meta.icon className={`w-5 h-5 ${meta.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{meta.headline}</span>
                      <Badge className={`text-[10px] border ${meta.badge}`}>{meta.label}</Badge>
                    </div>
                    <p className="text-sm text-white/60">{meta.sub}</p>
                    {rejectionReason && (
                      <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-xs font-semibold text-red-400 mb-1">Reason for rejection:</p>
                        <p className="text-sm text-white/70">{rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!status && !isStarted && !isRecentlySubmitted && (
              <div className="flex flex-col items-center justify-center p-10 md:p-14 text-center rounded-2xl border border-[#01F27B]/20 bg-gradient-to-b from-[#01F27B]/5 to-transparent relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#01F27B]/50 to-transparent" />
                <div className="w-20 h-20 rounded-full bg-[#01F27B]/10 flex items-center justify-center mb-6 border border-[#01F27B]/20 shadow-[0_0_30px_rgba(1,242,123,0.15)]">
                  <ShieldCheck className="w-10 h-10 text-[#01F27B]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 uppercase tracking-tight">Verification Required</h2>
                <p className="text-white/60 max-w-md mx-auto mb-8 leading-relaxed">
                  Verify your identity to unlock premium investment opportunities, access private pitch decks, and connect with top-tier startup founders.
                </p>
                <Button 
                  onClick={() => setIsStarted(true)}
                  className="bg-[#01F27B] hover:bg-[#00d66d] text-black font-black rounded-xl px-8 h-12 shadow-[0_0_20px_rgba(1,242,123,0.3)] hover:scale-[1.02] transition-all flex items-center gap-2"
                >
                  Start Verification
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            )}

            {status === "approved" && (
              <div className="flex flex-col items-center justify-center p-10 md:p-14 text-center rounded-2xl border border-[#01F27B]/20 bg-gradient-to-b from-[#01F27B]/5 to-transparent relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#01F27B]/50 to-transparent" />
                <div className="w-20 h-20 rounded-full bg-[#01F27B]/10 flex items-center justify-center mb-6 border border-[#01F27B]/20 shadow-[0_0_30px_rgba(1,242,123,0.15)]">
                  <CheckCircle className="w-10 h-10 text-[#01F27B]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Verified Investor</h2>
                <p className="text-white/60 max-w-md mx-auto mb-6 leading-relaxed">
                  Your identity has been successfully verified. You now have full access to the BoostFundr investment platform.
                </p>
                <Badge className="bg-[#01F27B]/10 text-[#01F27B] border border-[#01F27B]/30 px-4 py-1.5 text-sm uppercase font-black">
                  Elite Investor
                </Badge>
              </div>
            )}

            {(status === "pending" || isRecentlySubmitted) && (
              <div className="flex flex-col items-center justify-center p-10 md:p-14 text-center rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                    <Clock className="w-12 h-12 text-amber-400" />
                  </div>
                  <div className="absolute -inset-2 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-[spin_3s_linear_infinite]" />
                </div>
                <div className="space-y-4 max-w-lg">
                  <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/30 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest">Awaiting Review</Badge>
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter italic">Compliance in Progress</h2>
                  <p className="text-white/60 text-sm md:text-base leading-relaxed">
                    We are currently validating your investor credentials. You will receive an email and dashboard notification once approved.
                  </p>
                  <div className="pt-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <p className="text-xs text-white/40 font-medium">Standard processing time: <span className="text-white/70 font-bold">24 Hours</span></p>
                  </div>
                </div>
              </div>
            )}

            {status === "rejected" && !allowResubmit && (
              <div className="flex flex-col items-center justify-center p-10 md:p-14 text-center rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-500/5 to-transparent relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                  <ShieldX className="w-10 h-10 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 italic">Update Required</h2>
                <p className="text-white/60 max-w-md mx-auto mb-8 leading-relaxed">
                  Our compliance team flagged an issue: <span className="text-red-400 font-medium">{rejectionReason || "Illegible document photo."}</span>
                </p>
                <Button onClick={() => { resetForm(); setAllowResubmit(true); }} className="bg-[#01F27B] hover:bg-[#00d66d] text-black font-black rounded-xl px-8 h-12 shadow-[0_0_20px_rgba(1,242,123,0.3)] hover:scale-[1.02] transition-all flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </Button>
              </div>
            )}

            {showForm && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Verification Steps</h3>
                    <p className="text-xs text-white/40">Step {step + 1} of {STEPS.length}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {STEPS.map((item, index) => {
                    const isActive = index === step;
                    const isComplete = index < step;
                    return (
                      <div key={item.id} className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-2 transition-all duration-300 ${isActive ? "border-[#01F27B]/40 bg-[#01F27B]/10" : isComplete ? "border-[#01F27B]/20 bg-[#01F27B]/5" : "border-white/10 bg-white/[0.02]"}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold ${isComplete ? "bg-[#01F27B] text-black" : isActive ? "bg-[#01F27B]/20 text-[#01F27B]" : "bg-white/10 text-white/40"}`}>
                          {isComplete ? <CheckCircle className="w-4 h-4" /> : item.id}
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-tighter hidden md:block ${isActive ? "text-white" : "text-white/60"}`}>{item.label}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-white/5 pt-6">
                  {step === 0 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-4">
                      <h3 className="text-sm font-semibold text-white">Choose Document Type</h3>
                      <div className="space-y-3">
                        {DOC_TYPES.map((doc) => (
                          <button key={doc.id} type="button" onClick={() => setSelectedType(doc.id)} className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${selectedType === doc.id ? "border-[#01F27B]/60 bg-[#01F27B]/10" : "border-white/10 bg-white/[0.02] hover:bg-white/5"}`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedType === doc.id ? "border-[#01F27B] bg-[#01F27B]" : "border-white/30"}`}>
                                {selectedType === doc.id && <div className="w-2 h-2 rounded-full bg-black" />}
                              </div>
                              <div>
                                <p className={`text-sm font-bold ${selectedType === doc.id ? "text-[#01F27B]" : "text-white/80"}`}>{doc.label}</p>
                                <p className="text-xs text-white/40">{doc.description}</p>
                              </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 ${selectedType === doc.id ? "text-[#01F27B]" : "text-white/20"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                      <h3 className="text-sm font-semibold text-white">Upload Your Document</h3>
                      <div className={`grid gap-3 ${selectedDocType?.fields.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {selectedDocType?.fields.map((field) => (
                          <FileDropZone key={field.key} fieldKey={field.key} label={field.label} hint={field.hint} file={files[field.key] || null} error={errors[field.key]} onChange={handleFileChange} />
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                      <h3 className="text-sm font-semibold text-white">Security Selfie</h3>
                      <FileDropZone fieldKey="selfie" label="Your Live Selfie" hint="Ensure your face matches your ID card" file={files.selfie || null} error={errors.selfie} onChange={handleFileChange} />
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5 text-[10px] text-white/40">
                        <Camera className="w-3.5 h-3.5 shrink-0" />
                        Live face matching is required for investor status to prevent fraudulent access to private deals.
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                      <h3 className="text-sm font-semibold text-white">Final Review</h3>
                      <div className="space-y-2">
                        {requiredKeys.map((key) => (
                          <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-white/30" />
                              <div className="text-left">
                                <p className="text-xs text-white/70 font-bold">{fieldLabels[key]}</p>
                                <p className="text-[10px] text-white/30 truncate max-w-[150px]">{files[key]?.name}</p>
                              </div>
                            </div>
                            <Badge className="text-[10px] bg-[#01F27B]/10 text-[#01F27B] border-0">Ready</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {showForm && (
            <div className="border-t border-white/5 p-6 bg-black/20 flex justify-between gap-3 relative z-10">
              <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0} className="border-white/10 text-white/60 hover:text-white rounded-xl px-6">Back</Button>
              {step < 3 ? (
                <Button type="button" onClick={handleNext} className="bg-[#01F27B] hover:bg-[#00d66d] text-black font-black rounded-xl px-8 shadow-[0_0_20px_rgba(1,242,123,0.2)]">Continue</Button>
              ) : (
                <Button type="button" onClick={handleSubmit} disabled={!canSubmit || submitMutation.isPending} className="bg-[#01F27B] hover:bg-[#00d66d] text-black font-black rounded-xl px-8 shadow-[0_0_20px_rgba(1,242,123,0.3)]">
                  {submitMutation.isPending ? "Submitting..." : "Submit for Verification"}
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
