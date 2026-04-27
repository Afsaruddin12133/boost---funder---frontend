import { useState } from "react";
import { ArrowLeft, Rocket, Mail, Lock, User } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
export default function AuthPage({ onAuth, onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("investor");
  const handleSubmit = (e) => {
    e.preventDefault();
    onAuth(selectedRole);
  };
  return <div className="min-h-screen flex relative overflow-hidden">
      {
    /* Animated Background */
  }
      <div className="absolute inset-0 bg-black" />
      <div
    className="absolute inset-0 opacity-30"
    style={{
      backgroundImage: `radial-gradient(circle at 20% 50%, rgba(1, 242, 123, 0.15), transparent 50%),
                           radial-gradient(circle at 80% 50%, rgba(1, 242, 123, 0.1), transparent 50%)`
    }}
  />

      {
    /* Left Side - Branding */
  }
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-[#01F27B] rounded-xl flex items-center justify-center">
            <Rocket className="w-7 h-7 text-black" />
          </div>
          <span className="text-3xl font-bold">BoostFundr</span>
        </div>

        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Where Startups
          <br />
          Meet <span className="text-[#01F27B]">Capital</span>
        </h1>

        <p className="text-xl text-white/70 max-w-md">
          The premium platform connecting verified founders with serious investors.
        </p>

        <div className="mt-12 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#01F27B]/10 rounded-lg flex items-center justify-center">
              <span className="text-[#01F27B]">✓</span>
            </div>
            <span className="text-white/80">Verified founders only</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#01F27B]/10 rounded-lg flex items-center justify-center">
              <span className="text-[#01F27B]">✓</span>
            </div>
            <span className="text-white/80">Curated deal flow</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#01F27B]/10 rounded-lg flex items-center justify-center">
              <span className="text-[#01F27B]">✓</span>
            </div>
            <span className="text-white/80">Direct founder access</span>
          </div>
        </div>
      </div>

      {
    /* Right Side - Form */
  }
      <div className="flex-1 relative z-10 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <Button
    variant="ghost"
    onClick={onBack}
    className="mb-8 hover:bg-white/5"
  >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="bg-gradient-to-br from-[#0c0c0c] via-[#0c0c0c] to-[#06120b] border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(1,242,123,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#01F27B]/5 to-transparent rounded-full blur-2xl" />
            <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-white/60">
                {isLogin ? "Sign in to continue" : "Join BoostFundr today"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && <div>
                  <Label htmlFor="role" className="text-white/80 mb-2 block">I am a</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
    type="button"
    onClick={() => setSelectedRole("investor")}
    className={`p-4 rounded-xl border transition-all ${selectedRole === "investor" ? "border-[#01F27B] bg-[#01F27B]/10" : "border-white/10 hover:border-white/20"}`}
  >
                      <User className="w-5 h-5 mb-2 mx-auto" />
                      <div className="text-sm font-medium">Investor</div>
                    </button>
                    <button
    type="button"
    onClick={() => setSelectedRole("founder")}
    className={`p-4 rounded-xl border transition-all ${selectedRole === "founder" ? "border-[#01F27B] bg-[#01F27B]/10" : "border-white/10 hover:border-white/20"}`}
  >
                      <Rocket className="w-5 h-5 mb-2 mx-auto" />
                      <div className="text-sm font-medium">Founder</div>
                    </button>
                  </div>
                </div>}

              <div>
                <Label htmlFor="email" className="text-white/80 mb-2 block">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
    id="email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="you@example.com"
    className="pl-10 bg-white/5 border-white/10 focus:border-[#01F27B]/30 focus:ring-[#01F27B]/20"
    required
  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-white/80 mb-2 block">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
    id="password"
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="••••••••"
    className="pl-10 bg-white/5 border-white/10 focus:border-[#01F27B]/30 focus:ring-[#01F27B]/20"
    required
  />
                </div>
              </div>

              <Button
    type="submit"
    className="w-full bg-[#01F27B] hover:bg-[#01F27B]/90 text-black h-12"
  >
                {isLogin ? "Sign In" : "Create Account"}
              </Button>

              <div className="text-center">
                <button
    type="button"
    onClick={() => setIsLogin(!isLogin)}
    className="text-white/60 hover:text-[#01F27B] text-sm transition-colors"
  >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center text-sm text-white/40">
              Demo: Use any email/password to {isLogin ? "sign in" : "sign up"}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
