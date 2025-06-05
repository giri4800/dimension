"use client";

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ExportControlsProps {
  processedImage: string | null;
  dimensions: { width: number; height: number; unit: string } | null;
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

    // Simulate export. In a real app, this would involve:
    // 1. Creating a canvas.
    // 2. Drawing the image on the canvas.
    // 3. Drawing the dimensions (lines, text) on the canvas.
    // 4. Converting canvas to data URL (e.g., canvas.toDataURL('image/png')).
    // 5. Creating a link element and triggering a download.
    
    const link = document.createElement('a');
    link.href = processedImage; // For now, just download the original processed image
    link.download = `dimension_detective_export_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Image Exported (Simulated)',
      description: 'The image with dimensions has been saved (simulation).',
    });
  };

  return (
    <Button onClick={handleExport} disabled={!processedImage || !dimensions}>
      <Download className="mr-2 h-4 w-4" />
      Export Image
    </Button>
  );
}
