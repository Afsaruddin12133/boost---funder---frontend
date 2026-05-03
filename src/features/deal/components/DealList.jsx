import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { useState } from "react";
import { Plus, Rocket, FilePlus, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { Loader } from "@/shared/ui";
import { useDeleteDeal, useMyDeals, useSubmitDeal } from "../hooks";
import DealCard from "./DealCard";
import DealTable from "./DealTable";

export default function DealList({ onNavigate, onEdit, onView, onCreate, compact = false }) {
  const { data: deals = [], isLoading, isError, error, refetch } = useMyDeals();
  const deleteDeal = useDeleteDeal();
  const submitDeal = useSubmitDeal();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleSubmitForReview = (deal) => {
    const dealId = deal.id ?? deal._id;
    submitDeal.mutate(dealId, {
      onSuccess: () => {
        toast.success("Deal submitted for review");
      },
      onError: (err) => {
        toast.error(err?.message || "Failed to submit deal");
      }
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Pagination logic
  const totalPages = Math.ceil(deals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDeals = deals.slice(startIndex, startIndex + itemsPerPage);

  const handleConfirmDelete = () => {
    if (!deleteTarget?.id && !deleteTarget?._id) return;
    const dealId = deleteTarget.id ?? deleteTarget._id;

    deleteDeal.mutate(dealId, {
      onSuccess: () => {
        toast.success("Deal deleted");
        setDeleteTarget(null);
        // Adjust page if we deleted the last item on current page
        if (currentDeals.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
      },
      onError: (mutationError) => {
        toast.error(mutationError?.message || "Failed to delete deal");
      },
    });
  };

  if (isLoading) {
    return <Loader label="Loading deals..." />;
  }

  if (isError) {
    return (
      <div className="p-6">
        <Card className="bg-[#0c0c0c] border-white/10 p-6">
          <p className="text-sm text-white/70 mb-4">
            {error?.message || "Unable to load deals."}
          </p>
          <Button
            variant="outline"
            className="border-white/10 text-white/70 hover:text-white"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  if (!deals.length) {
    if (compact) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
            <FilePlus className="w-6 h-6 text-white/20" />
          </div>
          <p className="text-sm text-white/40 font-medium">No deals found</p>
        </div>
      );
    }

    return (
      <div className="py-12 px-4">
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 p-12 flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#01F27B]/20 to-transparent" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#01F27B]/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-[#01F27B] blur-[30px] rounded-full opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="relative w-20 h-20 bg-black border-2 border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110">
              <Rocket className="w-10 h-10 text-[#01F27B] animate-pulse" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Ready to launch your round?</h3>
          <p className="text-white/50 text-base max-w-sm mb-10 leading-relaxed">
            Create your first deal and start connecting with qualified investors on BoostFundr.
          </p>

          <div className="relative">
            <div className="absolute inset-0 bg-[#01F27B] blur-[20px] rounded-xl opacity-20 animate-pulse" />
            <Button
              onClick={() => onCreate ? onCreate() : onEdit ? onEdit(null) : onNavigate ? onNavigate('founder-dashboard/deals?action=create') : null}
              className="relative bg-[#01F27B] hover:bg-[#00d66d] text-black font-black h-12 px-8 rounded-xl shadow-[0_0_25px_rgba(1,242,123,0.4)] transition-all flex items-center gap-2 border border-[#01F27B]/50"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Deal</span>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-12">
      {/* 3x2 Grid for Zero-Scroll Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
        {currentDeals.map((deal) => (
          <div key={deal.id ?? deal._id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <DealCard
              deal={deal}
              onNavigate={onNavigate}
              onRequestDelete={setDeleteTarget}
              onEdit={onEdit}
              onView={onView}
              onSubmitForReview={handleSubmitForReview}
              hideActions={compact}
              isSubmitting={submitDeal.isPending && submitDeal.variables === (deal.id ?? deal._id)}
            />
          </div>
        ))}
      </div>

      {/* Premium High-Impact Pagination Control */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-6 py-12 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-3 bg-white/[0.03] backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
            <Button
              variant="ghost"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="text-white/40 hover:text-[#01F27B] disabled:opacity-10 transition-all font-black uppercase text-[10px] tracking-[0.2em] px-5 h-10 rounded-xl hover:bg-[#01F27B]/10 group/prev"
            >
              <div className="flex items-center gap-2">
                <span className="group-hover/prev:-translate-x-1 transition-transform">←</span>
                <span>Back</span>
              </div>
            </Button>
            
            <div className="h-6 w-px bg-white/10 mx-2" />

            <div className="flex items-center gap-4 px-4">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                const isActive = currentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className="relative group/page flex items-center justify-center"
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-[#01F27B] blur-[10px] rounded-full opacity-40 animate-pulse" />
                    )}
                    <div className={`
                      relative w-2.5 h-2.5 rounded-full transition-all duration-500
                      ${isActive ? 'bg-[#01F27B] scale-125' : 'bg-white/20 group-hover/page:bg-white/40 group-hover/page:scale-110'}
                    `} />
                    <span className={`
                      absolute -top-8 text-[9px] font-black tracking-widest transition-all duration-300
                      ${isActive ? 'text-[#01F27B] opacity-100' : 'text-white/20 opacity-0 group-hover/page:opacity-100'}
                    `}>
                      0{pageNum}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="h-6 w-px bg-white/10 mx-2" />

            <Button
              variant="ghost"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="text-white/40 hover:text-[#01F27B] disabled:opacity-10 transition-all font-black uppercase text-[10px] tracking-[0.2em] px-5 h-10 rounded-xl hover:bg-[#01F27B]/10 group/next"
            >
              <div className="flex items-center gap-2">
                <span>Next</span>
                <span className="group-hover/next:translate-x-1 transition-transform">→</span>
              </div>
            </Button>
          </div>
          
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
            Viewing page <span className="text-white/40">{currentPage}</span> of <span className="text-white/40">{totalPages}</span>
          </p>
        </div>
      )}

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent className="bg-[#0c0c0c] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete deal</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              This action cannot be undone. This will permanently remove the
              deal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-white/70 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-500/90"
              onClick={handleConfirmDelete}
              disabled={deleteDeal.isPending}
            >
              {deleteDeal.isPending ? <Loader size="sm" className="mr-2" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
