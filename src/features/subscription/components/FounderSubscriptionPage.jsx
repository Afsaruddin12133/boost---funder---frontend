
// Original implementation (commented out) preserved here so it can be
// re-enabled later. The full original source is also available in
// `FounderSubscriptionPage.orig.jsx`.
// ---------------------------------------------------------------------
// Backup of original FounderSubscriptionPage.jsx - preserved before temporary commenting.
// This file contains the original implementation and is not used by the app.
//
// import { useAuth } from "@/features/auth/hooks/useAuth";
// import api from "@/lib/api";
// import { Badge, Button, Card, Loader } from "@/shared/ui";
// import { AlertCircle, Check, ChevronRight, Clock, Crown, Rocket, Sparkles, Zap } from "lucide-react";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { useLocation, useNavigate } from "react-router";
// import PaymentMethodModal from "./PaymentMethodModal";
//
// const PACKAGE_ICONS = {
//   free: Rocket,
//   standard: Zap,
//   premium: Crown,
//   elite: Crown,
// };
//
// const PACKAGE_THEMES = {
//   free: {
//     color: "#ffffff",
//     bg: "bg-white/5",
//     border: "border-white/10",
//     glow: "bg-white/10",
//     button: "bg-white/10 text-white hover:bg-white/20",
//     iconBg: "bg-white/5",
//     accent: "text-white/40"
//   },
//   standard: {
//     color: "#01F27B",
//     bg: "bg-[#01F27B]/5",
//     border: "border-[#01F27B]/40",
//     glow: "bg-[#01F27B]/20",
//     button: "bg-[#01F27B] text-black hover:bg-[#00d66d] shadow-[0_0_25px_rgba(1,242,123,0.4)]",
//     iconBg: "bg-[#01F27B]/10",
//     accent: "text-[#01F27B]"
//   },
//   premium: {
//     color: "#f59e0b",
//     bg: "bg-amber-500/5",
//     border: "border-amber-500/40",
//     glow: "bg-amber-500/20",
//     button: "bg-amber-500 text-black hover:bg-amber-600 shadow-[0_0_25px_rgba(245,158,11,0.4)]",
//     iconBg: "bg-amber-500/10",
//     accent: "text-amber-500"
//   }
// };
//
// function FounderPackageCard({ pkg, isSelected, onSelect, calculatedFee, isCalculatingFee }) {
//   const planSlug = pkg.slug?.toLowerCase() || 'free';
//   // Use a fallback theme if the slug isn't strictly matched
//   const theme = PACKAGE_THEMES[planSlug] || PACKAGE_THEMES.standard;
//   const Icon = PACKAGE_ICONS[planSlug] || Rocket;
//
//   return (
//     <Card
//       className={`relative overflow-hidden p-6 transition-all duration-500 hover:-translate-y-2 group flex flex-col h-full
//         ${isSelected ? `bg-black ${theme.bg} shadow-[0_0_50px_rgba(1,242,123,0.15)]` : `bg-[#0c0c0c] border-white/10 hover:border-white/30 shadow-2xl`}
//       `}
//       style={{ 
//         borderColor: isSelected ? theme.color : undefined,
//         borderWidth: isSelected ? '2px' : '1px'
//       }}
//     >
//       {/* Intense Decorative Glow */}
//       <div className={`absolute -top-20 -right-20 w-64 h-64 ${theme.glow} rounded-full blur-[80px] opacity-20 group-hover:opacity-60 transition-all duration-700 pointer-events-none`} />
//       
//       {/* Accent Line for all cards */}
//       <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[${theme.color}] to-transparent opacity-50 group-hover:opacity-100 transition-opacity`} 
//            style={{ background: `linear-gradient(90deg, transparent, ${theme.color}, transparent)` }} />
//       
//       <div className="relative z-10 flex-1 flex flex-col">
//         {/* Header Section */}
//         <div className="mb-4">
//           <div className="flex items-center justify-between mb-4">
//             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme.iconBg} border border-white/10 shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]`}>\
//               <Icon className="w-6 h-6" style={{ color: theme.color }} />
//             </div>
//             {pkg.badge && (
//               <Badge className="bg-[#01F27B] text-black border-[#01F27B] text-[9px] font-black uppercase tracking-widest px-3 py-1 shadow-[0_0_15px_rgba(1,242,123,0.4)]">
//                 {pkg.badge}
//               </Badge>
//             )}
//             {pkg.isFeatured && !pkg.badge && (
//               <Badge className="bg-[#01F27B] text-black border-[#01F27B] text-[9px] font-black uppercase tracking-widest px-3 py-1 shadow-[0_0_15px_rgba(1,242,123,0.4)]">
//                 Featured
//               </Badge>
//             )}
//           </div>
//           
//           <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-1">{pkg.name}</h3>
//           <p className="text-[10px] uppercase font-black tracking-widest mb-2 text-[#01F27B]">
//             {pkg.shortLabel}
//           </p>
//           <p className="text-xs text-white/50 font-semibold leading-tight min-h-[3rem]">
//             {pkg.description || "Unlock premium features for your startup."}
//           </p>
//         </div>
//
//         {/* Pricing/Fee Section */}
//         <div className="mb-6 space-y-2">
//           <div className="flex items-baseline gap-1">
//             <span className="text-5xl font-black text-white italic tracking-tighter group-hover:scale-110 transition-transform duration-500 origin-left">
//               {pkg.percentageFee}%
//             </span>
//             <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">/ Success Fee</span>
//           </div>
//           {isCalculatingFee ? (
//             <div className="bg-[#01F27B]/5 border border-[#01F27B]/10 rounded-xl p-3 flex items-center gap-3">
//               <div className="w-4 h-4 border-2 border-[#01F27B]/30 border-t-[#01F27B] rounded-full animate-spin" />
//               <span className="text-xs font-bold text-[#01F27B] animate-pulse">Calculating...</span>
//             </div>
//           ) : calculatedFee !== undefined && (
//             <div className="bg-[#01F27B]/10 border border-[#01F27B]/20 rounded-xl p-3 flex items-center justify-between shadow-[0_0_15px_rgba(1,242,123,0.1)]">
//               <span className="text-[10px] uppercase font-black tracking-widest text-[#01F27B]">Total Fees : </span>
//               <span className="text-lg font-black text-white">AED {calculatedFee.toLocaleString('en-US')}</span>
//             </div>
//           )}
//           {pkg.approvalTime && (
//             <div className="flex items-center gap-1.5 text-xs text-white/50 font-bold bg-white/5 p-2 rounded-lg w-fit border border-white/5">
//               <Clock className="w-3.5 h-3.5" />
//               <span>Approval: {pkg.approvalTime} hours</span>
//             </div>
//           )}
//         </div>
//
//         {/* Action Button */}
//         <Button
//           onClick={() => onSelect(pkg)}
//           className={`w-full h-12 rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] transition-all duration-300 flex items-center justify-center gap-2 group/btn
//             ${isSelected ? "bg-white/5 text-white/30 border border-white/10" : theme.button}
//           `}
//         >
//           {isSelected ? "Selected Package" : (
//             <>
//               Select {pkg.name}
//               <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
//             </>
//           )}
//         </Button>
//
//         {/* Features List */}
//         <div className="mt-8 space-y-4 flex-1">
//           <div className="flex items-center gap-3">
//             <div className={`h-[1px] flex-1 bg-gradient-to-r from-transparent to-[${theme.color}] opacity-20`} style={{ background: `linear-gradient(90deg, transparent, ${theme.color})`, opacity: 0.2 }} />
//             <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${theme.accent}`}>Key Benefits</p>
//             <div className={`h-[1px] flex-1 bg-gradient-to-l from-transparent to-[${theme.color}] opacity-20`} style={{ background: `linear-gradient(270deg, transparent, ${theme.color})`, opacity: 0.2 }} />
//           </div>
//           
//           <div className="space-y-3.5">
//             {pkg.features?.map((feature, idx) => (
//               <div key={idx} className="flex items-center gap-3.5 group/item">
//                 <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${isSelected || planSlug !== 'free' ? 'bg-[#01F27B]/20 border border-[#01F27B]/30' : 'bg-white/10 border border-white/10'} shrink-0 group-hover/item:scale-110 transition-transform`}>
//                   <Check className={`w-3 h-3 ${isSelected || planSlug !== 'free' ? 'text-[#01F27B]' : 'text-white/40'}`} strokeWidth={4} />
//                 </div>
//                 <span className="text-[13px] md:text-sm text-white/80 group-hover/item:text-white transition-colors leading-none font-bold tracking-tight">
//                   {feature}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       
//       {/* Intense Bottom Glow for Selected */}
//       {isSelected && (
//         <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#01F27B] shadow-[0_0_20px_rgba(1,242,123,0.8)]" />
//       )}
//     </Card>
//   );
// }
//
// export default function FounderSubscriptionPage() {
//   const [packages, setPackages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [errorStatus, setErrorStatus] = useState(null);
//   const [selectedPackageId, setSelectedPackageId] = useState(null);
//
//   const [fundingGoalInput, setFundingGoalInput] = useState("");
//   const [debouncedFundingGoal, setDebouncedFundingGoal] = useState("");
//   const [calculatedFees, setCalculatedFees] = useState({});
//   const [isCalculatingFees, setIsCalculatingFees] = useState(false);
//   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
//   const [pendingPackage, setPendingPackage] = useState(null);
//
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, isAuthenticated, logout } = useAuth();
//
//   const searchParams = new URLSearchParams(location.search);
//   const dealIdFromUrl = searchParams.get('dealId');
//   const goalAmountFromUrl = searchParams.get('goalAmount');
//
//   const fetchPackages = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       setErrorStatus(null);
//       
//       const res = await api.get('/api/founder/packages');
//       const pkgs = res?.data?.packages || res?.packages || [];
//       
//       setPackages(pkgs);
//       
//       // Load saved package or default
//       const savedPackageId = localStorage.getItem('selectedFounderPackageId');
//       if (savedPackageId && pkgs.some(p => p._id === savedPackageId)) {
//         setSelectedPackageId(savedPackageId);
//       } else {
//         const defaultPackage = pkgs.find((pkg) => pkg.isDefault) || pkgs.find((pkg) => pkg.slug === 'free') || pkgs[0];
//         if (defaultPackage) {
//           setSelectedPackageId(defaultPackage._id);
//           localStorage.setItem('selectedFounderPackageId', defaultPackage._id);
//         }
//       }
//     } catch (err) {
//       console.error("Failed to load founder packages:", err);
//       const status = err.response?.status;
//       setErrorStatus(status);
//       
//       if (status === 401) {
//         toast.error("Session expired. Please log in again.");
//         logout?.();
//         navigate('/login');
//       } else if (status === 403) {
//         setError("You do not have permission to view founder packages.");
//       } else {
//         setError(err.message || "Failed to load subscription data. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   useEffect(() => {
//     if (isAuthenticated) {
//       if (goalAmountFromUrl) {
//         setFundingGoalInput(Number(goalAmountFromUrl).toLocaleString('en-US'));
//       }
//       
//       const status = searchParams.get('paymentStatus');
//       if (status === 'success') {
//         toast.success("Payment completed successfully!");
//       } else if (status === 'cancel' || status === 'failed') {
//         toast.error("Payment was cancelled or failed. You can try again.");
//       }
//       
//       fetchPackages();
//     } else {
//       navigate('/login');
//     }
//     // eslint-disable-next-line
//   }, [isAuthenticated, goalAmountFromUrl]);
//
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedFundingGoal(fundingGoalInput);
//     }, 500);
//     return () => clearTimeout(handler);
//   }, [fundingGoalInput]);
//
//   useEffect(() => {
//     const fetchFees = async () => {
//       const goal = Number(debouncedFundingGoal.replace(/,/g, ''));
//       if (!goal || goal <= 0 || packages.length === 0) {
//         setCalculatedFees({});
//         return;
//       }
//       
//       setIsCalculatingFees(true);
//       try {
//         const fees = {};
//         await Promise.all(packages.map(async (pkg) => {
//           try {
//             const res = await api.post('/api/founder/packages/calculate-fee', {
//               packageId: pkg._id,
//               fundingGoal: goal
//             });
//             if (res?.data?.calculatedFee !== undefined) {
//               fees[pkg._id] = res.data.calculatedFee;
//             }
//           } catch (e) {
//             console.error(`Failed to calculate fee for package ${pkg.name}`, e);
//           }
//         }));
//         setCalculatedFees(fees);
//       } finally {
//         setIsCalculatingFees(false);
//       }
//     };
//     
//     fetchFees();
//   }, [debouncedFundingGoal, packages]);
//
//   const handleSelectPackage = async (pkg) => {
//     const goal = Number(debouncedFundingGoal.replace(/,/g, ''));
//     
//     // Only enforce funding goal for paid packages
//     if (pkg.percentageFee > 0 && (!goal || goal <= 0)) {
//       toast.error("Please enter your target funding goal before selecting a premium package.");
//       return;
//     }
//
//     setSelectedPackageId(pkg._id);
//     localStorage.setItem('selectedFounderPackageId', pkg._id);
//     if (goal > 0) {
//       localStorage.setItem('founderFundingGoal', goal.toString());
//     }
//
//     if (pkg.percentageFee > 0) {
//       setPendingPackage(pkg);
//       setIsPaymentModalOpen(true);
//       return;
//     }
//
//     toast.success(dealIdFromUrl ? `${pkg.name} package linked successfully!` : `${pkg.name} package selected!`);
//     setTimeout(() => {
//       navigate(dealIdFromUrl ? '/dashboard/founder/deals' : '/dashboard/founder/deals?action=create');
//     }, 1500);
//   };
//
//   const handlePaymentMethodSelect = async (paymentMethodId) => {
//     if (!pendingPackage) return;
//     setIsPaymentModalOpen(false);
//
//     const goal = Number(debouncedFundingGoal.replace(/,/g, ''));
//     try {
//       toast.loading("Initializing payment...", { id: "payment-toast" });
//       
//       const payload = {
//         founderId: user?._id || user?.id,
//         packageId: pendingPackage._id,
//         planId: pendingPackage._id, // Added to satisfy backend model validation
//         fundingGoal: goal,
//         paymentMethodId: paymentMethodId
//       };
//
//       if (dealIdFromUrl) {
//         payload.dealId = dealIdFromUrl;
//       }
//
//       const response = await api.post('/api/v1/payments/founder/create', payload);
//
//       const paymentUrl = response?.data?.paymentUrl || response?.paymentUrl;
//       if (paymentUrl) {
//         toast.success("Redirecting to payment gateway...", { id: "payment-toast" });
//         window.location.href = paymentUrl;
//       } else {
//         throw new Error("No payment URL received");
//       }
//     } catch (err) {
//       console.error("Founder Payment Error:", err);
//       toast.error(err.message || "Failed to initialize payment session. Please try again.", { id: "payment-toast" });
//     }
//   };
//
//   if (loading) {
//     return <Loader label="Calibrating founder packages..." />;
//   }
//
//   if (error) {
//     return (
//       <div className="w-full flex flex-col items-center justify-center min-h-[50vh] text-center px-6">
//         <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
//           <AlertCircle className="w-8 h-8 text-red-500" />
//         </div>
//         <h3 className="text-2xl font-black text-white mb-2 italic uppercase tracking-tighter">
//           {errorStatus === 403 ? "Access Denied" : "Sync Error"}
//         </h3>
//         <p className="text-white/40 mb-8 max-w-sm font-medium">{error}</p>
//         {errorStatus !== 403 && (
//           <Button onClick={fetchPackages} className="bg-[#01F27B] text-black hover:bg-[#00d66d] font-black rounded-xl px-8 h-12 shadow-[0_0_20px_rgba(1,242,123,0.3)] transition-all">
//             Retry Connection
//           </Button>
//         )}
//       </div>
//     );
//   }
//
//   return (
//     <div className="w-full pb-6 space-y-6 md:space-y-8 animate-in fade-in duration-1000 max-w-7xl mx-auto">
//       {/* Premium Header */}
//       <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-4 md:pb-6">
//         <div className="space-y-1">
//           <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
//             Choose your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#01F27B] to-[#00d66d]">Package</span>
//           </h1>
//           <p className="text-white/40 text-xs md:text-sm font-medium tracking-wide max-w-2xl mt-2">
//             Select the funding package that best fits your startup's needs. This will apply to any deals you create.
//           </p>
//         </div>
//
//         {/* Funding Goal Input */}
//         <div className="w-full sm:w-auto mt-4 sm:mt-0 relative z-20">
//           <label className="block text-[10px] uppercase font-black tracking-widest text-[#01F27B] mb-2">
//             Test Funding Goal
//           </label>
//           <div className="relative">
//             <input 
//               type="text"
//               value={fundingGoalInput}
//               // onChange={(e) => {
//               //   const val = e.target.value.replace(/[^0-9,]/g, '');


export default function FounderSubscriptionPage() {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center bg-white/[0.03] border border-white/5 rounded-2xl p-10">
        <h2 className="text-3xl font-black text-white mb-2">Founder Subscription Coming Soon</h2>
        <p className="text-white/60">Subscription and package selection has been temporarily disabled. All founder features are available for free.</p>
      </div>
    </div>
  );
}

