
import React, { useState, useEffect } from 'react';
import { useUnit } from '@/contexts/UnitContext';
import FitSlider from './FitSlider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Camera, Upload, ChevronDown, ChevronUp, PlusCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CancelConfirmationDialog from './CancelConfirmationDialog';
import GarmentFormStepProgress from './GarmentFormStepProgress';

interface GarmentFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isEdit?: boolean;
  onCancel?: () => void;
}

const brandOptions = ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E', 'Brand F'];
const fitOptions = ['Very Loose', 'Loose', 'Just Right', 'Snug', 'Very Tight'];
const garmentTypes = ['T-Shirt', 'Trousers', 'Dress', 'Shoes', 'Shirt', 'Jeans', 'Skirt', 'Jacket', 'Sweater', 'Other'];

const GarmentForm: React.FC<GarmentFormProps> = ({ 
  onSubmit, 
  initialData = {
    name: '',
    brand: '',
    type: '',
    size: '',
    color: '',
    measurements: {
      chest: undefined,
      waist: undefined,
      hip: undefined,
      shoulders: undefined,
      sleeves: undefined,
      length: undefined,
      width: undefined,
      comfort: undefined
    },
    fitPerception: {
      chest: 'Just Right',
      waist: 'Just Right',
      hip: 'Just Right',
      shoulders: 'Just Right',
      sleeves: 'Just Right',
      length: 'Just Right',
      width: 'Just Right',
      comfort: 'Just Right'
    },
    teachFitAssistant: false,
    image: ''
  }, 
  isEdit = false,
  onCancel
}) => {
  const [formData, setFormData] = useState(initialData);
  const [imagePreview, setImagePreview] = useState(initialData.image || '');
  const { unitSystem, toggleUnitSystem } = useUnit();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // For each garment type, determine which measurement fields to show
  const getMeasurementFieldsByType = (type: string) => {
    switch (type.toLowerCase()) {
      case 't-shirt':
        return ['chest', 'shoulders', 'sleeves'];
      case 'trousers':
      case 'pants':
      case 'jeans':
        return ['waist', 'hip', 'length'];
      case 'dress':
        return ['chest', 'waist', 'hip', 'length'];
      case 'shoes':
        return ['length', 'width'];
      default:
        // Default fields if type doesn't match
        return ['chest', 'waist', 'hip'];
    }
  };
  
  // Get the fit fields based on the current garment type
  const [relevantMeasurementFields, setRelevantMeasurementFields] = useState<string[]>(
    getMeasurementFieldsByType(formData.type || '')
  );

  useEffect(() => {
    // Update relevant measurement fields when garment type changes
    if (formData.type) {
      setRelevantMeasurementFields(getMeasurementFieldsByType(formData.type));
    }
  }, [formData.type]);

  useEffect(() => {
    setHasChanges(
      formData.name !== initialData.name ||
      formData.brand !== initialData.brand ||
      formData.type !== initialData.type ||
      formData.size !== initialData.size ||
      formData.color !== initialData.color ||
      formData.image !== initialData.image ||
      JSON.stringify(formData.measurements) !== JSON.stringify(initialData.measurements) ||
      JSON.stringify(formData.fitPerception) !== JSON.stringify(initialData.fitPerception) ||
      formData.teachFitAssistant !== initialData.teachFitAssistant
    );
  }, [formData, initialData]);

  const handleFitPerceptionChange = (part: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      fitPerception: {
        ...prev.fitPerception,
        [part]: value
      }
    }));
  };

  const handleMeasurementChange = (part: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [part]: value
      }
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If changing garment type, update relevant measurement fields
    if (name === 'type') {
      setRelevantMeasurementFields(getMeasurementFieldsByType(value));
    }
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
  
  const handleNextStep = () => {
    // Validate fields based on current step
    if (currentStep === 1) {
      if (!formData.name || !formData.brand || !formData.size || !formData.color) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };
  
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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

  const handleCancelClick = () => {
    if (hasChanges) {
      setShowCancelDialog(true);
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelDialog(false);
    if (onCancel) {
      onCancel();
    }
  };

  // Format measurement field name for display
  const formatFieldName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
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
                <Label htmlFor="type">Garment Type*</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger id="type" className="input-field">
                    <SelectValue placeholder="Select garment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {garmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brand">Brand*</Label>
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
                <Label htmlFor="name">Name*</Label>
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
                  <Label htmlFor="size">Size*</Label>
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
                  <Label htmlFor="color">Color*</Label>
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
        );
      
      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-end">
              <div className="flex items-center space-x-2">
                <Label htmlFor="unit-toggle-form" className="text-sm text-brand-muted">
                  {unitSystem === 'metric' ? 'Metric' : 'Imperial'}
                </Label>
                <Switch
                  id="unit-toggle-form"
                  checked={unitSystem === 'imperial'}
                  onCheckedChange={toggleUnitSystem}
                />
              </div>
            </div>
          
            <div className="space-y-5 p-4 border border-gray-100 rounded-lg bg-gray-50">
              <h3 className="font-medium mb-4">Measurements</h3>
              {relevantMeasurementFields.map(field => (
                <FitSlider
                  key={field}
                  label={formatFieldName(field)}
                  value={formData.measurements[field as keyof typeof formData.measurements] || 90}
                  onChange={(value) => handleMeasurementChange(field, value)}
                  min={60}
                  max={140}
                  measurementType="measurement"
                />
              ))}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-5 p-4 border border-gray-100 rounded-lg bg-gray-50">
              <h3 className="font-medium mb-4">How does it fit?</h3>
              
              {relevantMeasurementFields.map(field => {
                // Only show fit perception if we have a measurement for this field
                if (formData.measurements[field as keyof typeof formData.measurements] !== undefined) {
                  return (
                    <FitSlider
                      key={`fit-${field}`}
                      label={`${formatFieldName(field)} Fit`}
                      value={formData.measurements[field as keyof typeof formData.measurements] || 90}
                      onChange={(value) => handleMeasurementChange(field, value)}
                      min={60}
                      max={140}
                      measurementType="measurement"
                      isFitPerception={true}
                      fitValue={formData.fitPerception[field as keyof typeof formData.fitPerception] || 'Just Right'}
                      onFitChange={(value) => handleFitPerceptionChange(field, value)}
                      showExplainer={field === relevantMeasurementFields[0]} // Only show explainer on the first item
                    />
                  );
                }
                return null;
              })}
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
                    Turn this on to teach Fit Assistant what fits you best. You'll get smarter size guidance from your wardrobe and the store.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <GarmentFormStepProgress currentStep={currentStep} />
      
      {renderStepContent()}
      
      <div className="flex justify-between pt-4">
        {currentStep > 1 ? (
          <Button 
            type="button" 
            variant="outline" 
            onClick={handlePrevStep}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        ) : (
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
        )}
        
        {currentStep < 3 ? (
          <Button 
            type="button" 
            onClick={handleNextStep}
            className="flex items-center gap-2"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button type="submit">
            {isEdit ? 'Save Changes' : 'Add Garment'}
          </Button>
        )}
      </div>

      <CancelConfirmationDialog 
        isOpen={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onConfirm={handleConfirmCancel}
      />
    </form>
  );
};

export default GarmentForm;
