
import React, { useState } from 'react';
import FitSlider from './FitSlider';
import { Button } from '@/components/ui/button';
import { useUnit } from '@/contexts/UnitContext';
import AddMeasurementModal from './AddMeasurementModal';
import { PlusCircle } from 'lucide-react';

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
  const { unitSystem } = useUnit();

  const handleMeasurementChange = (id: string, newValue: number) => {
    setMeasurements(prev => 
      prev.map(m => m.id === id ? { ...m, value: newValue } : m)
    );
  };

  const handleAddMeasurement = (selectedIds: string[]) => {
    // Filter out measurements that are already added
    const currentIds = measurements.map(m => m.id);
    const newMeasurementsToAdd = additionalMeasurements
      .filter(m => selectedIds.includes(m.id) && !currentIds.includes(m.id));
    
    setMeasurements(prev => [...prev, ...newMeasurementsToAdd]);
    setIsModalOpen(false);
  };

  // Filter out measurements that are already added for the modal
  const availableMeasurements = additionalMeasurements.filter(
    m => !measurements.some(existing => existing.id === m.id)
  );

  return (
    <div className="glass-panel p-6 animate-fade-in">
      <h2 className="font-heading text-xl mb-6">My Measurements</h2>
      
      <div className="space-y-6">
        {measurements.map((measurement) => (
          <FitSlider
            key={measurement.id}
            label={measurement.name}
            value={measurement.value}
            onChange={(newValue) => handleMeasurementChange(measurement.id, newValue)}
            min={measurement.min}
            max={measurement.max}
            measurementType={measurement.type}
          />
        ))}
      </div>
      
      {availableMeasurements.length > 0 && (
        <Button 
          variant="outline" 
          className="mt-6 w-full flex items-center justify-center gap-2 border-dashed"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add a Measurement</span>
        </Button>
      )}
      
      <AddMeasurementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMeasurements={handleAddMeasurement}
        availableMeasurements={availableMeasurements}
      />
    </div>
  );
};

export default MeasurementPanel;
