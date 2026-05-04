import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';

const LegalLayout = ({ title, lastUpdated, children, onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#01F27B]/30">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#01F27B]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#01F27B]/5 rounded-full blur-[120px]" />
      </div>

      <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('landing')}
            className="hover:bg-white/5 text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-[#01F27B] animate-pulse" />
             <span className="text-xs font-black uppercase tracking-widest text-[#01F27B]">Secure Document</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <header className="mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-sm text-white/40 uppercase tracking-widest font-medium">
              Last Updated: {lastUpdated}
            </p>
          )}
          <div className="w-20 h-1.5 bg-[#01F27B] rounded-full" />
        </header>

        <article className="prose prose-invert prose-green max-w-none 
          prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
          prose-p:text-white/70 prose-p:leading-relaxed prose-p:text-lg
          prose-strong:text-white prose-strong:font-bold
          prose-ul:text-white/60
          pb-20"
        >
          {children}
        </article>
      </main>

    </div>
  );
};

export default LegalLayout;
