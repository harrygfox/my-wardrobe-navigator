import React, { useState } from 'react';
import { useUnit } from '@/contexts/UnitContext';
import FitSlider from './FitSlider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Camera, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GarmentFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isEdit?: boolean;
  onCancel?: () => void;
}

const brandOptions = ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E', 'Brand F'];
const fitOptions = ['Very Loose', 'Loose', 'Just Right', 'Snug', 'Very Tight'];

const GarmentForm: React.FC<GarmentFormProps> = ({ 
  onSubmit, 
  initialData = {
    name: '',
    brand: '',
    size: '',
    color: '',
    measurements: {
      chest: 90,
      waist: 75,
      hip: 95
    },
    fitPerception: {
      chest: 'Just Right',
      waist: 'Just Right',
      hip: 'Just Right'
    },
    teachFitAssistant: false,
    image: ''
  }, 
  isEdit = false,
  onCancel
}) => {
  const [formData, setFormData] = useState(initialData);
  const [imagePreview, setImagePreview] = useState(initialData.image || '');
  const { unitSystem } = useUnit();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFitPerceptionChange = (part: 'chest' | 'waist' | 'hip', value: string) => {
    setFormData(prev => ({
      ...prev,
      fitPerception: {
        ...prev.fitPerception,
        [part]: value
      }
    }));
  };

  const handleMeasurementChange = (part: 'chest' | 'waist' | 'hip', value: number) => {
    setFormData(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [part]: value
      }
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleFitAssistant = (checked: boolean) => {
    setFormData(prev => ({ ...prev, teachFitAssistant: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.brand || !formData.size || !formData.color) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base">Garment Image</Label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Garment preview" 
                    className="max-h-80 mx-auto rounded-lg object-contain" 
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute bottom-2 right-2 bg-white"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Camera className="h-4 w-4 mr-1" />
                    Change
                  </Button>
                </div>
              ) : (
                <div 
                  className="flex flex-col items-center justify-center py-10 cursor-pointer"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Select
                value={formData.brand}
                onValueChange={(value) => handleSelectChange('brand', value)}
              >
                <SelectTrigger id="brand" className="input-field">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brandOptions.map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                  <SelectItem value="custom">Other (Custom)</SelectItem>
                </SelectContent>
              </Select>
              {formData.brand === 'custom' && (
                <Input
                  name="customBrand"
                  placeholder="Enter brand name"
                  value={formData.customBrand || ''}
                  onChange={(e) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      customBrand: e.target.value,
                      brand: e.target.value
                    }));
                  }}
                  className="mt-2"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="E.g., Cotton T-Shirt"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  name="size"
                  placeholder="E.g., M, 32, 10"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  name="color"
                  placeholder="E.g., Navy Blue"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base">Garment Measurements</Label>
            <div className="space-y-5">
              <FitSlider
                label="Chest"
                value={formData.measurements.chest}
                onChange={(value) => handleMeasurementChange('chest', value)}
                min={60}
                max={140}
                measurementType="measurement"
              />
              <FitSlider
                label="Waist"
                value={formData.measurements.waist}
                onChange={(value) => handleMeasurementChange('waist', value)}
                min={50}
                max={140}
                measurementType="measurement"
              />
              <FitSlider
                label="Hip"
                value={formData.measurements.hip}
                onChange={(value) => handleMeasurementChange('hip', value)}
                min={60}
                max={150}
                measurementType="measurement"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base">Fit Perception</Label>
            <div className="grid grid-cols-1 gap-4">
              {['chest', 'waist', 'hip'].map((part) => (
                <div key={part} className="space-y-2">
                  <Label htmlFor={`fit-${part}`} className="capitalize text-sm">
                    {part} Fit
                  </Label>
                  <Select
                    value={formData.fitPerception[part as 'chest' | 'waist' | 'hip']}
                    onValueChange={(value) => 
                      handleFitPerceptionChange(part as 'chest' | 'waist' | 'hip', value)
                    }
                  >
                    <SelectTrigger id={`fit-${part}`} className="input-field">
                      <SelectValue placeholder={`Select ${part} fit`} />
                    </SelectTrigger>
                    <SelectContent>
                      {fitOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <div className="flex items-center space-x-3">
              <Switch
                id="fit-assistant"
                checked={formData.teachFitAssistant}
                onCheckedChange={handleToggleFitAssistant}
              />
              <div>
                <Label 
                  htmlFor="fit-assistant" 
                  className="text-sm font-medium cursor-pointer"
                >
                  Teach Fit Assistant
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Fit Assistant learns from this garment to improve your size recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? 'Save Changes' : 'Add Garment'}
        </Button>
      </div>
    </form>
  );
};

export default GarmentForm;
