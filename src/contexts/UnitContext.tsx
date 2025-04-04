
import React, { createContext, useState, useContext, useEffect } from 'react';

export type UnitSystem = 'metric' | 'imperial';

type UnitContextType = {
  unitSystem: UnitSystem;
  toggleUnitSystem: () => void;
  convertHeight: (value: number, to: UnitSystem) => number;
  convertWeight: (value: number, to: UnitSystem) => number;
  convertMeasurement: (value: number, to: UnitSystem) => number;
  formatHeight: (value: number) => string;
  formatWeight: (value: number) => string;
  formatMeasurement: (value: number) => string;
};

const UnitContext = createContext<UnitContextType | undefined>(undefined);

// Try to load saved preference from localStorage
const getSavedUnitSystem = (): UnitSystem => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('unitSystem');
    if (saved === 'metric' || saved === 'imperial') {
      return saved;
    }
  }
  return 'metric'; // Default to metric if no valid preference found
};

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(getSavedUnitSystem());

  const toggleUnitSystem = () => {
    const newSystem = unitSystem === 'metric' ? 'imperial' : 'metric';
    setUnitSystem(newSystem);
    
    // Save preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('unitSystem', newSystem);
    }
  };

  // Conversion functions
  const convertHeight = (value: number, to: UnitSystem): number => {
    if (to === 'metric') {
      // Convert from inches to cm
      return Math.round(value * 2.54);
    } else {
      // Convert from cm to inches
      return Math.round(value / 2.54);
    }
  };

  const convertWeight = (value: number, to: UnitSystem): number => {
    if (to === 'metric') {
      // Convert from pounds to kg
      return Math.round(value * 0.45359237);
    } else {
      // Convert from kg to pounds
      return Math.round(value / 0.45359237);
    }
  };

  const convertMeasurement = (value: number, to: UnitSystem): number => {
    if (to === 'metric') {
      // Convert from inches to cm
      return Math.round(value * 2.54);
    } else {
      // Convert from cm to inches
      return Math.round(value / 2.54);
    }
  };

  // Formatting functions
  const formatHeight = (value: number): string => {
    if (unitSystem === 'metric') {
      return `${value} cm`;
    } else {
      const feet = Math.floor(value / 12);
      const inches = value % 12;
      return `${feet}'${inches}"`;
    }
  };

  const formatWeight = (value: number): string => {
    if (unitSystem === 'metric') {
      return `${value} kg`;
    } else {
      const stones = Math.floor(value / 14);
      const pounds = value % 14;
      if (stones > 0) {
        return `${stones}st ${pounds}lb`;
      }
      return `${value}lb`;
    }
  };

  const formatMeasurement = (value: number): string => {
    if (unitSystem === 'metric') {
      return `${value} cm`;
    } else {
      return `${value}"`;
    }
  };

  return (
    <UnitContext.Provider
      value={{
        unitSystem,
        toggleUnitSystem,
        convertHeight,
        convertWeight,
        convertMeasurement,
        formatHeight,
        formatWeight,
        formatMeasurement
      }}
    >
      {children}
    </UnitContext.Provider>
  );
};

export const useUnit = (): UnitContextType => {
  const context = useContext(UnitContext);
  if (context === undefined) {
    throw new Error('useUnit must be used within a UnitProvider');
  }
  return context;
};
