import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import MeasurementCard from '@/components/MeasurementCard';
import GarmentList from '@/components/GarmentList';
import { Garment } from '@/components/GarmentCard';
import DeleteGarmentDialog from '@/components/DeleteGarmentDialog';
import AddGarmentDialog from '@/components/AddGarmentDialog';
import EmptyStateCloset from '@/components/EmptyStateCloset';
import { useToast } from '@/hooks/use-toast';

const initialGarments: Garment[] = [
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

const Index: React.FC = () => {
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [garments, setGarments] = useState<Garment[]>(initialGarments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteGarmentId, setDeleteGarmentId] = useState<string | null>(null);
  const { toast } = useToast();

  const fitAssistantCount = useMemo(() => {
    return garments.filter(g => g.teachFitAssistant).length;
  }, [garments]);

  const handleToggleFitAssistant = (id: string, value: boolean) => {
    setGarments(prev =>
      prev.map(garment =>
        garment.id === id
          ? { ...garment, teachFitAssistant: value }
          : garment
      )
    );

    if (value) {
      toast({
        title: "✅ Garment added to Fit Assistant. Your future size recommendations just got smarter."
      });
    } else {
      toast({
        title: "Fit Assistant Disabled",
        description: "This garment will no longer influence your size recommendations."
      });
    }
  };

  const handleDeleteGarment = (id: string) => {
    setDeleteGarmentId(id);
  };

  const confirmDelete = () => {
    if (deleteGarmentId) {
      setGarments(prev => prev.filter(garment => garment.id !== deleteGarmentId));
      toast({
        title: "Garment Deleted",
        description: "The garment has been removed from your closet.",
      });
      setDeleteGarmentId(null);
      
      if (garments.length === 1) {
        setShowEmptyState(true);
      }
    }
  };

  const handleAddGarment = (data: any) => {
    const newGarment: Garment = {
      id: Date.now().toString(),
      name: data.name,
      brand: data.brand === 'custom' ? data.customBrand : data.brand,
      size: data.size,
      color: data.color,
      image: data.image,
      teachFitAssistant: data.teachFitAssistant,
      measurements: {
        chest: data.measurements.chest,
        waist: data.measurements.waist,
        hip: data.measurements.hip
      }
    };

    setGarments(prev => [newGarment, ...prev]);
    setIsAddDialogOpen(false);
    setShowEmptyState(false);
    
    toast({
      title: "Garment Added",
      description: "Your new garment has been added to your closet.",
    });
  };

  return (
    <div className="min-h-screen bg-brand-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <section className="lg:col-span-2 animate-fade-in">
              <h1 className="font-heading text-4xl md:text-5xl mb-2">My Closet</h1>
              <p className="text-brand-muted max-w-2xl">
                Track your garments, record measurements, and improve your size recommendations with Fit Assistant.
              </p>
            </section>
            
            <section className="lg:col-span-1">
              <div className="max-w-xs mx-auto lg:mx-0">
                <MeasurementCard />
              </div>
            </section>
          </div>
          
          {showEmptyState || garments.length === 0 ? (
            <EmptyStateCloset 
              onAddGarment={() => setIsAddDialogOpen(true)} 
              fitAssistantCount={fitAssistantCount}
            />
          ) : (
            <GarmentList 
              garments={garments}
              onToggleFitAssistant={handleToggleFitAssistant}
              onDeleteGarment={handleDeleteGarment}
              onAddGarmentClick={() => setIsAddDialogOpen(true)}
            />
          )}
          
          <div className="mt-8 text-center">
            <button 
              onClick={() => setShowEmptyState(!showEmptyState)}
              className="text-sm text-gray-500 underline"
            >
              Toggle Empty State Demo
            </button>
          </div>
        </div>
      </main>
      
      <AddGarmentDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddGarment}
      />
      
      <DeleteGarmentDialog 
        isOpen={!!deleteGarmentId}
        onOpenChange={(open) => !open && setDeleteGarmentId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Index;
