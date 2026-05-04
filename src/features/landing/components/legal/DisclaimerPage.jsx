import React from 'react';
import LegalLayout from './LegalLayout';
import { AlertTriangle } from 'lucide-react';

const DisclaimerPage = ({ onNavigate }) => {
  return (
    <LegalLayout 
      title="Financial Disclaimer" 
      lastUpdated="May 05, 2026" 
      onNavigate={onNavigate}
    >
      <section className="space-y-12">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="text-red-500" size={24} />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500 uppercase tracking-tighter">High Risk Warning</h2>
            <p className="text-red-200/80 leading-relaxed">
              Investment in early-stage companies and startups involves significant risks, including the total loss of capital. These investments are highly speculative and illiquid. You should only invest what you can afford to lose.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">1. No Investment Advice</h2>
          <p>
            The content on the BoostFundr platform is provided for informational purposes only. Nothing on this site should be construed as financial, legal, or tax advice. BoostFundr does not recommend or endorse any specific startup or investment opportunity.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">2. User Responsibility</h2>
          <p>
            Each investor is solely responsible for conducting their own due diligence, research, and analysis of any startup profile presented on the Platform. We strongly recommend consulting with qualified professional advisors before making any investment decisions.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">3. Accuracy of Information</h2>
          <p>
            While we strive to ensure that the information on the Platform is accurate, much of the content is provided by third parties (Founders). BoostFundr does not guarantee the accuracy, completeness, or reliability of any information provided by users.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">4. Platform Role</h2>
          <p>
            BoostFundr is a technology platform that facilitates introductions between founders and investors. We are not a broker-dealer, an investment advisor, or a financial institution. We do not handle investment funds or execute transactions.
          </p>
        </div>

        <div className="pt-10 border-t border-white/10 text-sm text-white/40 italic">
          <p>
            By using the BoostFundr Platform, you acknowledge that you have read, understood, and agreed to this disclaimer.
          </p>
        </div>
      </section>
    </LegalLayout>
  );
};

export default DisclaimerPage;
