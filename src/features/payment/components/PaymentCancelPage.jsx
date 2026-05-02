import React from 'react';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { useNavigate } from 'react-router';

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />

      <Card className="max-w-md w-full bg-[#0c0c0c] border border-red-500/20 p-8 sm:p-12 text-center relative z-10 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-3">Payment Failed</h1>
        <p className="text-white/60 mb-8 leading-relaxed">
          Your payment was cancelled or could not be processed. No charges were made to your account.
        </p>
        
        <Button 
          onClick={() => navigate('/subscription')}
          variant="outline"
          className="w-full border-white/20 text-white hover:bg-white/5 font-bold py-6 rounded-xl flex items-center justify-center gap-2 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Return to Plans
        </Button>
      </Card>
    </div>
  );
}
