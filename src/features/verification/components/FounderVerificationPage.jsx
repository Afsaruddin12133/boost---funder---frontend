import { Badge, Button, Card, Loader } from "@/shared/ui";
import {
    AlertTriangle,
    CheckCircle,
    ChevronRight,
    Clock,
    FileText,
    RefreshCw,
    ShieldCheck,
    ShieldX,
    Upload,
    X
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
    useSubmitVerification,
    useVerificationStatus,
} from "../hooks/useVerification";
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
  { id: 3, label: "Review" },
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
    sub: "You now have a verified badge on your founder profile.",
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

export default function FounderVerificationPage() {
  const {
    data: statusData,
    isLoading: statusLoading,
    refetch: refetchStatus,
  } = useVerificationStatus();
  const { user } = useAuth();
  const submitMutation = useSubmitVerification();

  useEffect(() => {
    console.log("DEBUG VerificationPage: Status API Response:", statusData);
    console.log("DEBUG VerificationPage: User Data:", user);
  }, [statusData, user]);

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
          return localStorage.getItem(`verification_submitted_${u.id}`) === "true";
        }
      }
    } catch (e) {
      console.error("Error reading persistence flag", e);
    }
    return false;
  });

  const statusString = (
    (typeof statusData === 'string' ? statusData : statusData?.status) || 
    statusData?.verification?.status ||
    (typeof statusData?.data === 'string' ? statusData?.data : statusData?.data?.status) ||
    ""
  ).toLowerCase();

  const status = (statusString === "approved" || statusString === "verified" || statusString === "success") ? "approved" : (statusString || null);
  const rejectionReason = statusData?.rejectionReason || statusData?.verification?.rejectionReason || null;

  // Persist submission state across reloads/route changes
  useEffect(() => {
    if (!user?.id) return;
    const storageKey = `verification_submitted_${user.id}`;
    const wasSubmitted = localStorage.getItem(storageKey);

    if (wasSubmitted === "true") {
      if (status === "pending" || status === "approved" || status === "rejected") {
        // Real status found, clear the local flag
        localStorage.removeItem(storageKey);
        setIsRecentlySubmitted(false);
      } else {
        // Still no status from server, keep the local flag active
        setIsRecentlySubmitted(true);
      }
    }
  }, [status, user?.id]);

  const selectedDocType = useMemo(
    () => DOC_TYPES.find((d) => d.id === selectedType) || null,
    [selectedType]
  );

  const docFields = selectedDocType?.fields?.map((f) => f.key) || [];
  const requiredKeys = useMemo(() => [...docFields], [docFields]);
  const fieldLabels = useMemo(() => {
    const map = {};
    DOC_TYPES.forEach((type) => {
      type.fields.forEach((field) => {
        map[field.key] = field.label;
      });
    });
    return map;
  }, []);

  const docReady = docFields.length > 0 && docFields.every((key) => files[key] && !errors[key]);
  const canSubmit = docReady && !submitMutation.isPending;

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

    submitMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Documents submitted for review.");
        if (user?.id) {
          localStorage.setItem(`verification_submitted_${user.id}`, "true");
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
  const lockForm = status === "pending" || status === "approved";

  return (
    <div className="w-full pb-8 space-y-6 md:space-y-8">
      {/* Page header - Responsive: Mobile matches old design, Desktop matches My Deals */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 md:gap-6 border-b border-white/5 pb-6 md:pb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1 md:mb-1.5">
            <ShieldCheck className="w-6 h-6 text-[#01F27B] md:hidden shrink-0" />
            <h1 className="text-2xl md:text-4xl font-bold md:font-black tracking-normal md:tracking-tighter text-white">Founder Verification</h1>
          </div>
          <p className="text-white/50 md:text-white/40 text-sm md:text-base md:font-medium md:tracking-wide">
            Verify your identity to unlock your founder profile and submit deals to investors.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full">
        <Card className="bg-gradient-to-br from-[#0a1b12] via-[#060f0a] to-[#0b1f14] border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#01F27B]/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="p-6 md:p-8 space-y-8 relative z-10">
          <div className="space-y-6">
            {status === "rejected" && allowResubmit && meta && (
              <div className={`border p-5 rounded-xl ${meta.bg}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    status === "approved"
                      ? "bg-[#01F27B]/20"
                      : status === "pending"
                      ? "bg-amber-500/20"
                      : "bg-red-500/20"
                  }`}>
                    <meta.icon className={`w-5 h-5 ${meta.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{meta.headline}</span>
                      <Badge className={`text-[10px] border ${meta.badge}`}>{meta.label}</Badge>
                    </div>
                    <p className="text-sm text-white/60">{meta.sub}</p>
                    {status === "rejected" && rejectionReason && (
                      <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-xs font-semibold text-red-400 mb-1">Reason for rejection:</p>
                        <p className="text-sm text-white/70">{rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>

                {status === "approved" && (
                  <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-[#01F27B]/10">
                    <CheckCircle className="w-4 h-4 text-[#01F27B] shrink-0" />
                    <p className="text-xs text-white/70">
                      Your <span className="text-[#01F27B] font-medium">Verified</span> badge is now visible on your founder profile.
                    </p>
                  </div>
                )}
              </div>
            )}

            {!status && !isStarted && !isRecentlySubmitted && (
              <div className="flex flex-col items-center justify-center p-10 md:p-14 text-center rounded-2xl border border-[#01F27B]/20 bg-gradient-to-b from-[#01F27B]/5 to-transparent relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#01F27B]/50 to-transparent" />
                <div className="w-20 h-20 rounded-full bg-[#01F27B]/10 flex items-center justify-center mb-6 border border-[#01F27B]/20 shadow-[0_0_30px_rgba(1,242,123,0.15)]">
                  <ShieldCheck className="w-10 h-10 text-[#01F27B]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Verification Required</h2>
                <p className="text-white/60 max-w-md mx-auto mb-8 leading-relaxed">
                  To protect our community of investors and founders, we require a quick identity verification before you can submit deals.
                </p>
                <Button 
                  onClick={() => setIsStarted(true)}
                  className="bg-[#01F27B] hover:bg-[#00d66d] text-black font-black rounded-xl px-8 h-12 shadow-[0_0_20px_rgba(1,242,123,0.3)] hover:scale-[1.02] transition-all flex items-center gap-2"
                >
                  Apply for Verification
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
                <h2 className="text-2xl font-bold text-white mb-3">Identity Verified</h2>
                <p className="text-white/60 max-w-md mx-auto mb-6 leading-relaxed">
                  Congratulations! Your founder profile is fully verified. You can now create and submit deals to investors.
                </p>
                <Badge className="bg-[#01F27B]/10 text-[#01F27B] border border-[#01F27B]/30 px-4 py-1.5 text-sm">
                  Verified Founder
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
                  <div className="absolute -inset-5 rounded-full border border-amber-500/10 border-b-amber-500/40 animate-[spin_6s_linear_infinite_reverse]" />
                </div>

                <div className="space-y-4 max-w-lg">
                  <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/30 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest">
                    Awaiting Review
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter">
                    Waiting for Admin Review
                  </h2>
                  <p className="text-white/60 text-sm md:text-base leading-relaxed">
                    Kindly wait for the <span className="text-amber-400 font-bold">Owner's review</span>. Our team is currently validating your documents. Once the review is complete, you will be notified.
                  </p>
                  <div className="pt-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <p className="text-xs text-white/40 font-medium">
                      You will be automatically verified once the review is complete. This typically takes <span className="text-white/70">24-48 hours</span>.
                    </p>
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
                <h2 className="text-2xl font-bold text-white mb-3">Verification Failed</h2>
                <p className="text-white/60 max-w-md mx-auto mb-8 leading-relaxed">
                  We could not verify your identity. <span className="text-red-400 font-medium">{rejectionReason || "Invalid documents."}</span>
                </p>
                <Button
                  onClick={() => {
                    resetForm();
                    setAllowResubmit(true);
                  }}
                  className="bg-[#01F27B] hover:bg-[#00d66d] text-black font-black rounded-xl px-8 h-12 shadow-[0_0_20px_rgba(1,242,123,0.3)] hover:scale-[1.02] transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Re-submit Documents
                </Button>
              </div>
            )}

            {showForm && (
              <div className="space-y-8">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                  <ShieldCheck className="w-4 h-4 text-[#01F27B] mt-0.5 shrink-0" />
                  <p className="text-xs text-white/50 leading-relaxed">
                    Your documents are encrypted and stored securely. They are only used to verify your identity and are never shared with third parties.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white">Verification Steps</h3>
                        <p className="text-xs text-white/40">Follow the steps to complete verification</p>
                      </div>
                      <Badge className="text-[10px] border border-white/10 bg-white/5 text-white/60">
                        Step {step + 1} of {STEPS.length}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {STEPS.map((item, index) => {
                        const isActive = index === step;
                        const isComplete = index < step;
                        return (
                          <div
                            key={item.id}
                            className={`flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-2 rounded-xl border p-2 lg:px-4 lg:py-3 transition-all duration-300 ${
                              isActive
                                ? "border-[#01F27B]/40 bg-[#01F27B]/10 shadow-[0_0_20px_rgba(1,242,123,0.1)]"
                                : isComplete
                                ? "border-[#01F27B]/20 bg-[#01F27B]/5"
                                : "border-white/10 bg-white/[0.02]"
                            }`}
                          >
                            <div className={`w-6 h-6 lg:w-7 lg:h-7 shrink-0 rounded-full flex items-center justify-center text-[10px] lg:text-xs font-semibold ${
                              isComplete
                                ? "bg-[#01F27B] text-black"
                              : isActive
                                ? "bg-[#01F27B]/20 text-[#01F27B]"
                                : "bg-white/10 text-white/40"
                            }`}>
                              {isComplete ? <CheckCircle className="w-4 h-4" /> : item.id}
                            </div>
                            <span className={`text-[10px] lg:text-xs font-medium text-center lg:text-left ${isActive ? "text-white" : "text-white/60"}`}>{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6 space-y-6">
                  {step === 0 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                      <h3 className="text-sm font-semibold text-white mb-1">Step 1 - Choose document type</h3>
                      <p className="text-xs text-white/40 mb-4">Select one option only</p>
                      <div className="space-y-3">
                        {DOC_TYPES.map((doc) => (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => {
                              if (lockForm) return;
                              setSelectedType(doc.id);
                              setFiles((prev) => ({ ...prev, nicFront: null, nicBack: null, passport: null, drivingLicence: null }));
                              setErrors((prev) => ({ ...prev, nicFront: null, nicBack: null, passport: null, drivingLicence: null }));
                            }}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-300 ${
                              selectedType === doc.id
                                ? "border-[#01F27B]/60 bg-[#01F27B]/10 shadow-[0_0_30px_rgba(1,242,123,0.1)]"
                                : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5 hover:scale-[1.01]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                selectedType === doc.id
                                  ? "border-[#01F27B] bg-[#01F27B]"
                                  : "border-white/30"
                              }`}>
                                {selectedType === doc.id && <div className="w-2 h-2 rounded-full bg-black" />}
                              </div>
                              <div>
                                <p className={`text-sm font-medium ${selectedType === doc.id ? "text-[#01F27B]" : "text-white/80"}`}>
                                  {doc.label}
                                </p>
                                <p className="text-xs text-white/40">{doc.description}</p>
                              </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-all ${selectedType === doc.id ? "text-[#01F27B]" : "text-white/20"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-1">Step 2 - Upload your document</h3>
                        <p className="text-xs text-white/40 mb-4">Accepted: JPG, JPEG, PNG, WebP, PDF. Max file size: 5 MB per file.</p>
                      </div>
                      {selectedDocType ? (
                        <div className={`grid gap-3 ${selectedDocType.fields.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                          {selectedDocType.fields.map((field) => (
                            <FileDropZone
                              key={field.key}
                              fieldKey={field.key}
                              label={field.label}
                              hint={field.hint}
                              file={files[field.key] || null}
                              error={errors[field.key]}
                              onChange={handleFileChange}
                              disabled={lockForm}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-400">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <p className="text-xs">Select a document type to continue.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-1">Step 3 - Review and submit</h3>
                        <p className="text-xs text-white/40">Confirm your files before submitting.</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-white/60">Document Type</p>
                          <span className="text-xs font-medium text-[#01F27B]">{selectedDocType?.label || "-"}</span>
                        </div>

                        <div className="space-y-2">
                          {requiredKeys.map((key) => (
                            <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-white/40" />
                                </div>
                                <div>
                                  <p className="text-xs text-white/70">{fieldLabels[key] || key}</p>
                                  <p className="text-xs text-white/40">
                                    {files[key]?.name || "Missing file"}
                                  </p>
                                </div>
                              </div>
                              {files[key] ? (
                                <Badge className="text-[10px] border border-[#01F27B]/30 bg-[#01F27B]/10 text-[#01F27B]">Ready</Badge>
                              ) : (
                                <Badge className="text-[10px] border border-red-500/30 bg-red-500/10 text-red-400">Missing</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {showForm && (
          <div className="border-t border-white/5 p-6 bg-black/20 flex flex-col sm:flex-row gap-3 justify-between relative z-10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((prev) => Math.max(0, prev - 1))}
              disabled={step === 0}
              className="border-white/10 text-white/70 hover:bg-white/5 hover:border-white/20 rounded-xl transition-all"
            >
              Back
            </Button>

            {step < 2 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-[#01F27B] hover:bg-[#00d66d] text-black font-black rounded-xl shadow-[0_0_20px_rgba(1,242,123,0.3)] hover:scale-[1.02] transition-all"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="bg-[#01F27B] hover:bg-[#00d66d] text-black font-black rounded-xl shadow-[0_0_20px_rgba(1,242,123,0.3)] hover:scale-[1.02] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader size="sm" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Submit for Verification
                  </span>
                )}
              </Button>
            )}
          </div>
        )}
        </Card>
      </div>
    </div>
  );
}
