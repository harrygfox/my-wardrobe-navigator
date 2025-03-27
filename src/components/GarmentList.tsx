
import React from 'react';
import GarmentCard, { Garment } from '@/components/GarmentCard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface GarmentListProps {
  garments: Garment[];
  onToggleFitAssistant: (id: string, value: boolean) => void;
  onDeleteGarment: (id: string) => void;
  onAddGarmentClick: () => void;
}

const GarmentList: React.FC<GarmentListProps> = ({
  garments,
  onToggleFitAssistant,
  onDeleteGarment,
  onAddGarmentClick
}) => {
  return (
    <section className="mb-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-heading text-2xl md:text-3xl">Garments</h2>
        <Button onClick={onAddGarmentClick} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          <span>Add Garment</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {garments.map((garment) => (
          <GarmentCard
            key={garment.id}
            garment={garment}
            onToggleFitAssistant={onToggleFitAssistant}
            onDelete={onDeleteGarment}
          />
        ))}
        
        {garments.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <p className="text-brand-muted mb-4">Your closet is empty</p>
            <Button 
              onClick={onAddGarmentClick} 
              variant="outline"
              className="border-dashed"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add your first garment
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default GarmentList;
