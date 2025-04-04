
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUnit } from '@/contexts/UnitContext';
import { Label } from '@/components/ui/label';
import { useMeasurements } from '@/contexts/MeasurementContext';
import MeasurementList from './measurements/MeasurementList';
import AddMeasurementButton from './measurements/AddMeasurementButton';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

type MeasurementModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MeasurementModal: React.FC<MeasurementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { measurements, updateMeasurements } = useMeasurements();
  const [localMeasurements, setLocalMeasurements] = useState([...measurements]);
  const [hasChanges, setHasChanges] = useState(false);
  const { unitSystem, toggleUnitSystem } = useUnit();

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalMeasurements([...measurements]);
      setHasChanges(false);
    }
  }, [isOpen, measurements]);

  const handleMeasurementChange = (id: string, newValue: number) => {
    setLocalMeasurements(prev => 
      prev.map(m => m.id === id ? { ...m, value: newValue } : m)
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    updateMeasurements(localMeasurements);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">My Measurements</DialogTitle>
          <div className="flex items-center space-x-2 mt-2">
            <ToggleGroup 
              type="single" 
              value={unitSystem} 
              onValueChange={(value) => {
                if (value && (value === 'metric' || value === 'imperial')) {
                  if (value !== unitSystem) {
                    toggleUnitSystem();
                  }
                }
              }}
              className="bg-gray-100 p-1 rounded-md"
            >
              <ToggleGroupItem 
                value="metric" 
                className="text-sm px-4 py-1 data-[state=on]:bg-white data-[state=on]:shadow-sm"
              >
                Metric
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="imperial" 
                className="text-sm px-4 py-1 data-[state=on]:bg-white data-[state=on]:shadow-sm"
              >
                Imperial
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4">
          <div className="flex justify-end mb-4">
            <AddMeasurementButton />
          </div>
          
          <MeasurementList 
            measurements={localMeasurements}
            onChange={handleMeasurementChange}
          />
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
