
import React, { useState, useEffect } from 'react';
import { useUnit, UnitSystem } from '@/contexts/UnitContext';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface FitSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  measurementType: 'height' | 'weight' | 'measurement';
  className?: string;
}

const FitSlider: React.FC<FitSliderProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  measurementType,
  className = '',
}) => {
  const { 
    unitSystem, 
    formatHeight, 
    formatWeight, 
    formatMeasurement,
    convertHeight,
    convertWeight,
    convertMeasurement,
  } = useUnit();

  const [localValue, setLocalValue] = useState<number>(value);
  
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Convert min, max, and value based on the measurement type and unit system
  const getConvertedRange = () => {
    let convertedMin: number, convertedMax: number, convertedValue: number;
    
    if (measurementType === 'height') {
      convertedMin = unitSystem === 'metric' ? min : convertHeight(min, 'imperial');
      convertedMax = unitSystem === 'metric' ? max : convertHeight(max, 'imperial');
      convertedValue = unitSystem === 'metric' ? localValue : convertHeight(localValue, 'imperial');
    } else if (measurementType === 'weight') {
      convertedMin = unitSystem === 'metric' ? min : convertWeight(min, 'imperial');
      convertedMax = unitSystem === 'metric' ? max : convertWeight(max, 'imperial');
      convertedValue = unitSystem === 'metric' ? localValue : convertWeight(localValue, 'imperial');
    } else {
      convertedMin = unitSystem === 'metric' ? min : convertMeasurement(min, 'imperial');
      convertedMax = unitSystem === 'metric' ? max : convertMeasurement(max, 'imperial');
      convertedValue = unitSystem === 'metric' ? localValue : convertMeasurement(localValue, 'imperial');
    }
    
    return { convertedMin, convertedMax, convertedValue };
  };

  const { convertedMin, convertedMax, convertedValue } = getConvertedRange();

  const handleChange = (newValue: number[]) => {
    const value = newValue[0];
    setLocalValue(value);
    
    // Convert back to metric for storage if necessary
    let storedValue: number;
    if (unitSystem === 'imperial') {
      if (measurementType === 'height') {
        storedValue = convertHeight(value, 'metric');
      } else if (measurementType === 'weight') {
        storedValue = convertWeight(value, 'metric');
      } else {
        storedValue = convertMeasurement(value, 'metric');
      }
    } else {
      storedValue = value;
    }
    
    onChange(storedValue);
  };

  const formatValue = () => {
    if (measurementType === 'height') {
      return formatHeight(convertedValue);
    } else if (measurementType === 'weight') {
      return formatWeight(convertedValue);
    } else {
      return formatMeasurement(convertedValue);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex justify-between items-center">
        <Label htmlFor={`slider-${label}`} className="text-sm font-medium">
          {label}
        </Label>
        <div className="text-sm font-semibold px-3 py-1 bg-gray-50 rounded-md">
          {formatValue()}
        </div>
      </div>
      <Slider
        id={`slider-${label}`}
        min={convertedMin}
        max={convertedMax}
        step={step}
        value={[convertedValue]}
        onValueChange={handleChange}
        className="py-2"
      />
    </div>
  );
};

export default FitSlider;
