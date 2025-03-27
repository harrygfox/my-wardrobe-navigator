import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import FitSlider from '@/components/FitSlider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Camera, Copy, Edit, Save } from 'lucide-react';
import { Garment } from '@/components/GarmentCard';
import { useUnit } from '@/contexts/UnitContext';

const mockGarments: Garment[] = [
  {
    id: '1',
    name: 'Relaxed Fit T-Shirt',
    brand: 'Brand A',
    size: 'M',
    color: 'Navy Blue',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3',
    teachFitAssistant: true,
    measurements: {
      chest: 98,
      waist: 88,
      hip: 98
    }
  },
  {
    id: '2',
    name: 'Slim Fit Jeans',
    brand: 'Brand B',
    size: '32',
    color: 'Dark Blue',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=2826&auto=format&fit=crop&ixlib=rb-4.0.3',
    teachFitAssistant: false,
    measurements: {
      waist: 82,
      hip: 96
    }
  },
  {
    id: '3',
    name: 'Casual Shirt',
    brand: 'Brand C',
    size: 'L',
    color: 'White',
    image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    teachFitAssistant: true,
    measurements: {
      chest: 104,
      waist: 94
    }
  },
  {
    id: '4',
    name: 'Summer Dress',
    brand: 'Brand D',
    size: 'S',
    color: 'Floral',
    image: 'https://images.unsplash.com/photo-1612722432474-b971cdcea546?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    teachFitAssistant: false,
    measurements: {
      chest: 86,
      waist: 68,
      hip: 94
    }
  }
];

const fitOptions = ['Very Loose', 'Loose', 'Just Right', 'Snug', 'Very Tight'];

const GarmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [garment, setGarment] = useState<Garment | null>(null);
  const [fitPerception, setFitPerception] = useState({
    chest: 'Just Right',
    waist: 'Just Right',
    hip: 'Just Right'
  });
  const [userImage, setUserImage] = useState<string | null>(null);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const { unitSystem, toggleUnitSystem } = useUnit();

  useEffect(() => {
    const foundGarment = mockGarments.find(g => g.id === id);
    if (foundGarment) {
      setGarment(foundGarment);
    } else {
      navigate('/');
    }
    
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('edit') === 'true') {
      setIsEditing(true);
    }
  }, [id, navigate, location]);

  if (!garment) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const currentIndex = mockGarments.findIndex(g => g.id === id);
  const prevGarment = currentIndex > 0 ? mockGarments[currentIndex - 1] : null;
  const nextGarment = currentIndex < mockGarments.length - 1 ? mockGarments[currentIndex + 1] : null;

  const handleMeasurementChange = (part: 'chest' | 'waist' | 'hip', value: number) => {
    if (garment) {
      setGarment({
        ...garment,
        measurements: {
          ...garment.measurements,
          [part]: value
        }
      });
    }
  };

  const handleFitPerceptionChange = (part: 'chest' | 'waist' | 'hip', value: string) => {
    setFitPerception(prev => ({
      ...prev,
      [part]: value
    }));
  };

  const handleUserImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleFitAssistant = (checked: boolean) => {
    if (garment && isEditing) {
      setGarment({
        ...garment,
        teachFitAssistant: checked
      });
    }
  };

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Your garment details have been updated.",
    });
    setIsEditing(false);
    navigate(`/garment/${id}`, { replace: true });
  };

  const handleDuplicate = () => {
    toast({
      title: "Garment Duplicated",
      description: "A copy has been added to your closet.",
    });
  };

  const toggleEditMode = () => {
    const newEditingState = !isEditing;
    setIsEditing(newEditingState);
    
    if (newEditingState) {
      navigate(`/garment/${id}?edit=true`, { replace: true });
      toast({
        title: "Edit Mode",
        description: "You can now edit the garment details.",
      });
    } else {
      navigate(`/garment/${id}`, { replace: true });
    }
  };

  const renderReadOnlyMeasurement = (label: string, value: number | undefined) => {
    if (value === undefined) return null;
    
    return (
      <div className="flex justify-between items-center py-3 border-b border-gray-100">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-semibold px-3 py-1 bg-gray-50 rounded-md">
          {value} cm
        </span>
      </div>
    );
  };

  const renderReadOnlyFitPerception = (label: string, value: string) => {
    return (
      <div className="flex justify-between items-center py-3 border-b border-gray-100">
        <span className="text-sm font-medium">{label} Fit</span>
        <span className="text-sm font-semibold px-3 py-1 bg-gray-50 rounded-md">
          {value}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div className="flex items-center">
              <Link to="/" className="text-brand-muted hover:text-brand-primary transition-colors mr-4">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="font-heading text-3xl">{garment.name}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="unit-toggle-detail" className="text-sm text-brand-muted">
                  {unitSystem === 'metric' ? 'Metric' : 'Imperial'}
                </Label>
                <Switch
                  id="unit-toggle-detail"
                  checked={unitSystem === 'imperial'}
                  onCheckedChange={toggleUnitSystem}
                />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleEditMode}
                className="flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                <span>{isEditing ? "Cancel Edit" : "Edit"}</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-6 animate-fade-in">
              <div 
                className="aspect-[3/4] rounded-xl overflow-hidden bg-white shadow-card cursor-pointer"
                onClick={() => document.getElementById('garment-image-upload')?.click()}
              >
                {garment.image ? (
                  <img
                    src={garment.image}
                    alt={garment.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100">
                    <Camera className="h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-500">Click to add image</p>
                  </div>
                )}
                <input
                  id="garment-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleUserImageChange}
                  className="hidden"
                />
              </div>
              
              <div className="glass-panel p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{garment.name}</h3>
                  <p className="text-brand-muted">{garment.brand}</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <Label className="text-xs text-brand-muted">Size</Label>
                    <p>{garment.size}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-brand-muted">Color</Label>
                    <p>{garment.color}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 pt-2">
                  <Switch
                    id="fit-assistant-detail"
                    checked={garment.teachFitAssistant}
                    onCheckedChange={handleToggleFitAssistant}
                    disabled={!isEditing}
                  />
                  <div>
                    <Label 
                      htmlFor="fit-assistant-detail" 
                      className="text-sm font-medium cursor-pointer"
                    >
                      Teach Fit Assistant
                    </Label>
                    <p className="text-xs text-brand-muted mt-1">
                      Fit Assistant learns from this garment to improve your size recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-6 animate-fade-in animation-delay-100">
              <div className="glass-panel p-6">
                <h2 className="font-heading text-xl mb-6">Measurements</h2>
                <div className="space-y-5">
                  {isEditing ? (
                    <>
                      {garment.measurements.chest !== undefined && (
                        <FitSlider
                          label="Chest"
                          value={garment.measurements.chest}
                          onChange={(value) => handleMeasurementChange('chest', value)}
                          min={60}
                          max={140}
                          measurementType="measurement"
                        />
                      )}
                      {garment.measurements.waist !== undefined && (
                        <FitSlider
                          label="Waist"
                          value={garment.measurements.waist}
                          onChange={(value) => handleMeasurementChange('waist', value)}
                          min={50}
                          max={140}
                          measurementType="measurement"
                        />
                      )}
                      {garment.measurements.hip !== undefined && (
                        <FitSlider
                          label="Hip"
                          value={garment.measurements.hip}
                          onChange={(value) => handleMeasurementChange('hip', value)}
                          min={60}
                          max={150}
                          measurementType="measurement"
                        />
                      )}
                    </>
                  ) : (
                    <>
                      {renderReadOnlyMeasurement("Chest", garment.measurements.chest)}
                      {renderReadOnlyMeasurement("Waist", garment.measurements.waist)}
                      {renderReadOnlyMeasurement("Hip", garment.measurements.hip)}
                    </>
                  )}
                </div>
              </div>
              
              <div className="glass-panel p-6">
                <h2 className="font-heading text-xl mb-6">Fit Perception</h2>
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      {garment.measurements.chest !== undefined && (
                        <div className="space-y-2">
                          <Label htmlFor="chest-fit" className="text-sm">Chest Fit</Label>
                          <Select
                            value={fitPerception.chest}
                            onValueChange={(value) => handleFitPerceptionChange('chest', value)}
                          >
                            <SelectTrigger id="chest-fit" className="input-field">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fitOptions.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      {garment.measurements.waist !== undefined && (
                        <div className="space-y-2">
                          <Label htmlFor="waist-fit" className="text-sm">Waist Fit</Label>
                          <Select
                            value={fitPerception.waist}
                            onValueChange={(value) => handleFitPerceptionChange('waist', value)}
                          >
                            <SelectTrigger id="waist-fit" className="input-field">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fitOptions.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      {garment.measurements.hip !== undefined && (
                        <div className="space-y-2">
                          <Label htmlFor="hip-fit" className="text-sm">Hip Fit</Label>
                          <Select
                            value={fitPerception.hip}
                            onValueChange={(value) => handleFitPerceptionChange('hip', value)}
                          >
                            <SelectTrigger id="hip-fit" className="input-field">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fitOptions.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {garment.measurements.chest !== undefined && 
                        renderReadOnlyFitPerception("Chest", fitPerception.chest)}
                      
                      {garment.measurements.waist !== undefined && 
                        renderReadOnlyFitPerception("Waist", fitPerception.waist)}
                      
                      {garment.measurements.hip !== undefined && 
                        renderReadOnlyFitPerception("Hip", fitPerception.hip)}
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1 space-y-6 animate-fade-in animation-delay-200">
              <div className="glass-panel p-6">
                <h2 className="font-heading text-lg mb-4">How It Looks On Me</h2>
                <div className="flex flex-col items-center space-y-4">
                  {userImage ? (
                    <div className="relative w-full">
                      <img 
                        src={userImage} 
                        alt="How it looks on me" 
                        className="w-full h-auto rounded-lg" 
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm"
                        onClick={() => document.getElementById('user-image-upload')?.click()}
                      >
                        <Camera className="h-4 w-4 mr-1" />
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="w-full aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => document.getElementById('user-image-upload')?.click()}
                    >
                      <Camera className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Add Photo</p>
                    </div>
                  )}
                  <input
                    id="user-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleUserImageChange}
                    className="hidden"
                  />
                </div>
              </div>
              
              <div className="glass-panel p-6">
                <h2 className="font-heading text-lg mb-4">Would Look Good With</h2>
                <div className="space-y-3">
                  {mockGarments
                    .filter(g => g.id !== garment.id)
                    .slice(0, 2)
                    .map((g) => (
                      <Link key={g.id} to={`/garment/${g.id}`} className="block">
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/40 transition-colors">
                          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                            <img src={g.image} alt={g.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{g.name}</p>
                            <p className="text-xs text-brand-muted">{g.brand}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-between items-center border-t border-gray-200 pt-6 mt-8">
            <div className="flex gap-4 mb-4 md:mb-0">
              <Button 
                variant="outline" 
                onClick={handleDuplicate} 
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>Duplicate</span>
              </Button>
              {isEditing && (
                <Button 
                  onClick={handleSaveChanges} 
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </Button>
              )}
            </div>
            
            <div className="flex gap-4">
              {prevGarment && (
                <Link to={`/garment/${prevGarment.id}`}>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                </Link>
              )}
              
              {nextGarment && (
                <Link to={`/garment/${nextGarment.id}`}>
                  <Button variant="outline" className="flex items-center gap-2">
                    <span className="hidden sm:inline">Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GarmentDetail;
