
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export type Measurement = {
  id: string;
  name: string;
  value: number;
  type: 'height' | 'weight' | 'measurement';
  min: number;
  max: number;
};

type MeasurementContextType = {
  measurements: Measurement[];
  updateMeasurements: (measurements: Measurement[]) => void;
  addMeasurements: (measurementIds: string[]) => void;
  availableMeasurements: Measurement[];
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

// Anatomically ordered measurements for reference
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

const MeasurementContext = createContext<MeasurementContextType | undefined>(undefined);

export const MeasurementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [measurements, setMeasurements] = useState<Measurement[]>(defaultMeasurements);
  const { toast } = useToast();

  const updateMeasurements = (updatedMeasurements: Measurement[]) => {
    setMeasurements(updatedMeasurements);
    toast({
      title: "Measurements Saved",
      description: "Your body measurements have been updated.",
    });
  };

  const addMeasurements = (measurementIds: string[]) => {
    const newMeasurements = measurementIds.map(id => {
      const measurement = additionalMeasurements.find(m => m.id === id);
      return measurement || allMeasurements.find(m => m.id === id)!;
    });

    setMeasurements(prev => [...prev, ...newMeasurements]);
    toast({
      title: "Measurements Added",
      description: `${measurementIds.length} new measurements have been added.`,
    });
  };

  // Filter out measurements that are already added
  const getAvailableMeasurements = () => {
    return additionalMeasurements.filter(
      m => !measurements.some(existing => existing.id === m.id)
    );
  };

  return (
    <MeasurementContext.Provider
      value={{
        measurements,
        updateMeasurements,
        addMeasurements,
        availableMeasurements: getAvailableMeasurements(),
      }}
    >
      {children}
    </MeasurementContext.Provider>
  );
};

export const useMeasurements = (): MeasurementContextType => {
  const context = useContext(MeasurementContext);
  if (context === undefined) {
    throw new Error('useMeasurements must be used within a MeasurementProvider');
  }
  return context;
};
