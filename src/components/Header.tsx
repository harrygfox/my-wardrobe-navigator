
import React from 'react';
import { useUnit } from '@/contexts/UnitContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Header: React.FC = () => {
  const { unitSystem, toggleUnitSystem } = useUnit();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 border-b border-gray-100 animate-fade-in">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-2xl md:text-3xl tracking-tight text-brand-primary">
            My Closet
          </h1>
          <span className="text-xs py-1 px-2 bg-brand-accent/10 text-brand-accent rounded-full">
            Beta
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <Label htmlFor="unit-toggle" className="text-sm text-brand-muted">
              {unitSystem === 'metric' ? 'Metric' : 'Imperial'}
            </Label>
            <Switch
              id="unit-toggle"
              checked={unitSystem === 'imperial'}
              onCheckedChange={toggleUnitSystem}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
