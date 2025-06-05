"use client";

import { useState, useRef, useEffect } from 'react';
import { Camera, Video, VideoOff, Send, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface CameraTabProps {
  onFrameCaptured: (imageDataUrl: string) => void;
}

export function CameraTab({ onFrameCaptured }: CameraTabProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    setError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        setIsCameraActive(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check permissions.");
        toast({
          title: "Camera Error",
          description: "Could not access camera. Please ensure permissions are granted and no other app is using it.",
          variant: "destructive",
        });
        setIsCameraActive(false);
      }
    } else {
      setError("Camera access not supported by this browser.");
      toast({
        title: "Unsupported Feature",
        description: "Camera access is not supported by your browser.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsCameraActive(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (isCameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    return () => { // Cleanup on component unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive, stream]);

  const handleCaptureFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');
        onFrameCaptured(imageDataUrl);
        stopCamera(); // Optionally stop camera after capture
      } else {
        toast({ title: "Capture Error", description: "Could not capture frame.", variant: "destructive" });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle></CardTitle>
        <CardDescription>Use your device camera to capture an object for dimension detection.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-destructive/20 text-destructive border border-destructive rounded-md flex items-center gap-2">
            <AlertTriangle size={18} />
            <p className="text-sm">{error}</p>
          </div>
        )}
        <div className="border rounded-md overflow-hidden aspect-video bg-muted flex items-center justify-center">
          {isCameraActive ? (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          ) : (
            <Video className="w-16 h-16 text-muted-foreground" />
          )}
        </div>
        <div className="flex gap-2">
        {!isCameraActive ? (
          <Button onClick={startCamera} className="w-full">
            <Camera className="mr-2 h-4 w-4" /> Start Camera
          </Button>
        ) : (
          <>
            <Button onClick={stopCamera} variant="outline" className="w-1/2">
              <VideoOff className="mr-2 h-4 w-4" /> Stop Camera
            </Button>
            <Button onClick={handleCaptureFrame} className="w-1/2" disabled={!isCameraActive}>
              <Send className="mr-2 h-4 w-4" /> Capture & Process
            </Button>
          </>
        )}
        </div>
      </CardContent>
    </Card>
  );
}
