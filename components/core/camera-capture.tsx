'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, CameraOff, RefreshCw, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type FacingMode = 'user' | 'environment';

interface Props {
  onChange?: (file: File | null) => void;
  maxWidth?: number;
  mirrorPreview?: boolean;
  mirrorCapture?: boolean;
}

export default function CameraCapture({
  onChange,
  maxWidth = 1280,
  mirrorPreview = true,
  mirrorCapture = true,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<FacingMode>('environment');
  const [isStreaming, setIsStreaming] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);

  const start = async (preferredFacing: FacingMode = facingMode) => {
    if (typeof window === 'undefined' || !navigator?.mediaDevices) {
      toast.error('Kamera hanya bisa dipakai di browser/HTTPS.');
      return;
    }

    stop();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: preferredFacing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => { });
      }

      const track = stream.getVideoTracks()[0];
      const fm = track.getSettings().facingMode || (track.label.toLowerCase().includes('front') ? 'user' : (track.label.toLowerCase().includes('back') ? 'environment' : undefined));
      if (fm === 'user' || fm === 'environment') {
        setFacingMode(fm);
      }

      setIsStreaming(true);
    } catch {
      // fallback tanpa facingMode
      try {
        const fallback = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        streamRef.current = fallback;
        if (videoRef.current) {
          videoRef.current.srcObject = fallback;
          await videoRef.current.play().catch(() => { });
        }

        const track = fallback.getVideoTracks()[0];
        const fm = track.getSettings().facingMode || (track.label.toLowerCase().includes('front') ? 'user' : (track.label.toLowerCase().includes('back') ? 'environment' : undefined));
        if (fm === 'user' || fm === 'environment') {
          setFacingMode(fm);
        }

        setIsStreaming(true);
      } catch (error) {
        console.log(error)
        toast.error('Kamera tidak bisa diakses. Cek izin browser/perangkat dan gunakan HTTPS.');
        setIsStreaming(false);
      }
    }
  };

  const stop = () => {
    setIsStreaming(false);
    const s = streamRef.current;
    if (s) s.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  useEffect(() => {
    return () => {
      stop();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewUrl]);

  const capture = async () => {
    const video = videoRef.current;
    if (!video) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return;

    const scale = Math.min(1, maxWidth / w);
    const cw = Math.round(w * scale);
    const ch = Math.round(h * scale);

    const canvas = canvasRef.current ?? document.createElement('canvas');
    if (!canvasRef.current) canvasRef.current = canvas;

    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    const shouldMirror = isFront && mirrorCapture;
    if (shouldMirror) {
      ctx.translate(cw, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, cw, ch);
    ctx.restore();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.92)
    );
    if (!blob) return;

    const file = new File([blob], `ttd-${Date.now()}.jpg`, { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);

    setPreviewUrl(url);
    setCapturedFile(file);
    onChange?.(file);

    // Matikan kamera setelah berhasil capture (hemat baterai)
    stop();
  };

  const retake = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setCapturedFile(null);
    onChange?.(null);
    start(facingMode);
  };

  const toggleFacing = async () => {
    const next: FacingMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    await start(next);
  };

  const isFront = facingMode === 'user';

  return (
    <div className="space-y-3">
      {!previewUrl && (
        <div className="relative overflow-hidden rounded-xl border-2 border-dashed">
          <video
            ref={videoRef}
            className={cn(
              'h-[360px] w-full object-cover transform-gpu',
              isFront && mirrorPreview ? 'scale-x-[-1]' : ''
            )}
            playsInline
            muted
            autoPlay
          />
          {!isStreaming && (
            <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
              <Button
                type="button"
                variant="secondary"
                onClick={() => start()}
                className="shadow">
                <Camera className="h-4 w-4"
                />
                Buka Kamera
              </Button>
            </div>
          )}
          {isStreaming && (
            <div className="absolute bottom-4  left-4   right-4   flex items-center justify-center gap-2">
              <Button type="button" variant="secondary" size="icon" onClick={toggleFacing}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button type="button" size="icon" onClick={capture}>
                <Camera className="h-4 w-4" />
              </Button>
              <Button variant="outline" type="button" size="icon" onClick={stop}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {previewUrl && (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className={cn(
              'w-full max-h-[420px] rounded-xl border object-contain bg-muted',
              isFront && mirrorPreview && !mirrorCapture ? 'transform scale-x-[-1]' : ''
            )}
          />
          <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
            <Button type="button" variant="secondary" onClick={retake}>
              <CameraOff className="h-4 w-4" />
              Retake
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
