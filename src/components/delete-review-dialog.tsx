"use client";

import * as React from "react";
import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { trpc } from "@/lib/trpc/client";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface DeleteReviewButtonProps {
  reviewId: string;
  repositoryId?: string;
  prNumber?: number;
  status: string;
  onDeleted?: () => void;
  size?: "default" | "sm" | "xs";
  className?: string;
  variant?: "outline" | "destructive" | "ghost";
}

export function DeleteReviewButton({
  reviewId,
  repositoryId,
  prNumber,
  status,
  onDeleted,
  size = "sm",
  className,
  variant = "outline",
}: DeleteReviewButtonProps) {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  const deleteMutation = trpc.review.delete.useMutation({
    onSuccess: (data) => {
      setOpen(false);

      // Immediate cache updates to remove review and stop any polling
      if (repositoryId && prNumber) {
        utils.review.getLatestForPR.setData(
          { repositoryId, prNumber },
          null
        );
        void utils.review.getLatestForPR.invalidate({
          repositoryId,
          prNumber,
        });
        void utils.pullRequest.get.invalidate({
          repositoryId,
          prNumber,
        });
      }

      // Invalidate review lists and repositories
      void utils.review.list.invalidate();
      if (repositoryId) {
        void utils.pullRequest.list.invalidate({ repositoryId });
      }

      toast.success(
        "Review deleted",
        data.cancellationRequested || status === "PROCESSING" || status === "PENDING"
          ? "The review was removed and background processing was cancelled."
          : "The review and its associated data were removed successfully."
      );

      onDeleted?.();
    },
    onError: (error) => {
      // If the review has already been deleted, clean up gracefully
      if (
        error.data?.code === "NOT_FOUND" ||
        error.message.toLowerCase().includes("not found") ||
        error.message.toLowerCase().includes("already")
      ) {
        setOpen(false);
        if (repositoryId && prNumber) {
          utils.review.getLatestForPR.setData(
            { repositoryId, prNumber },
            null
          );
          void utils.review.getLatestForPR.invalidate({
            repositoryId,
            prNumber,
          });
        }
        void utils.review.list.invalidate();
        toast.info(
          "Review already removed",
          "This review was already deleted."
        );
        onDeleted?.();
        return;
      }

      // Handle forbidden or other errors
      toast.error(
        "Failed to delete review",
        error.message || "An unexpected error occurred while deleting the review."
      );
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (deleteMutation.isPending) return;

    deleteMutation.mutate({ id: reviewId });
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(true);
        }}
        disabled={deleteMutation.isPending}
        className={cn(
          "border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors gap-1.5 font-medium shrink-0",
          className
        )}
      >
        <Trash2 className="size-3.5" />
        <span>Delete Review</span>
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this review?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove this review and its associated review data.
              If the review is still processing, its background execution will
              also be cancelled where possible.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
            >
              Keep Review
            </AlertDialogCancel>

            <Button
              type="button"
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={handleDelete}
              className="gap-1.5"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="size-3.5" />
                  <span>Delete Review</span>
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
