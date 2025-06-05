"use client";

import { useState } from 'react';
import { Cog, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface CalibrationControlsProps {
  onCalibrate: (referenceSize: number, unit: string) => void;
  isCalibrated: boolean;
  setIsCalibrated: (isCalibrated: boolean) => void;
}

export function CalibrationControls({ onCalibrate, isCalibrated, setIsCalibrated }: CalibrationControlsProps) {
  const [refSize, setRefSize] = useState('');
  const [unit, setUnit] = useState('cm');
  const { toast } = useToast();

  const handleCalibrate = () => {
    const size = parseFloat(refSize);
    if (isNaN(size) || size <= 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter a valid positive number for reference size.',
        variant: 'destructive',
      });
      return;
    }
    onCalibrate(size, unit);
    setIsCalibrated(true);
    toast({
      title: 'Calibration Updated',
      description: `System calibrated with reference size: ${size} ${unit}.`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={isCalibrated ? "secondary" : "outline"}>
          {isCalibrated ? <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> : <Cog className="mr-2 h-4 w-4" />}
          {isCalibrated ? 'Re-Calibrate' : 'Calibrate'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Camera Calibration</DialogTitle>
          <DialogDescription>
            Place a reference object of known size (e.g., a ruler, coin) in the view.
            Enter its dimension to calibrate the measurement system.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reference-size" className="text-right col-span-1">
              Size
            </Label>
            <Input
              id="reference-size"
              type="number"
              value={refSize}
              onChange={(e) => setRefSize(e.target.value)}
              placeholder="e.g., 5"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit" className="text-right col-span-1">
              Unit
            </Label>
            <select 
              id="unit" 
              value={unit} 
              onChange={(e) => setUnit(e.target.value)} 
              className="col-span-3 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="cm">cm</option>
              <option value="mm">mm</option>
              <option value="in">inches</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" onClick={handleCalibrate}>Calibrate</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
