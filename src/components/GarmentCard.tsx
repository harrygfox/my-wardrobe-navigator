
import React from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Trash2, Edit, BadgeCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface Measurements {
  chest?: number;
  waist?: number;
  hip?: number;
  shoulders?: number;
  sleeves?: number;
  length?: number;
  width?: number;
  comfort?: number;
}

export interface Garment {
  id: string;
  name: string;
  brand: string;
  size: string;
  color: string;
  image: string;
  teachFitAssistant: boolean;
  measurements: Measurements;
}

interface GarmentCardProps {
  garment: Garment;
  onToggleFitAssistant: (id: string, value: boolean) => void;
  onDelete: (id: string) => void;
  editLinkWithQueryParam?: boolean;
}

const GarmentCard: React.FC<GarmentCardProps> = ({
  garment,
  onToggleFitAssistant,
  onDelete,
  editLinkWithQueryParam = false
}) => {
  const handleFitAssistantChange = (checked: boolean) => {
    onToggleFitAssistant(garment.id, checked);
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative">
        <Link to={`/garment/${garment.id}`}>
          <AspectRatio ratio={3/4} className="bg-gray-100">
            {garment.image ? (
              <img 
                src={garment.image} 
                alt={garment.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-brand-muted">
                No image
              </div>
            )}
          </AspectRatio>
        </Link>
        
        {garment.teachFitAssistant && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute top-2 right-2">
                  <BadgeCheck className="h-5 w-5 text-brand-primary bg-white rounded-full p-0.5" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>This garment is shaping your fit preferences.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <div className="absolute top-2 left-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                className="flex items-center gap-2 text-sm cursor-pointer"
                asChild
              >
                <Link to={editLinkWithQueryParam ? `/garment/${garment.id}?edit=true` : `/garment/${garment.id}`}>
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem
                className="flex items-center gap-2 text-sm text-red-600 focus:text-red-600 cursor-pointer"
                onClick={() => onDelete(garment.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <Link to={`/garment/${garment.id}`} className="block">
            <h3 className="font-medium line-clamp-1">{garment.name}</h3>
            <p className="text-sm text-brand-muted line-clamp-1">{garment.brand}</p>
          </Link>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-xs text-brand-muted">Size</p>
            <p className="text-sm">{garment.size}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              id={`fit-assistant-${garment.id}`}
              checked={garment.teachFitAssistant}
              onCheckedChange={handleFitAssistantChange}
              className="data-[state=checked]:bg-brand-primary"
            />
            <label htmlFor={`fit-assistant-${garment.id}`} className="text-xs cursor-pointer">
              Fit Assistant
            </label>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GarmentCard;
