import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { useNavigate } from 'react-router';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleGoDashboard = () => {
    const path = role === 'founder' ? '/dashboard/founder' : '/dashboard/investor';
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#01F27B]/10 rounded-full blur-[100px] pointer-events-none" />

      <Card className="max-w-md w-full bg-[#0c0c0c] border border-white/10 p-8 sm:p-12 text-center relative z-10 shadow-[0_0_50px_rgba(1,242,123,0.1)]">
        <div className="w-20 h-20 bg-[#01F27B]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-[#01F27B]" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-3">Payment Successful!</h1>
        <p className="text-white/60 mb-8 leading-relaxed">
          Thank you for your purchase. Your premium plan is now active and your account has been upgraded.
        </p>
        
        <Button 
          onClick={handleGoDashboard}
          className="w-full bg-[#01F27B] text-black hover:bg-[#01F27B]/90 font-bold py-6 rounded-xl flex items-center justify-center gap-2 group"
        >
          Go to Dashboard
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Card>
    </div>
  );
}
