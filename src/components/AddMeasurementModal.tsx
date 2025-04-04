
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Measurement } from '@/contexts/MeasurementContext';
import { X } from 'lucide-react';

interface AddMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeasurements: (selectedIds: string[]) => void;
  availableMeasurements: Measurement[];
}

const AddMeasurementModal: React.FC<AddMeasurementModalProps> = ({
  isOpen,
  onClose,
  onAddMeasurements,
  availableMeasurements,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleSubmit = () => {
    onAddMeasurements(selectedIds);
    setSelectedIds([]);
  };

  const handleClose = () => {
    onClose();
    setSelectedIds([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Add Measurements</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-muted-foreground mb-4">
            Select additional measurements to track for better fit recommendations.
          </p>
          
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
            {availableMeasurements.length > 0 ? (
              availableMeasurements.map((measurement) => (
                <div key={measurement.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`checkbox-${measurement.id}`}
                    checked={selectedIds.includes(measurement.id)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(measurement.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`checkbox-${measurement.id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {measurement.name}
                  </Label>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                All available measurements have already been added.
              </p>
            )}
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={selectedIds.length === 0}
          >
            Add Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMeasurementModal;
