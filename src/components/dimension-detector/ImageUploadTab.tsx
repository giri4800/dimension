"use client";

import { useState, type ChangeEvent } from 'react';
import { UploadCloud, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface ImageUploadTabProps {
  onImageSelected: (imageDataUrl: string) => void;
}

export function ImageUploadTab({ onImageSelected }: ImageUploadTabProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreview(null);
    }
  };

  const handleSubmit = () => {
    if (preview) {
      onImageSelected(preview);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Image</CardTitle>
        <CardDescription>Select an image file to detect its dimensions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <UploadCloud className="text-muted-foreground" />
          <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} className="flex-grow"/>
        </div>
        {preview && (
          <div className="mt-4 border rounded-md p-2 flex justify-center bg-muted/30">
            <Image 
              src={preview} 
              alt="Image preview" 
              width={300} 
              height={300} 
              className="rounded-md object-contain max-h-[300px]" 
              data-ai-hint="uploaded image"
            />
          </div>
        )}
        <Button onClick={handleSubmit} disabled={!preview} className="w-full">
          Process Image
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
