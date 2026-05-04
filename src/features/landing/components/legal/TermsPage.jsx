import React from 'react';
import LegalLayout from './LegalLayout';

const TermsPage = ({ onNavigate }) => {
  return (
    <LegalLayout 
      title="Terms & Conditions" 
      lastUpdated="May 05, 2026" 
      onNavigate={onNavigate}
    >
      <section className="space-y-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p>
            Welcome to BoostFundr (“Platform”, “we”, “our”, “us”), an AI-powered startup deal network connecting founders and investors.
          </p>
          <p className="mt-4">
            By accessing or using the Platform, you agree to be bound by these Terms & Conditions (“Terms”). If you do not agree, you must not use the Platform.
          </p>
        </div>

        <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
          <h2 className="text-2xl font-bold mb-4">2. Nature of the Platform</h2>
          <p>BoostFundr operates strictly as:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>A technology platform</li>
            <li>A marketing and discovery platform</li>
            <li>An introduction network</li>
          </ul>
          <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <p className="text-sm font-bold text-yellow-500 uppercase tracking-widest mb-2">⚠️ BoostFundr DOES NOT:</p>
            <ul className="list-disc pl-6 space-y-1 text-white/80">
              <li>Hold or manage investor funds</li>
              <li>Execute investments</li>
              <li>Provide financial advice</li>
              <li>Act as broker, dealer, or custodian</li>
            </ul>
          </div>
          <p className="mt-6 text-sm text-white/40 italic">All transactions occur outside the platform between users.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">3. Eligibility</h2>
          <p>To use BoostFundr, you must:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-white/70">
            <li>Be at least 18 years old</li>
            <li>Have legal capacity to enter contracts</li>
            <li>Comply with all applicable laws in your jurisdiction</li>
          </ul>
          <p className="mt-6">We reserve the right to restrict or terminate access at our discretion.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">4. User Accounts</h2>
          <p>You agree to:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-white/70">
            <li>Provide accurate information</li>
            <li>Maintain account confidentiality</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>
          <p className="mt-6">We may suspend or terminate accounts for violations.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-[#01F27B]/5 border border-[#01F27B]/10">
            <h3 className="text-xl font-bold text-[#01F27B] mb-3">Investors</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>• Browse startup opportunities</li>
              <li>• Request access to deals</li>
              <li>• Connect directly with founders</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-xl font-bold mb-3 text-white">Founders</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>• Create startup profiles</li>
              <li>• Present funding opportunities</li>
              <li>• Communicate with investors</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">6. No Investment Advice</h2>
          <p>All content on BoostFundr is:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-white/70">
            <li>Informational only</li>
            <li>Not financial, legal, or tax advice</li>
          </ul>
          <p className="mt-6 font-bold text-white">You must conduct your own due diligence before making any decision.</p>
        </div>

        <div className="bg-red-500/5 p-8 rounded-3xl border border-red-500/10">
          <h2 className="text-2xl font-bold text-red-400 mb-4 font-black uppercase tracking-tighter">7. Risk Disclosure</h2>
          <p>Investing in startups involves:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-red-200/60 font-bold">
            <li>High risk</li>
            <li>Possible loss of entire investment</li>
            <li>Illiquidity</li>
          </ul>
          <p className="mt-6 text-sm text-red-200/40">By using the Platform, you acknowledge and accept these risks.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">8. Payments & Fees</h2>
          <p>BoostFundr may charge:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-white/70">
            <li>Subscription fees</li>
            <li>Listing fees</li>
            <li>Success-based fees</li>
          </ul>
          <p className="mt-6">Payments are processed via third-party providers (e.g. MyFatoorah, Stripe).</p>
          <p className="mt-4 text-[#01F27B] font-bold">⚠️ BoostFundr does not store or control funds.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">9. Tokenization (If Applicable)</h2>
          <p>Where tokenization is used:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-white/70">
            <li>It is handled by licensed third-party providers</li>
            <li>BoostFundr is not the issuer or custodian</li>
            <li>Users must comply with applicable laws and regulations</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">12. Intellectual Property</h2>
          <p>All Platform content, branding, and technology are owned by BoostFundr.</p>
          <p className="mt-4">You may not Copy, Distribute, or Reverse engineer without prior written consent.</p>
        </div>

        <div className="pt-10 border-t border-white/10">
          <h2 className="text-2xl font-bold mb-4">16. Governing Law</h2>
          <p>These Terms are governed by the laws of:</p>
          <div className="mt-4 p-6 rounded-2xl bg-[#01F27B] text-black inline-block font-black text-xl">
            United Arab Emirates (UAE)
          </div>
          <p className="mt-6 text-white/40">Any disputes shall be resolved in UAE courts.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">18. Contact</h2>
          <p>For inquiries:</p>
          <div className="flex flex-col gap-2 text-lg text-[#01F27B] font-bold">
            <a href="mailto:boostfundr@gmail.com">boostfundr@gmail.com</a>
            <a href="https://www.boostfundr.com">www.boostfundr.com</a>
          </div>
        </div>
      </section>
    </LegalLayout>
  );
};

export default TermsPage;
