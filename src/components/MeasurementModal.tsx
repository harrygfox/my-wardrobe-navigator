
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import FitSlider from './FitSlider';
import { useUnit } from '@/contexts/UnitContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Measurement } from './MeasurementPanel';
import { useToast } from '@/hooks/use-toast';

type MeasurementModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (measurements: Measurement[]) => void;
  initialMeasurements: Measurement[];
};

// Anatomically ordered measurements
const allMeasurements: Measurement[] = [
  { id: 'height', name: 'Height', value: 170, type: 'height', min: 140, max: 220 },
  { id: 'weight', name: 'Weight', value: 70, type: 'weight', min: 40, max: 150 },
  { id: 'shoulders', name: 'Shoulders', value: 45, type: 'measurement', min: 30, max: 60 },
  { id: 'chest', name: 'Chest', value: 90, type: 'measurement', min: 60, max: 140 },
  { id: 'bust', name: 'Bust', value: 90, type: 'measurement', min: 60, max: 140 },
  { id: 'underbust', name: 'Underbust', value: 75, type: 'measurement', min: 50, max: 120 },
  { id: 'waist', name: 'Waist', value: 75, type: 'measurement', min: 50, max: 140 },
  { id: 'abdomen', name: 'Abdomen', value: 85, type: 'measurement', min: 60, max: 150 },
  { id: 'hip', name: 'Hip', value: 90, type: 'measurement', min: 60, max: 150 },
  { id: 'thighs', name: 'Thighs', value: 55, type: 'measurement', min: 30, max: 90 },
];

const MeasurementModal: React.FC<MeasurementModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMeasurements,
}) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const { unitSystem, toggleUnitSystem } = useUnit();
  const { toast } = useToast();

  // Initialize with all possible measurements, using values from initialMeasurements where available
  useEffect(() => {
    if (isOpen) {
      const mergedMeasurements = allMeasurements.map(defaultMeasurement => {
        const existingMeasurement = initialMeasurements.find(m => m.id === defaultMeasurement.id);
        return existingMeasurement || defaultMeasurement;
      });
      setMeasurements(mergedMeasurements);
      setHasChanges(false);
    }
  }, [isOpen, initialMeasurements]);

  const handleMeasurementChange = (id: string, newValue: number) => {
    setMeasurements(prev => 
      prev.map(m => m.id === id ? { ...m, value: newValue } : m)
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(measurements);
    toast({
      title: "Measurements Saved",
      description: "Your body measurements have been updated.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">My Measurements</DialogTitle>
          <div className="flex items-center space-x-2 mt-2">
            <Label htmlFor="unit-toggle-modal" className="text-sm text-brand-muted">
              {unitSystem === 'metric' ? 'Metric' : 'Imperial'}
            </Label>
            <Switch
              id="unit-toggle-modal"
              checked={unitSystem === 'imperial'}
              onCheckedChange={toggleUnitSystem}
            />
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4">
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementModal;
