import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ArrowLeft, Loader2, Lock, Mail, Rocket, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

// ─── Simple client-side validation ───────────────────────────────────────────

function validate(fields, isLogin) {
  const errs = {};
  if (!isLogin) {
    if (!fields.firstName.trim()) errs.firstName = "First name is required.";
    if (!fields.lastName.trim())  errs.lastName  = "Last name is required.";
  }
  if (!fields.email.trim()) {
    errs.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errs.email = "Enter a valid email address.";
  }
  if (!fields.password) {
    errs.password = "Password is required.";
  } else if (fields.password.length < 6) {
    errs.password = "Password must be at least 6 characters.";
  }
  return errs;
}

// ─── Field error helper ───────────────────────────────────────────────────────

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-400">{msg}</p>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuthPage({ onBack }) {
  const { login, register, loginWithGoogle, loginWithFacebook, loading, error, clearError } = useAuth();

  const [isLogin, setIsLogin] = useState(true);

  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "investor",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  // State for social login role selection
  const [socialLoginState, setSocialLoginState] = useState({
    isOpen: false,
    provider: null,
    role: "investor",
  });

  const handleSocialLoginClick = (provider) => {
    setSocialLoginState({ isOpen: true, provider, role: "investor" });
  };

  const handleSocialLoginConfirm = () => {
    if (socialLoginState.provider === 'google') {
      loginWithGoogle(socialLoginState.role);
    } else if (socialLoginState.provider === 'facebook') {
      loginWithFacebook(socialLoginState.role);
    }
    setSocialLoginState((prev) => ({ ...prev, isOpen: false }));
  };

  // Switch between login / register — reset form state
  const switchMode = () => {
    setIsLogin((prev) => !prev);
    setFieldErrors({});
    clearError();
    setFields({ firstName: "", lastName: "", email: "", password: "", role: "investor" });
  };

  const set = (key) => (e) => {
    setFields((prev) => ({ ...prev, [key]: e.target.value }));
    // Clear field-level error on change
    if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const setRole = (role) => setFields((prev) => ({ ...prev, role }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields, isLogin);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    try {
      if (isLogin) {
        await login({ email: fields.email, password: fields.password });
      } else {
        const success = await register({
          firstName: fields.firstName,
          lastName:  fields.lastName,
          email:     fields.email,
          password:  fields.password,
          role:      fields.role,
        });
        if (success) {
          toast.success("Account created successfully! Please log in.");
          switchMode();
        }
      }
    } catch {
      // error is already set inside useAuth — nothing extra needed here
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#09150f] via-black to-[#040806]" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 40%, rgba(1, 242, 123, 0.2), transparent 45%),
                           radial-gradient(circle at 80% 60%, rgba(1, 242, 123, 0.15), transparent 50%)`,
        }}
      />
      <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-gradient-to-br from-[#01F27B]/20 to-transparent blur-3xl auth-drift" />
      <div className="absolute -bottom-40 left-0 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-[#01F27B]/15 to-transparent blur-3xl auth-drift" />
      <div className="absolute inset-0 noise-overlay opacity-25" />

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-16">
        <div className="absolute -top-10 -left-10 h-64 w-64 rounded-full bg-gradient-to-br from-[#01F27B]/15 to-transparent blur-3xl auth-drift" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-gradient-to-tr from-[#01F27B]/10 to-transparent blur-3xl auth-drift" />
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
          {["Verified founders only", "Curated deal flow", "Direct founder access"].map((text) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#01F27B]/10 rounded-lg flex items-center justify-center">
                <span className="text-[#01F27B]">✓</span>
              </div>
              <span className="text-white/80">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Form */}
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

          <div className="relative auth-float">
            <div className="absolute -inset-0.5 rounded-[1.1rem] bg-gradient-to-br from-[#01F27B]/25 via-transparent to-[#01F27B]/10 blur" />
            <div className="bg-gradient-to-br from-[#0b0f0d] via-[#0b0f0d] to-[#06120b] border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(1,242,123,0.12)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#01F27B]/10 to-transparent rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-44 h-44 bg-gradient-to-tr from-[#01F27B]/8 to-transparent rounded-full blur-2xl" />
              <div className="absolute inset-0 noise-overlay opacity-20" />
              <div className="relative z-10">

              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-white/60">
                  {isLogin ? "Sign in to continue" : "Join BoostFundr today"}
                </p>
              </div>

              {/* API error banner */}
              {error && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
                  <span className="mt-0.5 shrink-0">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                {/* Role selector — register only */}
                {!isLogin && (
                  <div>
                    <Label htmlFor="role" className="text-white/80 mb-2 block">I am a</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole("investor")}
                        className={`p-4 rounded-xl border transition-all duration-200 ease-out hover:-translate-y-0.5 ${fields.role === "investor" ? "border-[#01F27B] bg-[#01F27B]/10" : "border-white/10 hover:border-white/20"}`}
                      >
                        <User className="w-5 h-5 mb-2 mx-auto" />
                        <div className="text-sm font-medium">Investor</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("founder")}
                        className={`p-4 rounded-xl border transition-all duration-200 ease-out hover:-translate-y-0.5 ${fields.role === "founder" ? "border-[#01F27B] bg-[#01F27B]/10" : "border-white/10 hover:border-white/20"}`}
                      >
                        <Rocket className="w-5 h-5 mb-2 mx-auto" />
                        <div className="text-sm font-medium">Founder</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* First + Last name — register only */}
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="firstName" className="text-white/80 mb-2 block">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={fields.firstName}
                        onChange={set("firstName")}
                        placeholder="John"
                        className="bg-white/5 border-white/10 focus:border-[#01F27B]/30 focus:ring-[#01F27B]/20"
                        disabled={loading}
                      />
                      <FieldError msg={fieldErrors.firstName} />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white/80 mb-2 block">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={fields.lastName}
                        onChange={set("lastName")}
                        placeholder="Doe"
                        className="bg-white/5 border-white/10 focus:border-[#01F27B]/30 focus:ring-[#01F27B]/20"
                        disabled={loading}
                      />
                      <FieldError msg={fieldErrors.lastName} />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-white/80 mb-2 block">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <Input
                      id="email"
                      type="email"
                      value={fields.email}
                      onChange={set("email")}
                      placeholder="you@example.com"
                      className="pl-10 bg-white/5 border-white/10 focus:border-[#01F27B]/30 focus:ring-[#01F27B]/20"
                      disabled={loading}
                    />
                  </div>
                  <FieldError msg={fieldErrors.email} />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password" className="text-white/80 mb-2 block">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <Input
                      id="password"
                      type="password"
                      value={fields.password}
                      onChange={set("password")}
                      placeholder="••••••••"
                      className="pl-10 bg-white/5 border-white/10 focus:border-[#01F27B]/30 focus:ring-[#01F27B]/20"
                      disabled={loading}
                    />
                  </div>
                  <FieldError msg={fieldErrors.password} />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#01F27B] hover:bg-[#01F27B]/90 text-black h-12 font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(1,242,123,0.25)] disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isLogin ? "Signing in…" : "Creating account…"}
                    </span>
                  ) : (
                    isLogin ? "Sign In" : "Create Account"
                  )}
                </Button>

                {/* Switch mode */}
                <div className="text-center mt-2">
                  <p className="text-white/60 text-sm">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={switchMode}
                      disabled={loading}
                      className="font-bold text-[#01F27B] transition-all duration-300 drop-shadow-[0_0_8px_rgba(1,242,123,0.6)] hover:drop-shadow-[0_0_15px_rgba(1,242,123,1)] hover:text-[#01F27B] hover:underline underline-offset-4 disabled:pointer-events-none ml-1"
                    >
                      {isLogin ? "Sign up" : "Sign in"}
                    </button>
                  </p>
                </div>
              </form>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-white/10"></div>
                <span className="px-4 text-xs text-white/40 uppercase tracking-wider">Or</span>
                <div className="flex-1 border-t border-white/10"></div>
              </div>

              {/* Social Login */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={() => handleSocialLoginClick('google')}
                  className="w-full h-12 bg-transparent border-white/10 hover:bg-white/5 hover:border-[#01F27B]/40 text-white hover:text-[#01F27B] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(1,242,123,0.18)] disabled:opacity-60"
                >
                  {/* Clean text alternative to brand icon */}
                  <span className="mr-2 font-bold text-lg leading-none">G</span> Continue with Google
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={() => handleSocialLoginClick('facebook')}
                  className="w-full h-12 bg-transparent border-white/10 hover:bg-white/5 hover:border-[#01F27B]/40 text-white hover:text-[#01F27B] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(1,242,123,0.18)] disabled:opacity-60"
                >
                  <span className="mr-2 font-bold text-lg leading-none">f</span> Continue with Facebook
                </Button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Login Role Selection Modal */}
      <Dialog 
        open={socialLoginState.isOpen} 
        onOpenChange={(isOpen) => setSocialLoginState(prev => ({ ...prev, isOpen }))}
      >
        <DialogContent className="sm:max-w-md border-white/10 bg-[#0c0c0c] text-white">
          <DialogHeader>
            <DialogTitle>Select Your Role</DialogTitle>
            <DialogDescription className="text-white/60">
              Please choose a role to continue with {socialLoginState.provider === 'google' ? 'Google' : 'Facebook'}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 py-4">
            <button
              type="button"
              onClick={() => setSocialLoginState(prev => ({ ...prev, role: "investor" }))}
              className={`p-4 rounded-xl border transition-all duration-200 ease-out hover:-translate-y-0.5 ${socialLoginState.role === "investor" ? "border-[#01F27B] bg-[#01F27B]/10" : "border-white/10 hover:border-white/20"}`}
            >
              <User className="w-5 h-5 mb-2 mx-auto" />
              <div className="text-sm font-medium">Investor</div>
            </button>
            <button
              type="button"
              onClick={() => setSocialLoginState(prev => ({ ...prev, role: "founder" }))}
              className={`p-4 rounded-xl border transition-all duration-200 ease-out hover:-translate-y-0.5 ${socialLoginState.role === "founder" ? "border-[#01F27B] bg-[#01F27B]/10" : "border-white/10 hover:border-white/20"}`}
            >
              <Rocket className="w-5 h-5 mb-2 mx-auto" />
              <div className="text-sm font-medium">Founder</div>
            </button>
          </div>

          <Button
            type="button"
            onClick={handleSocialLoginConfirm}
            className="w-full bg-[#01F27B] hover:bg-[#01F27B]/90 text-black h-12 font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(1,242,123,0.25)]"
          >
            Continue
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
