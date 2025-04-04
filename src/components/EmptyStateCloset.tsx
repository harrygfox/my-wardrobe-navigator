
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateClosetProps {
  onAddGarment: () => void;
}

const placeholders = [
  "Where your favorite jeans go",
  "The shirt that fits just right",
  "Your closet's first hero"
];

const EmptyStateCloset: React.FC<EmptyStateClosetProps> = ({ onAddGarment }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="max-w-md mx-auto">
        <h2 className="font-heading text-3xl mb-3">Let's build your smart wardrobe</h2>
        <p className="text-brand-muted mb-8">
          Add your first piece and help Fit Assistant learn what fits you best.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {placeholders.map((placeholder, index) => (
            <div 
              key={index}
              className="aspect-[3/4] bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center p-6 text-center"
            >
              <p className="text-sm text-brand-muted italic">{placeholder}</p>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={onAddGarment}
          size="lg"
          className="mb-3"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Your First Garment
        </Button>
        <p className="text-sm text-brand-muted">
          Start with something you wear often and love the fit of.
        </p>
        
        <div className="mt-10 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-brand-muted">
            0 garments teaching Fit Assistant. Add one to start improving your recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyStateCloset;
