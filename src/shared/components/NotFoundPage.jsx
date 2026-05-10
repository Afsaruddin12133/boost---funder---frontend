import { Button } from "@/shared/ui";
import { ArrowLeft, Ghost, Home } from "lucide-react";
import { useNavigate } from "react-router";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#01F27B]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-2xl backdrop-blur-xl relative group">
          <div className="absolute inset-0 bg-[#01F27B]/20 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <Ghost className="w-12 h-12 text-[#01F27B] animate-bounce" />
        </div>

        <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 tracking-tighter mb-4">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
          Lost in the Matrix
        </h2>
        
        <p className="text-white/40 mb-10 text-lg leading-relaxed">
          The page you are looking for has either been moved, deleted, or never existed in this timeline.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border-white/10 text-white rounded-xl h-12 px-8 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          
          <Button 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto bg-[#01F27B] hover:bg-[#00d66d] text-black font-black rounded-xl h-12 px-8 shadow-[0_0_20px_rgba(1,242,123,0.3)] hover:scale-105 transition-all"
          >
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
