import { Button, Card, Loader } from '@/shared/ui';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import Step1Basic from './steps/Step1Basic';
import Step2Story from './steps/Step2Story';
import Step3Funding from './steps/Step3Funding';
import Step4Execution from './steps/Step4Execution';
import Step5Documents from './steps/Step5Documents';
import ProgressBar from './ui/ProgressBar';
import StepIndicator from './ui/StepIndicator';

import { createDeal, patchDeal } from '../../services/deal.service';

const STEPS = [
  { id: 1, label: "Basics" },
  { id: 2, label: "Story" },
  { id: 3, label: "Funding" },
  { id: 4, label: "Execution" },
  { id: 5, label: "Documents" },
];

const INITIAL_DATA = {
  startupName: "", startupLogo: null, startupWebsite: "", whatsappNumber: "", tagline: "", category: "", stage: "", location: "",
  problem: "", solution: "", vision: "", targetMarket: "", whyNow: "",
  goalAmount: "", raisedAmount: "", minimumInvestment: "", deadline: "", users: "", growthRate: "", CAC: "", LTV: "", CHURN: "",
  revenue: "", businessModel: "", goToMarket: "", topCompetitor: "", advantage: "", team: [], useOfFunds: [], qa: [],
  pitchDeck: null, safeAgreement: null, termSheet: null, registrationCertificate: null, 
  tradeLicense: null, balanceSheet: null, revenueProof: null, capTable: null, shareholderAgreement: null
};

export default function CreateDealWizard({ onSuccess, onCancel, initialData }) {
  // Smart Resumption: Map completion score to the correct starting step
  const getInitialStep = (score) => {
    if (!score || score < 20) return 1;
    if (score < 40) return 2;
    if (score < 60) return 3;
    if (score < 80) return 4;
    if (score < 100) return 5;
    return 1; // If 100%, start from beginning for review or just Step 1
  };

  // Helper to flatten nested API data for the form
  const getInitialData = (raw) => {
    const flat = { ...INITIAL_DATA, ...raw };
    if (raw?.basicInfo) Object.assign(flat, raw.basicInfo);
    if (raw?.story) Object.assign(flat, raw.story);
    if (raw?.funding) Object.assign(flat, raw.funding);
    if (raw?.execution) {
      Object.assign(flat, raw.execution);
    }
    
    // Format deadline for HTML5 date input (yyyy-MM-dd)
    if (flat.deadline && flat.deadline.includes("T")) {
      flat.deadline = flat.deadline.split("T")[0];
    }
    
    return flat;
  };

  const [currentStep, setCurrentStep] = useState(getInitialStep(initialData?.profileCompletionScore || 0));
  const [dealId, setDealId] = useState(initialData?._id || initialData?.id || null);
  const [data, setData] = useState(getInitialData(initialData));
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [profileScore, setProfileScore] = useState(initialData?.profileCompletionScore || 0);

  const onChange = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validateStep = (step) => {
    const e = {};
    if (step === 1) {
      if (!data.startupName?.trim()) e.startupName = "Required";
      if (!data.startupLogo) e.startupLogo = "Required";
      if (!data.startupWebsite?.trim()) {
        e.startupWebsite = "Required";
      } else {
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
        if (!urlPattern.test(data.startupWebsite)) {
          e.startupWebsite = "Please enter a valid URL (e.g., https://google.com)";
        }
      }
      if (!data.whatsappNumber?.trim()) {
        e.whatsappNumber = "Required";
      } else {
        const phonePattern = /^\+?[\d\s-]{8,20}$/;
        if (!phonePattern.test(data.whatsappNumber)) {
          e.whatsappNumber = "Please use + and country code (e.g., +971 50 123 4567)";
        }
      }
      if (!data.category) e.category = "Required";
      if (!data.stage) e.stage = "Required";
      if (!data.location?.trim()) e.location = "Required";
    }
    if (step === 2) {
      if (!data.problem?.trim()) e.problem = "Required";
      if (!data.solution?.trim()) e.solution = "Required";
      if (!data.targetMarket?.trim()) e.targetMarket = "Required";
      if (!data.whyNow?.trim()) e.whyNow = "Required";
    }
    if (step === 3) {
      if (data.goalAmount === undefined || data.goalAmount === null || data.goalAmount === "") e.goalAmount = "Required";
      if (data.raisedAmount === undefined || data.raisedAmount === null || data.raisedAmount === "") e.raisedAmount = "Required";
      if (data.minimumInvestment === undefined || data.minimumInvestment === null || data.minimumInvestment === "") e.minimumInvestment = "Required";
      
      const goal = Number(String(data.goalAmount || "0").replace(/[^\d.-]/g, ""));
      const raised = Number(String(data.raisedAmount || "0").replace(/[^\d.-]/g, ""));
      const minInv = Number(String(data.minimumInvestment || "0").replace(/[^\d.-]/g, ""));

      if (!e.goalAmount && !e.raisedAmount && goal <= raised) {
        e.goalAmount = "Goal must be greater than raised amount";
      }
      if (!e.minimumInvestment && !e.goalAmount && minInv >= goal) {
        e.minimumInvestment = "Must be less than goal amount";
      }

      if (!data.deadline?.trim()) e.deadline = "Required";
      if (data.users === undefined || data.users === null || data.users === "") e.users = "Required";
      if (data.growthRate === undefined || data.growthRate === null || data.growthRate === "") e.growthRate = "Required";
      if (!data.CAC) e.CAC = "Required";
      if (!data.LTV) e.LTV = "Required";
      if (!data.CHURN) e.CHURN = "Required";
    }
    if (step === 4) {
      if (!data.revenue) e.revenue = "Required";
      if (!data.businessModel?.trim()) e.businessModel = "Required";
      if (!data.goToMarket?.trim()) e.goToMarket = "Required";
      if (!data.topCompetitor?.trim()) e.topCompetitor = "Required";
      if (!data.advantage?.trim()) e.advantage = "Required";
      if (!data.team?.length) e.team = "Required";
      if (!data.useOfFunds?.length) e.useOfFunds = "Required";
      if (!data.qa?.length) e.qa = "Required";
    }
    if (step === 5) {
      const docs = ["pitchDeck", "safeAgreement", "termSheet", "registrationCertificate", "tradeLicense", "balanceSheet", "revenueProof", "capTable", "shareholderAgreement"];
      docs.forEach(doc => {
        if (!data[doc]) e[doc] = "Required";
      });
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const getStepPayload = (step) => {
    if (step === 1) {
      const fd = new FormData();
      ["startupName", "startupWebsite", "whatsappNumber", "tagline", "category", "stage", "location"].forEach(k => {
        if (data[k] !== undefined && data[k] !== null && data[k] !== "") fd.append(k, data[k]);
      });
      if (data.startupLogo instanceof File) fd.append("startupLogo", data.startupLogo);
      return { isFormData: true, payload: fd };
    }
    
    if (step === 2) {
      const payload = {};
      ["problem", "solution", "vision", "targetMarket", "whyNow"].forEach(k => {
        if (data[k] !== undefined && data[k] !== null && data[k] !== "") payload[k] = data[k];
      });
      return { isFormData: false, payload };
    }

    if (step === 3) {
      const payload = {};
      ["goalAmount", "raisedAmount", "minimumInvestment", "users", "growthRate", "CAC", "LTV"].forEach(k => {
        if (data[k] !== undefined && data[k] !== null && data[k] !== "") {
          const cleanVal = String(data[k]).replace(/[^\d.-]/g, "");
          payload[k] = Number(cleanVal);
        }
      });
      if (data.deadline) payload.deadline = data.deadline;
      if (data.CHURN) payload.CHURN = String(data.CHURN);
      return { isFormData: false, payload };
    }

    if (step === 4) {
      const payload = {};
      ["revenue"].forEach(k => {
        if (data[k] !== undefined && data[k] !== null && data[k] !== "") {
          const cleanVal = String(data[k]).replace(/[^\d.-]/g, "");
          payload[k] = Number(cleanVal);
        }
      });
      ["businessModel", "goToMarket", "topCompetitor", "advantage"].forEach(k => {
        if (data[k] !== undefined && data[k] !== null && data[k] !== "") payload[k] = data[k];
      });
      if (data.team?.length) payload.team = data.team;
      if (data.useOfFunds?.length) {
        payload.useOfFunds = data.useOfFunds.map(item => ({
          ...item,
          percentage: Number(String(item.percentage).replace(/[^\d.-]/g, "")) || 0
        }));
      }
      if (data.qa?.length) payload.qa = data.qa;
      return { isFormData: false, payload };
    }

    if (step === 5) {
      const fd = new FormData();
      const docKeys = ["pitchDeck", "safeAgreement", "termSheet", "registrationCertificate", "tradeLicense", "balanceSheet", "revenueProof", "capTable", "shareholderAgreement"];
      docKeys.forEach(k => {
        const val = data[k];
        if (val instanceof File) {
          fd.append(k, val);
        } else if (typeof val === 'string' && val.startsWith('http')) {
          // Send existing URL so backend knows it's still there
          fd.append(k, val);
        }
      });
      return { isFormData: true, payload: fd };
    }
  };

  const saveCurrentStep = async () => {
    if (!validateStep(currentStep)) {
      toast.error("Please fill in all required fields correctly.");
      return false;
    }

    setIsSaving(true);
    try {
      const { isFormData, payload } = getStepPayload(currentStep);
      
      console.log(`--- Submitting Step ${currentStep} Payload ---`);
      if (isFormData) {
        for (let [key, value] of payload.entries()) {
          console.log(`${key}:`, value);
        }
      } else {
        console.log(payload);
      }
      
      let response;

      if (currentStep === 1 && !dealId) {
        // Create new deal
        response = await createDeal(payload);
        if (response?._id || response?.id) {
          setDealId(response._id || response.id);
        }
      } else {
        // Update existing deal
        response = await patchDeal(dealId, payload);
      }

      // Sync progress from API response (prioritize backend calculation)
      const newScore = response?.profileCompletionScore || (currentStep * 20);
      setProfileScore(newScore);

      toast.success("Successfully saved! ✨");
      return true;
    } catch (err) {
      console.error(err);
      // Format the error nicely
      const errorMsg = err?.message || "Failed to save data. Please try again.";
      toast.error(`Error: ${errorMsg}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    const success = await saveCurrentStep();
    if (success && currentStep < 5) {
      setCurrentStep(s => s + 1);
    } else if (success && currentStep === 5) {
      console.log("=== Final Complete Form Data ===", data);
      onSuccess?.();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1);
    else onCancel?.();
  };

  const StepContent = {
    1: Step1Basic,
    2: Step2Story,
    3: Step3Funding,
    4: Step4Execution,
    5: Step5Documents
  }[currentStep];

  return (
    <div className="max-w-6xl mx-auto w-full h-full flex flex-col gap-6 lg:h-[calc(100vh-160px)]">
      {/* Box 1: Progress & Navigation */}
      <Card className="flex-none bg-[#0a0f0c]/90 backdrop-blur-xl border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(1,242,123,0.03)] p-6 lg:p-8">
        <div className="space-y-6">
          <ProgressBar score={profileScore} />
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>
      </Card>

      {/* Box 2: Form Content & Actions */}
      <Card className="flex-1 bg-[#0a0f0c]/90 backdrop-blur-xl border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(1,242,123,0.05)] overflow-hidden flex flex-col min-h-0">
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-none px-6 lg:px-10 py-8">
          <div className="max-w-4xl mx-auto">
            <StepContent data={data} onChange={onChange} errors={errors} />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/5 bg-black/40 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => onCancel?.()}
            disabled={isSaving}
            className="text-white/40 hover:text-white hover:bg-red-500/10 hover:text-red-400 h-12 px-6 rounded-xl transition-all font-medium"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isSaving}
                className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 h-12 px-6 rounded-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={isSaving}
              className="bg-gradient-to-r from-[#01F27B] to-[#00d66d] hover:opacity-90 text-black font-bold h-12 px-10 rounded-xl shadow-[0_0_25px_rgba(1,242,123,0.3)] transition-all flex items-center gap-2 border-0"
            >
              {isSaving ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  Saving...
                </>
              ) : currentStep === 5 ? (
                <>
                  <Save className="w-4 h-4" />
                  Finish & Submit
                </>
              ) : (
                <>
                  Save & Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
