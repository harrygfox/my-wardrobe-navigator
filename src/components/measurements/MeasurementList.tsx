
import React from 'react';
import FitSlider from '@/components/FitSlider';
import { Measurement } from '@/contexts/MeasurementContext';

interface MeasurementListProps {
  measurements: Measurement[];
  onChange: (id: string, value: number) => void;
}

const MeasurementList: React.FC<MeasurementListProps> = ({ measurements, onChange }) => {
  // Sort measurements to maintain anatomical order
  const sortedMeasurements = [...measurements].sort((a, b) => {
    // Define anatomical order
    const order = [
      'height', 'weight', 'shoulders', 'chest', 'bust', 
      'underbust', 'waist', 'abdomen', 'hip', 'thighs'
    ];
    return order.indexOf(a.id) - order.indexOf(b.id);
  });

  return (
    <div className="space-y-6">
      {sortedMeasurements.map((measurement) => (
        <FitSlider
          key={measurement.id}
          label={measurement.name}
          value={measurement.value}
          onChange={(newValue) => onChange(measurement.id, newValue)}
          min={measurement.min}
          max={measurement.max}
          measurementType={measurement.type}
        />
      ))}
    </div>
  );
};

export default MeasurementList;
