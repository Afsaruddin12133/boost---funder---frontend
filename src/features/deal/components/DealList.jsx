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
import toast from "react-hot-toast";
import { useDeleteDeal, useMyDeals } from "../hooks";
import DealCard from "./DealCard";
import DealTable from "./DealTable";

export default function DealList({ onNavigate, onEdit, onView }) {
  const { data: deals = [], isLoading, isError, error, refetch } = useMyDeals();
  const deleteDeal = useDeleteDeal();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleConfirmDelete = () => {
    if (!deleteTarget?.id && !deleteTarget?._id) return;
    const dealId = deleteTarget.id ?? deleteTarget._id;

    deleteDeal.mutate(dealId, {
      onSuccess: () => {
        toast.success("Deal deleted");
        setDeleteTarget(null);
      },
      onError: (mutationError) => {
        toast.error(mutationError?.message || "Failed to delete deal");
      },
    });
  };

  if (isLoading) {
    return <div className="p-6 text-sm text-white/60">Loading deals...</div>;
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
    return (
      <div className="p-6">
        <Card className="bg-[#0c0c0c] border-white/10 p-6 text-sm text-white/60">
          No deals yet. Create your first deal to start fundraising.
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <DealCard
            key={deal.id ?? deal._id}
            deal={deal}
            onNavigate={onNavigate}
            onRequestDelete={setDeleteTarget}
            onEdit={onEdit}
            onView={onView}
          />
        ))}
      </div>

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
              {deleteDeal.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
