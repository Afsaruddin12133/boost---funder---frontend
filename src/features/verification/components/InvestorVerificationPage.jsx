import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
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
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center p-6 min-h-[160px] ${
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
  const submitMutation = useSubmitInvestorVerification();

  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState("");
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [allowResubmit, setAllowResubmit] = useState(false);

  const status = statusData?.status || null;
  const rejectionReason = statusData?.rejectionReason || null;

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
        resetForm();
        setAllowResubmit(false);
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
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex items-center gap-3 text-white/50">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading verification status...</span>
        </div>
      </div>
    );
  }

  const meta = STATUS_META[status];
  const showForm = status === null || (status === "rejected" && allowResubmit);
  const lockForm = status === "pending" || status === "approved";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#01F27B]" />
          Investor Verification
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Verify your identity to unlock trusted investor features and priority deal access.
        </p>
      </div>

      {meta && (
        <Card className={`border p-5 ${meta.bg}`}>
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
                Your <span className="text-[#01F27B] font-medium">Verified</span> badge is now visible on your investor profile.
              </p>
            </div>
          )}
        </Card>
      )}

      {!status && (
        <Card className="border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-white/40" />
            </div>
            <div>
              <p className="font-medium text-white">Not verified yet</p>
              <p className="text-sm text-white/50 mt-0.5">Submit your identity document and selfie to begin verification.</p>
            </div>
          </div>
        </Card>
      )}

      {status === "rejected" && !allowResubmit && (
        <Card className="bg-[#0c0c0c] border-white/10 p-6 text-center">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="font-semibold text-white mb-2">Update your documents</p>
          <p className="text-sm text-white/50 max-w-sm mx-auto">
            Fix the issues listed above and re-submit your documents to continue.
          </p>
          <Button
            onClick={() => {
              resetForm();
              setAllowResubmit(true);
            }}
            className="mt-5 w-full bg-[#01F27B] hover:bg-[#01F27B]/90 text-black font-semibold rounded-xl"
          >
            Re-submit documents
          </Button>
        </Card>
      )}

      {status === "pending" && (
        <Card className="bg-[#0c0c0c] border-white/10 p-6 text-center">
          <Clock className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <p className="font-semibold text-white mb-2">Review in progress</p>
          <p className="text-sm text-white/50 max-w-sm mx-auto">
            Your documents are being reviewed by our compliance team. You will be notified once a decision is made.
          </p>
          <p className="text-xs text-white/30 mt-4">Re-submission is locked while your documents are under review.</p>
        </Card>
      )}

      {showForm && (
        <Card className="bg-[#0c0c0c] border-white/10 p-6 space-y-6">
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
              <div className="flex flex-col md:flex-row gap-3">
                {STEPS.map((item, index) => {
                  const isActive = index === step;
                  const isComplete = index < step;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 flex-1 transition-all ${
                        isActive
                          ? "border-[#01F27B]/40 bg-[#01F27B]/10"
                          : isComplete
                          ? "border-[#01F27B]/20 bg-[#01F27B]/5"
                          : "border-white/10 bg-white/[0.02]"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                        isComplete
                          ? "bg-[#01F27B] text-black"
                          : isActive
                          ? "bg-[#01F27B]/20 text-[#01F27B]"
                          : "bg-white/10 text-white/40"
                      }`}>
                        {isComplete ? <CheckCircle className="w-4 h-4" /> : item.id}
                      </div>
                      <span className={`text-xs font-medium ${isActive ? "text-white" : "text-white/60"}`}>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 space-y-6">
            {step === 0 && (
              <div>
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
                      className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                        selectedType === doc.id
                          ? "border-[#01F27B]/60 bg-[#01F27B]/5"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
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
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">Step 2 - Upload your document</h3>
                  <p className="text-xs text-white/40 mb-4">Accepted: JPG, JPEG, PNG, WebP, PDF. Max file size: 5 MB per file.</p>
                </div>
                {selectedDocType ? (
                  selectedDocType.fields.map((field) => (
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
                  ))
                ) : (
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <p className="text-xs">Select a document type to continue.</p>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">Step 3 - Upload a selfie</h3>
                  <p className="text-xs text-white/40 mb-4">Make sure your face is clear, well-lit, and matches your ID.</p>
                </div>
                <FileDropZone
                  fieldKey="selfie"
                  label="Selfie"
                  hint="Use a live selfie. Avoid hats or sunglasses."
                  file={files.selfie || null}
                  error={errors.selfie}
                  onChange={handleFileChange}
                  disabled={lockForm}
                />
                <div className="flex items-start gap-2 text-xs text-white/40">
                  <Camera className="w-4 h-4 text-white/40 shrink-0" />
                  Your selfie is only used for identity matching and is stored securely.
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">Step 4 - Review and submit</h3>
                  <p className="text-xs text-white/40">Confirm your files before submitting.</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/60">Document Type</p>
                    <span className="text-xs font-medium text-white">{selectedDocType?.label || "-"}</span>
                  </div>

                  <div className="space-y-2">
                    {requiredKeys.map((key) => (
                      <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
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

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row gap-3 justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((prev) => Math.max(0, prev - 1))}
              disabled={step === 0}
              className="border-white/10 text-white/70 hover:bg-white/5 rounded-xl"
            >
              Back
            </Button>

            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-[#01F27B] hover:bg-[#01F27B]/90 text-black font-semibold rounded-xl"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="bg-[#01F27B] hover:bg-[#01F27B]/90 text-black font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
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
        </Card>
      )}
    </div>
  );
}
