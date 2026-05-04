import React from 'react';
import LegalLayout from './LegalLayout';
import { Rocket, Target, Users, Shield } from 'lucide-react';

const AboutPage = ({ onNavigate }) => {
  return (
    <LegalLayout 
      title="Our Story" 
      lastUpdated="May 05, 2026" 
      onNavigate={onNavigate}
    >
      <section className="space-y-16">
        <div className="space-y-6">
          <p className="text-2xl font-medium leading-relaxed text-white">
            BoostFundr was born out of a simple observation: <span className="text-[#01F27B]">the bridge between world-class innovation and strategic capital was broken.</span>
          </p>
          <p>
            Traditional fundraising is often slow, opaque, and limited by geographical boundaries. We set out to build a platform that leverages technology to democratize access to elite deal flow while maintaining the highest standards of security and verification.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#01F27B]/10 flex items-center justify-center">
              <Target className="text-[#01F27B]" size={24} />
            </div>
            <h3 className="text-xl font-bold">Our Mission</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              To empower founders to build the future by providing them with direct access to a global network of sophisticated investors.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#01F27B]/10 flex items-center justify-center">
              <Users className="text-[#01F27B]" size={24} />
            </div>
            <h3 className="text-xl font-bold">Our Community</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              We curate a selective ecosystem of founders and investors who share a commitment to transparency, growth, and excellence.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-3xl font-bold">Why BoostFundr?</h2>
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#01F27B] flex items-center justify-center font-bold text-black">1</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Verified Network</h4>
                <p className="text-white/60">Every founder and investor undergoes a strict verification process to ensure trust and authenticity.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#01F27B] flex items-center justify-center font-bold text-black">2</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Global Reach</h4>
                <p className="text-white/60">Connect with capital and opportunities from around the world, transcending traditional borders.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#01F27B] flex items-center justify-center font-bold text-black">3</div>
              <div>
                <h4 className="text-xl font-bold mb-2">AI-Driven Insights</h4>
                <p className="text-white/60">Our platform uses advanced algorithms to match investors with the deals that best align with their interests.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 rounded-[3rem] bg-gradient-to-br from-[#01F27B]/20 to-transparent border border-[#01F27B]/30 text-center space-y-6">
          <h2 className="text-3xl font-bold italic">"Building the future, together."</h2>
          <p className="text-white/70 max-w-xl mx-auto">
            Join the ecosystem where elite capital meets world-class innovation. Let's build something extraordinary.
          </p>
        </div>
      </section>
    </LegalLayout>
  );
};

export default AboutPage;
