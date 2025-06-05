"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface DimensionDisplayAreaProps {
  imageSrc: string | null;
  dimensions: { width: number; height: number; unit: string } | null;
}

export function DimensionDisplayArea({ imageSrc, dimensions }: DimensionDisplayAreaProps) {
  if (!imageSrc) {
    return (
      <Card className="flex items-center justify-center h-64 bg-muted">
        <p className="text-muted-foreground">Image will appear here</p>
      </Card>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square border rounded-lg overflow-hidden shadow-inner bg-muted/30">
      <Image 
        src={imageSrc} 
        alt="Processed object" 
        layout="fill" 
        objectFit="contain" 
        data-ai-hint="measured object"
      />
      {dimensions && (
        <>
          {/* Mock dimension overlay. In a real app, this would be more precise. */}
          <div 
            className="absolute text-accent-foreground bg-accent/80 px-2 py-1 rounded text-xs shadow-lg"
            style={{ top: '45%', left: '50%', transform: 'translateX(-50%) translateY(-100px)' }}
            aria-label={`Height: ${dimensions.height} ${dimensions.unit}`}
          >
            H: {dimensions.height}{dimensions.unit}
          </div>
          <div 
            className="absolute text-accent-foreground bg-accent/80 px-2 py-1 rounded text-xs shadow-lg"
            style={{ top: '50%', left: '45%', transform: 'translateY(-50%) translateX(-100px)' }}
            aria-label={`Width: ${dimensions.width} ${dimensions.unit}`}
          >
            W: {dimensions.width}{dimensions.unit}
          </div>

          {/* Example of drawing lines (simplified) */}
           <div 
            className="absolute border-accent border-dashed border-r-2"
            style={{ height: '30%', width: '1px', top: '35%', left: 'calc(50% - 50px)' }}
           />
           <div 
            className="absolute border-accent border-dashed border-t-2"
            style={{ width: '30%', height: '1px', top: 'calc(50% + 50px)', left: '35%' }}
           />
        </>
      )}
    </div>
  );
}
