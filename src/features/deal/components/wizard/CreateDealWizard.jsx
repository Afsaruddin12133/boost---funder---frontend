import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { ArrowLeft, ArrowRight, Loader2, Save } from 'lucide-react';
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
  startupName: "", startupLogo: null, startupWebsite: "", tagline: "", category: "", stage: "", location: "",
  problem: "", solution: "", vision: "", targetMarket: "", whyNow: "",
  goalAmount: "", raisedAmount: "", minimumInvestment: "", deadline: "", users: "", growthRate: "",
  revenue: "", businessModel: "", goToMarket: "", topCompetitor: "", advantage: "", team: [], useOfFunds: [],
  pitchDeck: null, safeAgreement: null, termSheet: null, registrationCertificate: null, 
  tradeLicense: null, balanceSheet: null, revenueProof: null, capTable: null, shareholderAgreement: null
};

export default function CreateDealWizard({ onSuccess, onCancel, initialData }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [dealId, setDealId] = useState(initialData?._id || initialData?.id || null);
  const [data, setData] = useState({ ...INITIAL_DATA, ...initialData });
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
      if (!data.startupWebsite?.trim()) e.startupWebsite = "Required";
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
      if (!data.goalAmount) e.goalAmount = "Required";
      if (!data.raisedAmount) e.raisedAmount = "Required";
      if (!data.minimumInvestment) e.minimumInvestment = "Required";
      if (!data.deadline?.trim()) e.deadline = "Required";
      if (!data.users) e.users = "Required";
      if (!data.growthRate) e.growthRate = "Required";
    }
    if (step === 4) {
      if (!data.revenue) e.revenue = "Required";
      if (!data.businessModel?.trim()) e.businessModel = "Required";
      if (!data.goToMarket?.trim()) e.goToMarket = "Required";
      if (!data.topCompetitor?.trim()) e.topCompetitor = "Required";
      if (!data.advantage?.trim()) e.advantage = "Required";
      if (!data.team?.length) e.team = "Required";
      if (!data.useOfFunds?.length) e.useOfFunds = "Required";
    }
    if (step === 5) {
      const docs = ["pitchDeck", "safeAgreement", "registrationCertificate", "tradeLicense", "balanceSheet", "revenueProof", "capTable", "shareholderAgreement"];
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
      ["startupName", "startupWebsite", "tagline", "category", "stage", "location"].forEach(k => {
        if (data[k]) fd.append(k, data[k]);
      });
      if (data.startupLogo instanceof File) fd.append("startupLogo", data.startupLogo);
      return { isFormData: true, payload: fd };
    }
    
    if (step === 2) {
      const payload = {};
      ["problem", "solution", "vision", "targetMarket", "whyNow"].forEach(k => {
        if (data[k]) payload[k] = data[k];
      });
      return { isFormData: false, payload };
    }

    if (step === 3) {
      const payload = {};
      ["goalAmount", "raisedAmount", "minimumInvestment", "deadline", "users", "growthRate"].forEach(k => {
        if (data[k]) payload[k] = data[k];
      });
      return { isFormData: false, payload };
    }

    if (step === 4) {
      const payload = {};
      ["revenue", "businessModel", "goToMarket", "topCompetitor", "advantage"].forEach(k => {
        if (data[k]) payload[k] = data[k];
      });
      // Handle arrays
      if (data.team?.length) payload.team = data.team;
      if (data.useOfFunds?.length) payload.useOfFunds = data.useOfFunds;
      return { isFormData: false, payload };
    }

    if (step === 5) {
      const fd = new FormData();
      const docKeys = ["pitchDeck", "safeAgreement", "registrationCertificate", "tradeLicense", "balanceSheet", "revenueProof", "capTable", "shareholderAgreement"];
      docKeys.forEach(k => {
        if (data[k] instanceof File) fd.append(k, data[k]);
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

      // Calculate progress purely on the frontend (20% per step)
      setProfileScore(currentStep * 20);

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
    <div className="max-w-3xl mx-auto w-full">
      <ProgressBar score={profileScore} />
      
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      <Card className="bg-[#0a0f0c]/90 backdrop-blur-xl border-white/10 rounded-2xl shadow-[0_0_50px_rgba(1,242,123,0.03)] overflow-hidden flex flex-col">
        <div className="p-8 flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 max-h-[60vh]">
          <StepContent data={data} onChange={onChange} errors={errors} />
        </div>

        <div className="p-6 border-t border-white/5 bg-black/40 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => onCancel?.()}
            disabled={isSaving}
            className="text-white/40 hover:text-white hover:bg-red-500/10 hover:text-red-400 h-12 px-6 rounded-xl transition-all"
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
              className="bg-[#01F27B] hover:bg-[#01F27B]/90 text-black font-semibold h-12 px-8 rounded-xl shadow-[0_0_20px_rgba(1,242,123,0.2)] hover:shadow-[0_0_30px_rgba(1,242,123,0.3)] transition-all flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
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
