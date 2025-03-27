
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import GarmentForm from './GarmentForm';

interface AddGarmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

const AddGarmentDialog: React.FC<AddGarmentDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit
}) => {
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Add New Garment</DialogTitle>
        </DialogHeader>
        <GarmentForm 
          onSubmit={onSubmit} 
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddGarmentDialog;
