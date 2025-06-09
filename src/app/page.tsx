
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
import { AlertCircle, MoveHorizontal, MoveVertical, Ratio, Square, Lasso, MoveDiagonal2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


type DimensionData = {
  width: number;
  height: number;
  aspectRatio: string;
  area: number;
  perimeter: number;
  diagonal: number;
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
    if (!isCalibrated) {
       toast({
        title: "Calibration Required",
        description: "Please calibrate the system first for accurate measurements.",
        variant: "destructive",
      });
      setCalculatedDimensions(null);
      return;
    }

    // Simulate AI processing delay
    toast({
      title: "Processing Image...",
      description: "Calculating dimensions (mock data).",
    });

    setTimeout(() => {
      const mockWidth = parseFloat((Math.random() * 20 + 5).toFixed(1));
      const mockHeight = parseFloat((Math.random() * 30 + 10).toFixed(1));
      const mockAspectRatio = (mockWidth / mockHeight).toFixed(2);
      const mockArea = parseFloat((mockWidth * mockHeight).toFixed(1));
      const mockPerimeter = parseFloat((2 * (mockWidth + mockHeight)).toFixed(1));
      const mockDiagonal = parseFloat(Math.sqrt(mockWidth**2 + mockHeight**2).toFixed(1));
      
      setCalculatedDimensions({
        width: mockWidth,
        height: mockHeight,
        aspectRatio: mockAspectRatio,
        area: mockArea,
        perimeter: mockPerimeter,
        diagonal: mockDiagonal,
        unit: calibrationUnit,
      });
      toast({
        title: "Dimensions Calculated",
        description: `Object metrics determined (Mock Data). See details below.`,
      });
    }, 1500);
  };

  const handleCalibrate = (referenceSize: number, unit: string) => {
    console.log(`Calibrated with reference size: ${referenceSize} ${unit}`);
    setIsCalibrated(true);
    setCalibrationUnit(unit);
    // If an image is already selected, re-trigger "processing" with new calibration
    if (selectedImage) {
      // Give a slight delay for the calibration toast to be seen before processing toast
      setTimeout(() => handleImageSelectedOrCaptured(selectedImage), 200);
    }
  };

  useEffect(() => {
    // Reset dimensions if tab changes or calibration status changes AFTER an image has been selected.
    // This avoids clearing dimensions if calibration happens before image selection.
    if (selectedImage) {
      setCalculatedDimensions(null);
      // If calibrated and image exists, re-process. Otherwise, prompt for calibration.
      if (isCalibrated) {
        // Check if image selected before attempting to process again.
        // This covers the case where calibration status changes, but image was deselected.
        const currentImage = selectedImage; // Capture current selectedImage
        setTimeout(() => {
          if (currentImage) { // Check if image is still there
            handleImageSelectedOrCaptured(currentImage);
          }
        }, 200);

      } else if (!isCalibrated) { // Ensure this only shows if not calibrated
        toast({
          title: "Calibration Required",
          description: "Please calibrate the system for measurements.",
          variant: "destructive",
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isCalibrated]); // Removed selectedImage from deps to avoid loop on re-processing. Control flow inside handles it.


  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Tabs 
            defaultValue="upload" 
            className="w-full"
            onValueChange={(value) => {
              setActiveTab(value as 'upload' | 'camera');
              setSelectedImage(null); // Clear image when switching tabs
              setCalculatedDimensions(null);
            }}
          >
            <TabsList className="grid w-full">
              <TabsTrigger value="upload">Upload Image</TabsTrigger>
              <TabsTrigger value="camera"></TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <ImageUploadTab onImageSelected={handleImageSelectedOrCaptured} />
            </TabsContent>
            <TabsContent value="camera">
              <CameraTab onFrameCaptured={handleImageSelectedOrCaptured} />
            </TabsContent>
          </Tabs>

          {!isCalibrated && selectedImage && !calculatedDimensions && (
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
                    ? `Measured dimensions are displayed below. Current unit: ${calibrationUnit}.`
                    : isCalibrated ? "Processing..." : "Awaiting calibration..."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DimensionDisplayArea imageSrc={selectedImage} dimensions={calculatedDimensions} />
                {calculatedDimensions && (
                  <div className="mt-6 p-4 border rounded-lg bg-card shadow">
                    <h3 className="text-lg font-semibold mb-4 text-center text-primary">Calculated Metrics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                      
                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground flex items-center">
                          <MoveHorizontal className="w-5 h-5 mr-2 text-accent" />
                          Width:
                        </span>
                        <span className="font-semibold text-lg text-foreground">
                          {calculatedDimensions.width} {calculatedDimensions.unit}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground flex items-center">
                          <MoveVertical className="w-5 h-5 mr-2 text-accent" />
                          Height:
                        </span>
                        <span className="font-semibold text-lg text-foreground">
                          {calculatedDimensions.height} {calculatedDimensions.unit}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground flex items-center">
                          <Ratio className="w-5 h-5 mr-2 text-accent" />
                          Aspect Ratio:
                        </span>
                        <span className="font-semibold text-lg text-foreground">
                          {calculatedDimensions.aspectRatio}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground flex items-center">
                          <Square className="w-5 h-5 mr-2 text-accent" />
                          Area:
                        </span>
                        <span className="font-semibold text-lg text-foreground">
                          {calculatedDimensions.area} {calculatedDimensions.unit}²
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground flex items-center">
                          <Lasso className="w-5 h-5 mr-2 text-accent" />
                          Perimeter:
                        </span>
                        <span className="font-semibold text-lg text-foreground">
                          {calculatedDimensions.perimeter} {calculatedDimensions.unit}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground flex items-center">
                          <MoveDiagonal2 className="w-5 h-5 mr-2 text-accent" />
                          Diagonal:
                        </span>
                        <span className="font-semibold text-lg text-foreground">
                          {calculatedDimensions.diagonal} {calculatedDimensions.unit}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground/80 mt-4 text-center italic">All measurements are illustrative (Mock Data).</p>
                  </div>
                )}
              </CardContent>
              <Separator className="my-4" />
              <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-2">
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
