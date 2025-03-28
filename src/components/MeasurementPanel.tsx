
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMeasurements } from '@/contexts/MeasurementContext';
import MeasurementModal from './MeasurementModal';

const MeasurementPanel: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { measurements } = useMeasurements();

  return (
    <div className="animate-fade-in">
      <Button 
        variant="outline" 
        className="w-full h-auto py-6 flex flex-col items-center justify-center gap-2 border-dashed"
        onClick={() => setIsModalOpen(true)}
      >
        <img 
          src="/lovable-uploads/1abc69ff-bebf-46dc-8bf4-aff0d2654e90.png" 
          alt="Mannequin" 
          className="h-32 mb-2" 
        />
        <span className="text-base font-medium">My Body Measurements</span>
        <span className="text-xs text-muted-foreground">
          {measurements.length} measurements saved
        </span>
      </Button>
      
      <MeasurementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default MeasurementPanel;
