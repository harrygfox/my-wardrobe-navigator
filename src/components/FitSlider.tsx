
import React, { useState, useEffect } from 'react';
import { useUnit } from '@/contexts/UnitContext';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ThumbsUp, ThumbsDown, Check } from 'lucide-react';

interface FitSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  measurementType: 'height' | 'weight' | 'measurement';
  className?: string;
  isFitPerception?: boolean;
  fitValue?: string;
  onFitChange?: (value: string) => void;
  showExplainer?: boolean;
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
  isFitPerception = false,
  fitValue = 'Just Right',
  onFitChange,
  showExplainer = true,
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
  
  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  // Update local value when unit system changes
  useEffect(() => {
    setLocalValue(value);
  }, [unitSystem, value]);

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

  const handleFitChange = (value: string) => {
    if (onFitChange) {
      onFitChange(value);
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
      
      {isFitPerception ? (
        <>
          <ToggleGroup 
            type="single"
            value={fitValue}
            onValueChange={(value) => {
              if (value) handleFitChange(value);
            }}
            className="justify-between w-full border rounded-md p-1 bg-gray-50"
          >
            <ToggleGroupItem value="Very Loose" className="flex-1 text-xs">
              <ThumbsDown className="h-4 w-4 mr-1" />
              Very Loose
            </ToggleGroupItem>
            <ToggleGroupItem value="Loose" className="flex-1 text-xs">
              Loose
            </ToggleGroupItem>
            <ToggleGroupItem value="Just Right" className="flex-1 text-xs">
              <Check className="h-4 w-4 mr-1" />
              Just Right
            </ToggleGroupItem>
            <ToggleGroupItem value="Snug" className="flex-1 text-xs">
              Snug
            </ToggleGroupItem>
            <ToggleGroupItem value="Very Tight" className="flex-1 text-xs">
              <ThumbsUp className="h-4 w-4 mr-1" />
              Very Tight
            </ToggleGroupItem>
          </ToggleGroup>
          {showExplainer && (
            <p className="text-xs text-brand-muted mt-1">
              Your fit perception helps tailor future size recommendations.
            </p>
          )}
        </>
      ) : (
        <Slider
          id={`slider-${label}`}
          min={convertedMin}
          max={convertedMax}
          step={step}
          value={[convertedValue]}
          onValueChange={handleChange}
          className="py-2"
        />
      )}
    </div>
  );
};

export default FitSlider;
