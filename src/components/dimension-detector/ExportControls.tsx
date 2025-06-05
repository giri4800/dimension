
"use client";

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DimensionData {
  width: number;
  height: number;
  aspectRatio?: string;
  area?: number;
  perimeter?: number;
  diagonal?: number;
  unit: string;
}

interface ExportControlsProps {
  processedImage: string | null;
  dimensions: DimensionData | null;
}

export function ExportControls({ processedImage, dimensions }: ExportControlsProps) {
  const { toast } = useToast();

  const handleExport = () => {
    if (!processedImage || !dimensions) {
      toast({
        title: 'Export Failed',
        description: 'No processed image or dimensions available to export.',
        variant: 'destructive',
      });
      return;
    }
    
    const link = document.createElement('a');
    link.href = processedImage; 
    link.download = `dimension_detective_export_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Image Exported (Simulated)',
      description: 'The image has been saved (simulation). Dimension data is not overlaid on this mock export.',
    });
  };

  return (
    <Button 
      onClick={handleExport} 
      disabled={!processedImage || !dimensions}
      variant="outline"
    >
      <Download className="mr-2 h-4 w-4" />
      Export Image
    </Button>
  );
}
