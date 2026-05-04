import React from 'react';
import LegalLayout from './LegalLayout';

const PrivacyPage = ({ onNavigate }) => {
  return (
    <LegalLayout 
      title="Privacy Policy" 
      lastUpdated="May 05, 2026" 
      onNavigate={onNavigate}
    >
      <section className="space-y-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us when you create an account, create a startup profile, or communicate with other users.
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-white/70">
            <li><strong>Identity Data:</strong> Name, email address, phone number, and professional biography.</li>
            <li><strong>Company Data:</strong> Pitch decks, financial projections, and business registration details (for Founders).</li>
            <li><strong>Verification Data:</strong> Government-issued ID or business certificates for KYC/KYB purposes.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
          <p>We use the collected data to:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-white/70">
            <li>Provide and maintain our Platform services.</li>
            <li>Verify the identity of founders and investors to ensure a safe environment.</li>
            <li>Facilitate introductions and deal discovery.</li>
            <li>Send technical notices, updates, and support messages.</li>
          </ul>
        </div>

        <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
          <h2 className="text-2xl font-bold mb-4 text-[#01F27B]">3. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data. All sensitive communications and verification documents are encrypted.
          </p>
          <p className="mt-4">
            However, no method of transmission over the Internet is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">4. Sharing of Information</h2>
          <p>We may share your information in the following circumstances:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-white/70">
            <li>With your consent (e.g., when a founder shares a deal with an investor).</li>
            <li>With third-party service providers (e.g., payment processors, identity verification services).</li>
            <li>To comply with legal obligations or protect our rights.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">5. Cookies and Tracking</h2>
          <p>
            We use cookies to enhance your experience on our Platform. These small text files help us remember your preferences and analyze how users interact with our services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">6. Your Data Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-white/70">
            <li>Access, update, or delete the information we have on you.</li>
            <li>Object to our processing of your personal data.</li>
            <li>Request the transfer of your personal data.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <a href="mailto:privacy@boostfundr.com" className="text-[#01F27B] font-bold text-lg">privacy@boostfundr.com</a>
        </div>
      </section>
    </LegalLayout>
  );
};

export default PrivacyPage;
