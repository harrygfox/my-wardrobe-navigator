
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Ruler } from 'lucide-react';
import MeasurementPanel from './MeasurementPanel';

const MeasurementCard: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Card 
        className="glass-panel p-4 cursor-pointer hover:shadow-elevated transition-all duration-300 animate-fade-in"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex flex-col items-center space-y-4 py-4">
          <img 
            src="/lovable-uploads/1abc69ff-bebf-46dc-8bf4-aff0d2654e90.png" 
            alt="Dress maker's dummy" 
            className="h-40 mx-auto"
          />
          <div className="text-center">
            <h3 className="font-heading text-xl flex items-center justify-center gap-2">
              <Ruler className="w-5 h-5" />
              My Measurements
            </h3>
            <p className="text-sm text-brand-muted mt-1">Click to view and edit</p>
          </div>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">My Measurements</DialogTitle>
          </DialogHeader>
          <MeasurementPanel />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MeasurementCard;
