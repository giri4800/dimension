
"use client";

import { useState, type ChangeEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadTabProps {
  onImageSelected: (imageDataUrl: string) => void;
}

export function ImageUploadTab({ onImageSelected }: ImageUploadTabProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image file smaller than 5MB.",
          variant: "destructive",
        });
        event.target.value = ''; // Reset file input
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageSelected(result); // Call onImageSelected immediately
      };
      reader.onerror = () => {
        toast({
          title: "File Read Error",
          description: "Could not read the selected file.",
          variant: "destructive",
        });
        setPreview(null);
      }
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      // Optionally, if you want to clear the main page's selected image if the user deselects a file:
      // onImageSelected(""); // Pass empty string or null to indicate no image
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Image</CardTitle>
        <CardDescription>Select an image file (max 5MB) to detect its dimensions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg hover:border-primary transition-colors">
          <UploadCloud className="text-muted-foreground h-8 w-8" />
          <label htmlFor="image-upload" className="flex-grow cursor-pointer text-muted-foreground">
            {preview ? "Change image..." : "Click to upload or drag and drop"}
            <Input 
              id="image-upload" 
              type="file" 
              accept="image/png, image/jpeg, image/webp, image/gif" 
              onChange={handleFileChange} 
              className="sr-only" // Visually hide the default input, style the label
            />
          </label>
        </div>
        {preview && (
          <div className="mt-4 border rounded-md p-2 flex justify-center bg-muted/30 max-h-[350px] overflow-hidden">
            <Image 
              src={preview} 
              alt="Image preview" 
              width={300} 
              height={300} 
              className="rounded-md object-contain" 
              style={{ maxHeight: '330px', width: 'auto' }}
              data-ai-hint="uploaded image"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
