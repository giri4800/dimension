
"use client";

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { MoveHorizontal, MoveVertical } from 'lucide-react';

interface DimensionDisplayAreaProps {
  imageSrc: string | null;
  dimensions: { width: number; height: number; unit: string } | null;
}

export function DimensionDisplayArea({ imageSrc, dimensions }: DimensionDisplayAreaProps) {
  if (!imageSrc) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg border">
        <p className="text-muted-foreground">Image preview will appear here</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square border rounded-lg overflow-hidden shadow-inner bg-muted/30">
      <Image 
        src={imageSrc} 
        alt="Processed object" 
        fill // Changed from layout="fill" objectFit="contain" to fill for Next 13+
        style={{ objectFit: 'contain' }} // Apply objectFit via style prop
        priority // Good to add for LCP images if this is often visible on load
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes, adjust as needed
        data-ai-hint="measured object"
      />
      {dimensions && (
        <>
          {/* Width Badge - Top Center */}
          <Badge
            variant="outline"
            className="absolute bg-background/80 text-foreground shadow-lg text-sm font-semibold"
            style={{ top: '16px', left: '50%', transform: 'translateX(-50%)', padding: '6px 10px' }}
            aria-label={`Width: ${dimensions.width} ${dimensions.unit}`}
          >
            <MoveHorizontal className="h-4 w-4 mr-2 text-primary" /> W: {dimensions.width} {dimensions.unit}
          </Badge>

          {/* Height Badge - Middle Left */}
          <Badge
            variant="outline"
            className="absolute bg-background/80 text-foreground shadow-lg text-sm font-semibold"
            style={{ left: '16px', top: '50%', transform: 'translateY(-50%)', padding: '6px 10px' }}
            aria-label={`Height: ${dimensions.height} ${dimensions.unit}`}
          >
            <MoveVertical className="h-4 w-4 mr-2 text-primary" /> H: {dimensions.height} {dimensions.unit}
          </Badge>
        </>
      )}
    </div>
  );
}
