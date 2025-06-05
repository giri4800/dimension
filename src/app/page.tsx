"use client";

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUploadTab } from '@/components/dimension-detector/ImageUploadTab';
import { CameraTab } from '@/components/dimension-detector/CameraTab';
import { DimensionDisplayArea } from '@/components/dimension-detector/DimensionDisplayArea';
import { CalibrationControls } from '@/components/dimension-detector/CalibrationControls';
import { ExportControls } from '@/components/dimension-detector/ExportControls';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


type DimensionData = {
  width: number;
  height: number;
  unit: string;
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [calculatedDimensions, setCalculatedDimensions] = useState<DimensionData | null>(null);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [calibrationUnit, setCalibrationUnit] = useState('cm');
  const { toast } = useToast();

  const handleImageSelectedOrCaptured = (imageDataUrl: string) => {
    setSelectedImage(imageDataUrl);
    // Simulate backend processing and dimension calculation
    // For now, this is placeholder logic.
    if (!isCalibrated) {
       toast({
        title: "Calibration Required",
        description: "Please calibrate the system first for accurate measurements.",
        variant: "destructive",
      });
      setCalculatedDimensions(null); // Clear dimensions if not calibrated
      return;
    }

    // Simulate a delay for processing
    setTimeout(() => {
      // Mock dimensions. In a real app, this would come from an API call to the Python backend.
      const mockWidth = parseFloat((Math.random() * 20 + 5).toFixed(1)); // Random width between 5 and 25
      const mockHeight = parseFloat((Math.random() * 30 + 10).toFixed(1)); // Random height between 10 and 40
      
      setCalculatedDimensions({
        width: mockWidth,
        height: mockHeight,
        unit: calibrationUnit,
      });
      toast({
        title: "Dimensions Calculated",
        description: `Width: ${mockWidth} ${calibrationUnit}, Height: ${mockHeight} ${calibrationUnit} (Mock Data)`,
      });
    }, 1500);
  };

  const handleCalibrate = (referenceSize: number, unit: string) => {
    // In a real app, this calibration data would be used by the backend.
    console.log(`Calibrated with reference size: ${referenceSize} ${unit}`);
    setIsCalibrated(true);
    setCalibrationUnit(unit);
    // If an image is already selected, re-process it with new calibration
    if (selectedImage) {
      handleImageSelectedOrCaptured(selectedImage);
    }
  };

  useEffect(() => {
    // Reset dimensions if tab changes and calibration status changes or image is cleared.
    // This is a basic reset, more sophisticated logic might be needed.
    setCalculatedDimensions(null);
    if (activeTab === 'upload') {
        // Potentially clear selectedImage if switching to upload tab from camera with an active capture
        // For now, let's keep it simple. If image is from upload, it persists. If from camera, it might be cleared by camera tab itself.
    }
  }, [activeTab, isCalibrated]);


  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Tabs 
            defaultValue="upload" 
            className="w-full"
            onValueChange={(value) => setActiveTab(value as 'upload' | 'camera')}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Image</TabsTrigger>
              <TabsTrigger value="camera">Live Camera</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <ImageUploadTab onImageSelected={handleImageSelectedOrCaptured} />
            </TabsContent>
            <TabsContent value="camera">
              <CameraTab onFrameCaptured={handleImageSelectedOrCaptured} />
            </TabsContent>
          </Tabs>

          {!isCalibrated && selectedImage && (
             <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Calibration Needed</AlertTitle>
                <AlertDescription>
                  Please calibrate the system using the 'Calibrate' button below to get measurements.
                </AlertDescription>
              </Alert>
          )}

          {selectedImage && (
            <Card className="mt-6 w-full">
              <CardHeader>
                <CardTitle>Object Preview & Dimensions</CardTitle>
                <CardDescription>
                  {calculatedDimensions 
                    ? `Measured dimensions are displayed below. Unit: ${calculatedDimensions.unit}.`
                    : "Awaiting calibration or processing..."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DimensionDisplayArea imageSrc={selectedImage} dimensions={calculatedDimensions} />
                {calculatedDimensions && (
                  <div className="mt-4 text-center p-3 bg-secondary/50 rounded-md">
                    <p className="text-lg font-semibold text-primary">
                      Width: {calculatedDimensions.width} {calculatedDimensions.unit}
                    </p>
                    <p className="text-lg font-semibold text-primary">
                      Height: {calculatedDimensions.height} {calculatedDimensions.unit}
                    </p>
                     <p className="text-xs text-muted-foreground mt-1">(Mock Data)</p>
                  </div>
                )}
              </CardContent>
              <Separator className="my-4" />
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-2">
                <CalibrationControls 
                  onCalibrate={handleCalibrate} 
                  isCalibrated={isCalibrated}
                  setIsCalibrated={setIsCalibrated}
                />
                <ExportControls 
                  processedImage={selectedImage} 
                  dimensions={calculatedDimensions} 
                />
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        <p>&copy; {new Date().getFullYear()} Dimension Detective. All rights reserved.</p>
      </footer>
    </div>
  );
}
