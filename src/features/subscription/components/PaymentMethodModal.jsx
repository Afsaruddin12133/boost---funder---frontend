import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/shared/ui/dialog";
import { CreditCard, Smartphone, ChevronRight } from "lucide-react";

const PAYMENT_METHODS = [
  {
    id: 6,
    name: "Debit/Credit Cards",
    description: "Visa, Mastercard, AMEX",
    icon: CreditCard,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    id: 9,
    name: "Apple Pay",
    description: "Fast and secure with Apple",
    icon: Smartphone, // Using Smartphone as fallback for Apple
    color: "text-white",
    bg: "bg-white/10",
  },
  {
    id: 16,
    name: "Google Pay",
    description: "Quick checkout with Google",
    icon: Smartphone,
    color: "text-[#4285F4]",
    bg: "bg-[#4285F4]/10",
  }
];

export default function PaymentMethodModal({ isOpen, onClose, onSelect, planName }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] bg-[#0c0c0c] border-white/10 text-white p-0 overflow-hidden">
        <div className="p-6 pb-2">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-white">
              Select <span className="text-[#01F27B]">Payment Method</span>
            </DialogTitle>
            <DialogDescription className="text-white/40 font-medium">
              Choose how you want to pay for your <span className="text-white uppercase">{planName}</span> subscription.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 pt-4 space-y-3">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => onSelect(method.id)}
              className="w-full group relative flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#01F27B]/50 hover:bg-[#01F27B]/5 transition-all duration-300 text-left"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.bg} border border-white/5 shrink-0 group-hover:scale-110 transition-transform`}>
                <method.icon className={`w-6 h-6 ${method.color}`} />
              </div>
              
              <div className="flex-1">
                <p className="font-bold text-white tracking-tight">{method.name}</p>
                <p className="text-xs text-white/30">{method.description}</p>
              </div>

              <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-[#01F27B] group-hover:translate-x-1 transition-all" />
              
              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-[0_0_20px_rgba(1,242,123,0.1)]" />
            </button>
          ))}
        </div>

        <div className="p-6 pt-2 border-t border-white/5 bg-white/[0.01]">
          <p className="text-[10px] text-center text-white/20 uppercase tracking-[0.2em] font-black">
            Powered by MyFatoorah Secure Infrastructure
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
