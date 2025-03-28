
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useMeasurements } from '@/contexts/MeasurementContext';
import AddMeasurementModal from '../AddMeasurementModal';

const AddMeasurementButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { availableMeasurements, addMeasurements } = useMeasurements();

  const handleAddMeasurements = (selectedIds: string[]) => {
    addMeasurements(selectedIds);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setIsOpen(true)}
        disabled={availableMeasurements.length === 0}
      >
        <Plus className="h-4 w-4" />
        <span>Add Measurement</span>
      </Button>

      <AddMeasurementModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAddMeasurements={handleAddMeasurements}
        availableMeasurements={availableMeasurements}
      />
    </>
  );
};

export default AddMeasurementButton;
