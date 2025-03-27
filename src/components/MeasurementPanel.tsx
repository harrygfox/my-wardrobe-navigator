import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUnit } from '@/contexts/UnitContext';
import MeasurementModal from './MeasurementModal';
import { useToast } from '@/hooks/use-toast';

export type Measurement = {
  id: string;
  name: string;
  value: number;
  type: 'height' | 'weight' | 'measurement';
  min: number;
  max: number;
};

const defaultMeasurements: Measurement[] = [
  { id: 'height', name: 'Height', value: 170, type: 'height', min: 140, max: 220 },
  { id: 'weight', name: 'Weight', value: 70, type: 'weight', min: 40, max: 150 },
  { id: 'hip', name: 'Hip', value: 90, type: 'measurement', min: 60, max: 150 },
];

// Available additional measurements
export const additionalMeasurements: Measurement[] = [
  { id: 'shoulders', name: 'Shoulders', value: 45, type: 'measurement', min: 30, max: 60 },
  { id: 'chest', name: 'Chest', value: 90, type: 'measurement', min: 60, max: 140 },
  { id: 'bust', name: 'Bust', value: 90, type: 'measurement', min: 60, max: 140 },
  { id: 'underbust', name: 'Underbust', value: 75, type: 'measurement', min: 50, max: 120 },
  { id: 'waist', name: 'Waist', value: 75, type: 'measurement', min: 50, max: 140 },
  { id: 'abdomen', name: 'Abdomen', value: 85, type: 'measurement', min: 60, max: 150 },
  { id: 'thighs', name: 'Thighs', value: 55, type: 'measurement', min: 30, max: 90 },
];

const MeasurementPanel: React.FC = () => {
  const [measurements, setMeasurements] = useState<Measurement[]>(defaultMeasurements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleSaveMeasurements = (updatedMeasurements: Measurement[]) => {
    setMeasurements(updatedMeasurements);
  };

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
        onSave={handleSaveMeasurements}
        initialMeasurements={measurements}
      />
    </div>
  );
};

export default MeasurementPanel;
