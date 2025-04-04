
import React from 'react';
import { Link } from 'react-router-dom';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FitPerception {
  chest?: string;
  waist?: string;
  hip?: string;
  shoulders?: string;
  sleeves?: string;
  length?: string;
  width?: string;
  comfort?: string;
}

interface EditFitPerceptionSectionProps {
  garmentId: string;
  garmentType: string;
  currentFitPerception: FitPerception;
  onFitPerceptionChange: (part: string, value: string) => void;
}

const EditFitPerceptionSection: React.FC<EditFitPerceptionSectionProps> = ({
  garmentId,
  garmentType,
  currentFitPerception,
  onFitPerceptionChange,
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);
  
  // Determine which fit fields to show based on garment type
  const getFitFieldsForType = () => {
    switch (garmentType.toLowerCase()) {
      case 't-shirt':
        return ['chest', 'shoulders', 'sleeves'];
      case 'trousers':
      case 'pants':
      case 'jeans':
        return ['waist', 'hips', 'length'];
      case 'dress':
        return ['chest', 'waist', 'hips', 'length'];
      case 'shoes':
        return ['length', 'width', 'comfort'];
      default:
        // Default fields if type doesn't match
        return ['chest', 'waist', 'hip'];
    }
  };
  
  const fitFields = getFitFieldsForType();
  
  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Fit perception updated",
      description: "Your fit preferences have been saved."
    });
  };
  
  const formatFieldName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };
  
  if (!isEditing) {
    return (
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl">Fit Perception</h2>
          <button 
            onClick={() => setIsEditing(true)}
            className="text-sm text-brand-primary hover:underline"
          >
            Changed your mind about how this fits?
          </button>
        </div>
        <div className="space-y-4">
          {fitFields.map(field => (
            <div key={field} className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm font-medium">{formatFieldName(field)} Fit</span>
              <span className="text-sm font-semibold px-3 py-1 bg-gray-50 rounded-md">
                {currentFitPerception[field as keyof FitPerception] || "Just Right"}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="glass-panel p-6">
      <h2 className="font-heading text-xl mb-6">Edit Fit Perception</h2>
      <div className="space-y-6">
        {fitFields.map((field) => (
          <div key={field} className="space-y-2">
            <label className="text-sm font-medium">{formatFieldName(field)}</label>
            <ToggleGroup 
              type="single"
              value={currentFitPerception[field as keyof FitPerception] || "Just Right"}
              onValueChange={(value) => {
                if (value) onFitPerceptionChange(field, value);
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
            <p className="text-xs text-brand-muted mt-1">
              Your fit perception helps tailor future size recommendations.
            </p>
          </div>
        ))}
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-brand-primary text-white rounded-md text-sm hover:bg-brand-primary/90"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFitPerceptionSection;
