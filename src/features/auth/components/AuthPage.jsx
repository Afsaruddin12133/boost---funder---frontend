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
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Rocket, User, KeyRound, ShieldCheck } from "lucide-react";
import { Loader } from "@/shared/ui";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import Logo from "@/shared/components/Logo";
import SiteFooter from "@/shared/components/SiteFooter";

// ─── Simple client-side validation ───────────────────────────────────────────

function validate(fields, mode) {
  const errs = {};
  if (mode !== 'reset') {
    if (!fields.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errs.email = "Enter a valid email address.";
    }
  }

  if (mode === 'register') {
    if (!fields.firstName.trim()) errs.firstName = "First name is required.";
    if (!fields.lastName.trim())  errs.lastName  = "Last name is required.";
  }

  if (mode === 'login' || mode === 'register' || mode === 'reset') {
    const p = mode === 'reset' ? fields.newPassword : fields.password;
    if (!p) {
      if (mode === 'reset') errs.newPassword = "New password is required.";
      else errs.password = "Password is required.";
    } else if (p.length < 6) {
      if (mode === 'reset') errs.newPassword = "Password must be at least 6 characters.";
      else errs.password = "Password must be at least 6 characters.";
    }
  }

  if (mode === 'reset') {
    if (!fields.otp.trim()) errs.otp = "OTP is required.";
    else if (fields.otp.length !== 6) errs.otp = "OTP must be 6 digits.";
  }

  return errs;
}

// ─── Field error helper ───────────────────────────────────────────────────────

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-400">{msg}</p>;
}

export default function AuthPage({ onBack, onNavigate }) {
  const { 
    login, register, loginWithGoogle, loginWithFacebook, 
    sendPasswordResetOTP, confirmPasswordReset, 
    loading, error, clearError 
  } = useAuth();

  const [mode, setMode] = useState('login'); // login, register, forgot, reset

  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    newPassword: "",
    otp: "",
    role: "investor",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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

  const switchMode = (newMode) => {
    setMode(newMode);
    setFieldErrors({});
    clearError();
    setShowPassword(false);
    if (newMode !== 'reset') {
       setFields(prev => ({ ...prev, firstName: "", lastName: "", password: "", newPassword: "", otp: "" }));
    }
  };

  const set = (key) => (e) => {
    setFields((prev) => ({ ...prev, [key]: e.target.value }));
    if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const setRole = (role) => setFields((prev) => ({ ...prev, role }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields, mode);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    try {
      if (mode === 'login') {
        await login({ email: fields.email, password: fields.password });
      } else if (mode === 'register') {
        const success = await register({
          firstName: fields.firstName,
          lastName:  fields.lastName,
          email:     fields.email,
          password:  fields.password,
          role:      fields.role,
        });
        if (success) {
          toast.success("Account created successfully! Please log in.");
          switchMode('login');
        }
      } else if (mode === 'forgot') {
        await sendPasswordResetOTP(fields.email);
        toast.success("Hey! OTP sent to your email.");
        switchMode('reset');
      } else if (mode === 'reset') {
        await confirmPasswordReset({
          email: fields.email,
          otp: fields.otp,
          newPassword: fields.newPassword
        });
        toast.success("Password reset successfully!");
        switchMode('login');
      }
    } catch {
      // Error handled by useAuth
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-y-auto overflow-x-hidden custom-scrollbar">
      {/* RESTORED BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c2014] via-black to-[#040806]" />
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

      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        {/* LEFT SIDE - BRANDING */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 py-20 relative">
          <div className="absolute -top-10 -left-10 h-64 w-64 rounded-full bg-gradient-to-br from-[#01F27B]/15 to-transparent blur-3xl auth-drift" />
          <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-gradient-to-tr from-[#01F27B]/10 to-transparent blur-3xl auth-drift" />
          <div className="flex items-center mb-8">
            <Logo size="lg" className="-ml-4" />
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight text-white">
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

        {/* RIGHT SIDE - FORM */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20 min-h-screen lg:min-h-0 relative">
          <div className="w-full max-w-md">
          <Button
            variant="ghost"
            onClick={() => {
               if (mode === 'forgot') switchMode('login');
               else if (mode === 'reset') switchMode('forgot');
               else onBack();
            }}
            className="mb-8 hover:bg-white/5 text-white/50"
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
                <h2 className="text-3xl font-bold mb-2 text-white">
                  {mode === 'login' ? "Welcome Back" : 
                   mode === 'register' ? "Create Account" :
                   mode === 'forgot' ? "Forgot Password" : "Reset Password"}
                </h2>
                <p className="text-white/60">
                  {mode === 'login' ? "Sign in to continue" : 
                   mode === 'register' ? "Join BoostFundr today" :
                   mode === 'forgot' ? "Enter your email for the recovery code" : "Enter the OTP sent to your email"}
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
                {mode === 'register' && (
                  <div>
                    <Label htmlFor="role" className="text-white/80 mb-2 block">I am a</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole("investor")}
                        className={`p-4 rounded-xl border transition-all duration-200 ease-out hover:-translate-y-0.5 ${fields.role === "investor" ? "border-[#01F27B] bg-[#01F27B]/10 text-[#01F27B]" : "border-white/10 hover:border-white/20"}`}
                      >
                        <User className="w-5 h-5 mb-2 mx-auto" />
                        <div className="text-sm font-medium">Investor</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("founder")}
                        className={`p-4 rounded-xl border transition-all duration-200 ease-out hover:-translate-y-0.5 ${fields.role === "founder" ? "border-[#01F27B] bg-[#01F27B]/10 text-[#01F27B]" : "border-white/10 hover:border-white/20"}`}
                      >
                        <Rocket className="w-5 h-5 mb-2 mx-auto" />
                        <div className="text-sm font-medium">Founder</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* First + Last name — register only */}
                {mode === 'register' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="firstName" className="text-white/80 mb-2 block">First Name</Label>
                      <Input
                        id="firstName"
                        value={fields.firstName}
                        onChange={set("firstName")}
                        placeholder="John"
                        className="bg-white/5 border-white/10 focus:border-[#01F27B]/30"
                        disabled={loading}
                      />
                      <FieldError msg={fieldErrors.firstName} />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white/80 mb-2 block">Last Name</Label>
                      <Input
                        id="lastName"
                        value={fields.lastName}
                        onChange={set("lastName")}
                        placeholder="Doe"
                        className="bg-white/5 border-white/10 focus:border-[#01F27B]/30"
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
                      className="pl-10 bg-white/5 border-white/10 focus:border-[#01F27B]/30"
                      disabled={loading || mode === 'reset'}
                    />
                  </div>
                  <FieldError msg={fieldErrors.email} />
                </div>

                {/* RESET: OTP & NEW PASSWORD */}
                {mode === 'reset' && (
                  <>
                    <div>
                      <Label htmlFor="otp" className="text-white/80 mb-2 block">OTP Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        maxLength={6}
                        value={fields.otp}
                        onChange={set("otp")}
                        placeholder="000000"
                        className="bg-white/5 border-white/10 focus:border-[#01F27B]/30 text-center tracking-widest text-lg font-bold"
                        disabled={loading}
                      />
                      <FieldError msg={fieldErrors.otp} />
                    </div>
                    <div>
                      <Label htmlFor="newPassword" className="text-white/80 mb-2 block">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          value={fields.newPassword}
                          onChange={set("newPassword")}
                          placeholder="••••••••"
                          className="pl-10 pr-10 bg-white/5 border-white/10 focus:border-[#01F27B]/30"
                          disabled={loading}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"><EyeOff size={16} /></button>
                      </div>
                      <FieldError msg={fieldErrors.newPassword} />
                    </div>
                  </>
                )}

                {/* Password (Login/Register) */}
                {(mode === 'login' || mode === 'register') && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                       <Label htmlFor="password">Password</Label>
                       {mode === 'login' && (
                         <button type="button" onClick={() => switchMode('forgot')} className="text-xs text-[#01F27B] hover:underline">Forgot password?</button>
                       )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={fields.password}
                        onChange={set("password")}
                        placeholder="••••••••"
                        className="pl-10 pr-10 bg-white/5 border-white/10 focus:border-[#01F27B]/30"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <FieldError msg={fieldErrors.password} />
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#01F27B] hover:bg-[#01F27B]/90 text-black h-12 font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(1,242,123,0.25)]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader size="sm" />
                      {mode === 'login' ? "Signing in…" : mode === 'register' ? "Creating account…" : "Processing…"}
                    </span>
                  ) : (
                    mode === 'login' ? "Sign In" : 
                    mode === 'register' ? "Create Account" :
                    mode === 'forgot' ? "Send OTP" : "Reset Password"
                  )}
                </Button>

                {/* Switch mode */}
                {(mode === 'login' || mode === 'register') && (
                  <div className="text-center mt-2">
                    <p className="text-white/60 text-sm">
                      {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                      <button
                        type="button"
                        onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                        disabled={loading}
                        className="font-bold text-[#01F27B] hover:underline underline-offset-4 ml-1"
                      >
                        {mode === 'login' ? "Sign up" : "Sign in"}
                      </button>
                    </p>
                  </div>
                )}
              </form>

              {/* Social Login (Only for login/register) */}
              {(mode === 'login' || mode === 'register') && (
                <>
                  <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-white/10"></div>
                    <span className="px-4 text-xs text-white/40 uppercase tracking-wider">Or</span>
                    <div className="flex-1 border-t border-white/10"></div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading}
                      onClick={() => handleSocialLoginClick('google')}
                      className="w-full h-12 bg-transparent border-white/10 hover:bg-white/5 text-white hover:text-[#01F27B]"
                    >
                      <span className="mr-2 font-bold text-lg">G</span> Continue with Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading}
                      onClick={() => handleSocialLoginClick('facebook')}
                      className="w-full h-12 bg-transparent border-white/10 hover:bg-white/5 text-white hover:text-[#01F27B]"
                    >
                      <span className="mr-2 font-bold text-lg">f</span> Continue with Facebook
                    </Button>
                  </div>
                </>
              )}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 w-full border-t border-white/5 bg-black/40 backdrop-blur-xl">
        <SiteFooter onNavigate={onNavigate} />
      </div>

      {/* Social Modal */}
      <Dialog open={socialLoginState.isOpen} onOpenChange={(isOpen) => setSocialLoginState(prev => ({ ...prev, isOpen }))}>
        <DialogContent className="sm:max-w-md border-white/10 bg-[#0c0c0c] text-white">
          <DialogHeader><DialogTitle>Select Your Role</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-4">
            <button onClick={() => setSocialLoginState(prev => ({ ...prev, role: "investor" }))} className={`p-4 rounded-xl border ${socialLoginState.role === "investor" ? "border-[#01F27B] bg-[#01F27B]/10 text-[#01F27B]" : "border-white/10"}`}><User className="mx-auto mb-2" />Investor</button>
            <button onClick={() => setSocialLoginState(prev => ({ ...prev, role: "founder" }))} className={`p-4 rounded-xl border ${socialLoginState.role === "founder" ? "border-[#01F27B] bg-[#01F27B]/10 text-[#01F27B]" : "border-white/10"}`}><Rocket className="mx-auto mb-2" />Founder</button>
          </div>
          <Button onClick={handleSocialLoginConfirm} className="w-full bg-[#01F27B] text-black">Continue</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
