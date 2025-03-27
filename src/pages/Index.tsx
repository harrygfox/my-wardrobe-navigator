
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MeasurementPanel from '@/components/MeasurementPanel';
import GarmentCard, { Garment } from '@/components/GarmentCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import GarmentForm from '@/components/GarmentForm';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';
import { UnitProvider } from '@/contexts/UnitContext';

// Mock data for initial garments
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
  const [garments, setGarments] = useState<Garment[]>(initialGarments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteGarmentId, setDeleteGarmentId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleToggleFitAssistant = (id: string, value: boolean) => {
    setGarments(prev =>
      prev.map(garment =>
        garment.id === id
          ? { ...garment, teachFitAssistant: value }
          : garment
      )
    );

    toast({
      title: `Fit Assistant ${value ? 'Enabled' : 'Disabled'}`,
      description: `This garment will ${value ? 'now' : 'no longer'} influence size recommendations.`,
    });
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
    
    toast({
      title: "Garment Added",
      description: "Your new garment has been added to your closet.",
    });
  };

  return (
    <UnitProvider>
      <div className="min-h-screen bg-brand-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-screen-lg mx-auto">
            <section className="mb-12 animate-fade-in">
              <h1 className="font-heading text-4xl md:text-5xl mb-2">My Closet</h1>
              <p className="text-brand-muted max-w-2xl">
                Track your garments, record measurements, and improve your size recommendations with Fit Assistant.
              </p>
            </section>
            
            <section className="mb-12">
              <MeasurementPanel />
            </section>
            
            <section className="mb-20">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-heading text-2xl md:text-3xl">Garments</h2>
                <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Garment</span>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {garments.map((garment) => (
                  <GarmentCard
                    key={garment.id}
                    garment={garment}
                    onToggleFitAssistant={handleToggleFitAssistant}
                    onDelete={handleDeleteGarment}
                  />
                ))}
                
                {garments.length === 0 && (
                  <div className="col-span-full py-16 text-center">
                    <p className="text-brand-muted mb-4">Your closet is empty</p>
                    <Button 
                      onClick={() => setIsAddDialogOpen(true)} 
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
          </div>
        </main>
        
        {/* Add Garment Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="font-heading text-2xl">Add New Garment</DialogTitle>
            </DialogHeader>
            <GarmentForm onSubmit={handleAddGarment} />
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteGarmentId} onOpenChange={(open) => !open && setDeleteGarmentId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this garment from your closet? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </UnitProvider>
  );
};

export default Index;
