import { useState, useRef } from "react";
import toast from "react-hot-toast";
import {
  ShieldCheck, ShieldX, Clock, Upload, CheckCircle,
  AlertTriangle, RefreshCw, X, Lock, FileText, ChevronRight
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import {
  useVerificationStatus,
  useSubmitVerification,
} from "../hooks/useVerification";

// ─── Document type definitions ───────────────────────────────────────────────
const DOC_TYPES = [
  {
    id: "nic",
    label: "National ID Card (NIC)",
    description: "Front and back photos of your NIC",
    fields: [
      { key: "nicFront", label: "NIC — Front Side", hint: "Clear photo of the front" },
      { key: "nicBack",  label: "NIC — Back Side",  hint: "Clear photo of the back"  },
    ],
  },
  {
    id: "passport",
    label: "Passport",
    description: "Bio-data page of your valid passport",
    fields: [
      { key: "passport", label: "Passport Bio-Data Page", hint: "Photo must show your name, DOB, and photo clearly" },
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

// ─── Status UI map ────────────────────────────────────────────────────────────
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
    sub: "Our team is reviewing your documents. This usually takes 1–2 business days.",
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

// ─── File Drop Zone ────────────────────────────────────────────────────────────
function FileDropZone({ fieldKey, label, hint, file, onChange }) {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (f) => {
    if (f && f.type.startsWith("image/")) onChange(fieldKey, f);
    else toast.error("Please upload an image file (JPG, PNG, WebP).");
  };

  return (
    <div>
      <p className="text-sm font-medium text-white/80 mb-2">{label}</p>
      <div
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center p-6 min-h-[140px] ${
          file
            ? "border-[#01F27B]/50 bg-[#01F27B]/5"
            : dragging
            ? "border-[#01F27B] bg-[#01F27B]/10"
            : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
        }`}
      >
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {file ? (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#01F27B]/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#01F27B]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-white/40">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(fieldKey, null); }}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/10 hover:bg-red-500/20 flex items-center justify-center transition-all"
            >
              <X className="w-3 h-3 text-white/60" />
            </button>
            <p className="text-xs text-[#01F27B] mt-3">✔ File selected — click to change</p>
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
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FounderVerificationPage() {
  const { data: statusData, isLoading: statusLoading, isError: statusError } = useVerificationStatus();
  const submitMutation = useSubmitVerification();

  const [selectedType, setSelectedType] = useState(null);
  const [files, setFiles] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const status = statusData?.status || null; // "approved" | "pending" | "rejected" | null
  const rejectionReason = statusData?.rejectionReason || null;

  const handleFileChange = (key, file) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const selectedDocType = DOC_TYPES.find((d) => d.id === selectedType);

  const requiredKeys = selectedDocType?.fields.map((f) => f.key) || [];
  const allFilesReady = requiredKeys.length > 0 && requiredKeys.every((k) => files[k]);

  const handleSubmit = async () => {
    if (!selectedType || !allFilesReady) {
      toast.error("Please select a document type and upload all required files.");
      return;
    }

    const fd = new FormData();
    requiredKeys.forEach((k) => fd.append(k, files[k]));

    // Debug: log payload before sending to backend
    console.log("=== Verification Submission Payload ===");
    console.log("Document Type:", selectedType);
    for (const [key, value] of fd.entries()) {
      console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.type}, ${value.size}B)` : value);
    }
    console.log("=======================================");

    submitMutation.mutate(fd, {
      onSuccess: () => {
        toast.success("Documents submitted for review! ✅");
        setFiles({});
        setSelectedType(null);
        setSubmitted(true);
      },
      onError: (err) => {
        toast.error(err?.message || "Submission failed. Please try again.");
      },
    });
  };

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (statusLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex items-center gap-3 text-white/50">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading verification status…</span>
        </div>
      </div>
    );
  }

  const meta = STATUS_META[status];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#01F27B]" />
          Identity Verification
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Verified founders receive a trust badge that boosts investor confidence.
        </p>
      </div>

      {/* ─── Status Banner ─────────────────────────────────────────────── */}
      {meta && (
        <Card className={`border p-5 ${meta.bg}`}>
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              status === "approved" ? "bg-[#01F27B]/20" :
              status === "pending"  ? "bg-amber-500/20" : "bg-red-500/20"
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
                Your <span className="text-[#01F27B] font-medium">Verified ✔</span> badge is now visible on your founder profile.
              </p>
            </div>
          )}
        </Card>
      )}

      {/* ─── Not yet submitted banner ──────────────────────────────────── */}
      {!status && !submitted && (
        <Card className="border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-white/40" />
            </div>
            <div>
              <p className="font-medium text-white">Not yet verified</p>
              <p className="text-sm text-white/50 mt-0.5">Upload your identity document below to start the verification process.</p>
            </div>
          </div>
        </Card>
      )}

      {/* ─── Upload Form (hide when approved or pending) ───────────────── */}
      {status !== "approved" && status !== "pending" && (
        <Card className="bg-[#0c0c0c] border-white/10 p-6 space-y-6">
          {/* Security note */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
            <ShieldCheck className="w-4 h-4 text-[#01F27B] mt-0.5 shrink-0" />
            <p className="text-xs text-white/50 leading-relaxed">
              Your documents are <span className="text-white/80">encrypted and stored securely</span>. They are only used to verify your identity and are never shared with third parties.
            </p>
          </div>

          {/* Step 1: Select document type */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Step 1 — Choose document type</h3>
            <p className="text-xs text-white/40 mb-4">Select one option only</p>
            <div className="space-y-3">
              {DOC_TYPES.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => {
                    setSelectedType(doc.id);
                    setFiles({});
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
                      {selectedType === doc.id && (
                        <div className="w-2 h-2 rounded-full bg-black" />
                      )}
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

          {/* Step 2: Upload files */}
          {selectedDocType && (
            <div className="border-t border-white/5 pt-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">Step 2 — Upload your {selectedDocType.label}</h3>
                <p className="text-xs text-white/40 mb-4">Accepted: JPG, PNG, WebP. Max file size: 5 MB per file.</p>
              </div>
              {selectedDocType.fields.map((field) => (
                <FileDropZone
                  key={field.key}
                  fieldKey={field.key}
                  label={field.label}
                  hint={field.hint}
                  file={files[field.key] || null}
                  onChange={handleFileChange}
                />
              ))}
            </div>
          )}

          {/* Step 3: Submit */}
          <div className="border-t border-white/5 pt-6">
            <h3 className="text-sm font-semibold text-white mb-4">Step 3 — Submit for review</h3>
            {!selectedType && (
              <p className="text-xs text-white/40 mb-4">Select a document type above to continue.</p>
            )}
            {selectedType && !allFilesReady && (
              <div className="flex items-center gap-2 mb-4 text-amber-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <p className="text-xs">Please upload all required files before submitting.</p>
              </div>
            )}
            <Button
              onClick={handleSubmit}
              disabled={!allFilesReady || submitMutation.isPending}
              className="w-full h-12 bg-[#01F27B] hover:bg-[#01F27B]/90 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold rounded-xl shadow-[0_0_20px_rgba(1,242,123,0.2)] hover:shadow-[0_0_30px_rgba(1,242,123,0.35)] transition-all"
            >
              {submitMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Submitting…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Submit for Verification
                </span>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* ─── Pending lockout notice ─────────────────────────────────────── */}
      {status === "pending" && (
        <Card className="bg-[#0c0c0c] border-white/10 p-6 text-center">
          <Clock className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <p className="font-semibold text-white mb-2">Review in Progress</p>
          <p className="text-sm text-white/50 max-w-sm mx-auto">
            Your documents are being reviewed by our compliance team. You will be notified once a decision is made.
          </p>
          <p className="text-xs text-white/30 mt-4">Re-submission is locked while your documents are under review.</p>
        </Card>
      )}
    </div>
  );
}
