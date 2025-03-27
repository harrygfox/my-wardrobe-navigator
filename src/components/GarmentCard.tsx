
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Garment {
  id: string;
  name: string;
  brand: string;
  size: string;
  color: string;
  image: string;
  teachFitAssistant: boolean;
  measurements: {
    chest?: number;
    waist?: number;
    hip?: number;
  };
}

interface GarmentCardProps {
  garment: Garment;
  onToggleFitAssistant: (id: string, value: boolean) => void;
  onDelete: (id: string) => void;
}

const GarmentCard: React.FC<GarmentCardProps> = ({
  garment,
  onToggleFitAssistant,
  onDelete,
}) => {
  return (
    <Card className="overflow-hidden card-hover animate-scale-in">
      <div className="relative">
        <Link to={`/garment/${garment.id}`}>
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
            <img
              src={garment.image || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1205&auto=format&fit=crop'}
              alt={garment.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </Link>
        
        {garment.teachFitAssistant && (
          <Badge className="absolute top-3 right-3 bg-brand-accent/90 hover:bg-brand-accent">
            Fit Assistant
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <div className="text-sm text-brand-muted">{garment.brand}</div>
          <h3 className="font-medium text-lg leading-tight">{garment.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-brand-muted">{garment.size}</span>
            <span className="text-brand-muted">•</span>
            <span className="text-sm text-brand-muted">{garment.color}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Switch
              id={`fit-toggle-${garment.id}`}
              checked={garment.teachFitAssistant}
              onCheckedChange={(checked) => onToggleFitAssistant(garment.id, checked)}
            />
            <label 
              htmlFor={`fit-toggle-${garment.id}`} 
              className="text-xs text-brand-muted cursor-pointer"
            >
              Teach Fit Assistant
            </label>
          </div>
          
          <div className="flex gap-1">
            <Link 
              to={`/garment/${garment.id}`}
              className="p-1.5 rounded-md text-gray-500 hover:text-brand-primary hover:bg-gray-100 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => onDelete(garment.id)}
              className="p-1.5 rounded-md text-gray-500 hover:text-red-500 hover:bg-gray-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GarmentCard;
