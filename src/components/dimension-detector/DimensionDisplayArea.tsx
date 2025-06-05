
"use client";

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { MoveHorizontal, MoveVertical } from 'lucide-react';

interface DimensionDisplayAreaProps {
  imageSrc: string | null;
  dimensions: { width: number; height: number; unit: string; [key: string]: any } | null; // Allow other dimension fields
}

export function DimensionDisplayArea({ imageSrc, dimensions }: DimensionDisplayAreaProps) {
  if (!imageSrc) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg border shadow-inner">
        <p className="text-muted-foreground">Image preview will appear here</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-video border rounded-lg overflow-hidden shadow-inner bg-muted/20">
      <Image 
        src={imageSrc} 
        alt="Object for dimension measurement" 
        fill
        style={{ objectFit: 'contain' }}
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 440px" 
        data-ai-hint="measured object"
      />
      {dimensions && (
        <>
          <Badge
            variant="outline"
            className="absolute bg-background/80 text-foreground shadow-lg text-xs sm:text-sm font-semibold"
            style={{ top: '10px', left: '50%', transform: 'translateX(-50%)', padding: '4px 8px' }}
            aria-label={`Width: ${dimensions.width} ${dimensions.unit}`}
          >
            <MoveHorizontal className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-primary" /> W: {dimensions.width} {dimensions.unit}
          </Badge>

          <Badge
            variant="outline"
            className="absolute bg-background/80 text-foreground shadow-lg text-xs sm:text-sm font-semibold"
            style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', padding: '4px 8px' }}
            aria-label={`Height: ${dimensions.height} ${dimensions.unit}`}
          >
            <MoveVertical className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-primary" /> H: {dimensions.height} {dimensions.unit}
          </Badge>
        </>
      )}
    </div>
  );
}
