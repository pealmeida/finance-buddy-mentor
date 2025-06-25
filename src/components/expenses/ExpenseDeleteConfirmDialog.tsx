import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

interface ExpenseDeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ExpenseDeleteConfirmDialog: React.FC<ExpenseDeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("expenses.confirmDeletion", "Confirm Deletion")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "expenses.confirmDeletionDescription",
              "Are you sure you want to delete this expense? This action cannot be undone."
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button variant='destructive' onClick={onConfirm}>
            {t("common.delete", "Delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseDeleteConfirmDialog;
