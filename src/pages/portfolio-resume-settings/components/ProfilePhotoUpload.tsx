import { useState, useRef, useCallback, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

interface CropBox {
  x: number;
  y: number;
  size: number;
}

interface DragStart {
  x: number;
  y: number;
}

interface ImageSize {
  width: number;
  height: number;
}

interface ProfilePhotoUploadProps {
  currentPhoto: string | null;
  currentPhotoAlt?: string;
  onPhotoChange: (dataUrl: string | null) => void;
}

const ProfilePhotoUpload = ({ currentPhoto, currentPhotoAlt, onPhotoChange }: ProfilePhotoUploadProps) => {
  const [mode, setMode] = useState<'preview' | 'crop'>('preview');
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [croppedPhoto, setCroppedPhoto] = useState<string | null>(currentPhoto || null);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [cropBox, setCropBox] = useState<CropBox>({ x: 50, y: 50, size: 200 });
  const [dragStart, setDragStart] = useState<DragStart | null>(null);
  const [imageSize, setImageSize] = useState<ImageSize>({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const drawCropOverlay = useCallback(() => {
    const canvas = canvasRef?.current;
    const img = imageRef?.current;
    if (!canvas || !img) return;

    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    canvas.width = imageSize?.width;
    canvas.height = imageSize?.height;

    ctx?.clearRect(0, 0, canvas?.width, canvas?.height);
    ctx?.drawImage(img, 0, 0, imageSize?.width, imageSize?.height);

    // Dark overlay
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx?.fillRect(0, 0, canvas?.width, canvas?.height);

    // Clear crop circle
    const cx = cropBox?.x + cropBox?.size / 2;
    const cy = cropBox?.y + cropBox?.size / 2;
    const radius = cropBox?.size / 2;

    ctx?.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx?.beginPath();
    ctx?.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx?.fill();
    ctx?.restore();

    // Redraw image inside circle
    ctx?.save();
    ctx?.beginPath();
    ctx?.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx?.clip();
    ctx?.drawImage(img, 0, 0, imageSize?.width, imageSize?.height);
    ctx?.restore();

    // Circle border
    ctx?.beginPath();
    ctx?.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(212,118,26,0.9)';
    ctx.lineWidth = 2;
    ctx?.stroke();

    // Corner handles
    const handles = [
      { x: cropBox?.x, y: cropBox?.y },
      { x: cropBox?.x + cropBox?.size, y: cropBox?.y },
      { x: cropBox?.x, y: cropBox?.y + cropBox?.size },
      { x: cropBox?.x + cropBox?.size, y: cropBox?.y + cropBox?.size },
    ];
    handles?.forEach(h => {
      ctx?.beginPath();
      ctx?.arc(h?.x, h?.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'var(--color-primary)';
      ctx?.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1.5;
      ctx?.stroke();
    });
  }, [cropBox, imageSize]);

  useEffect(() => {
    if (mode === 'crop' && rawImage) {
      drawCropOverlay();
    }
  }, [mode, rawImage, cropBox, drawCropOverlay]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (!file?.type?.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev?.target?.result as string;
      setRawImage(src);

      const img = new window.Image();
      img.onload = () => {
        imageRef.current = img;
        const maxW = containerRef?.current?.offsetWidth || 480;
        const maxH = 320;
        const ratio = Math.min(maxW / img?.width, maxH / img?.height, 1);
        const w = Math.floor(img?.width * ratio);
        const h = Math.floor(img?.height * ratio);
        setImageSize({ width: w, height: h });
        setScale(ratio);
        const size = Math.min(w, h, 200);
        setCropBox({
          x: Math.floor((w - size) / 2),
          y: Math.floor((h - size) / 2),
          size,
        });
        setMode('crop');
      };
      img.src = src as string;
    };
    reader?.readAsDataURL(file);
    e.target.value = '';
  };

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const canvas = canvasRef?.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas?.getBoundingClientRect();
    const scaleX = canvas?.width / rect?.width;
    const scaleY = canvas?.height / rect?.height;
    const clientX = 'touches' in e ? e?.touches?.[0]?.clientX : e?.clientX;
    const clientY = 'touches' in e ? e?.touches?.[0]?.clientY : e?.clientY;
    return {
      x: (clientX - rect?.left) * scaleX,
      y: (clientY - rect?.top) * scaleY,
    };
  };

  const isInsideCropBox = (x: number, y: number): boolean => {
    return x >= cropBox?.x && x <= cropBox?.x + cropBox?.size &&
      y >= cropBox?.y && y <= cropBox?.y + cropBox?.size;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e?.preventDefault();
    const pos = getCanvasPos(e);
    if (isInsideCropBox(pos?.x, pos?.y)) {
      setIsDragging(true);
      setDragStart({ x: pos?.x - cropBox?.x, y: pos?.y - cropBox?.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragStart) return;
    e?.preventDefault();
    const pos = getCanvasPos(e);
    const newX = Math.max(0, Math.min(pos?.x - dragStart?.x, imageSize?.width - cropBox?.size));
    const newY = Math.max(0, Math.min(pos?.y - dragStart?.y, imageSize?.height - cropBox?.size));
    setCropBox(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleSizeChange = (newSize: number) => {
    const size = Math.max(60, Math.min(newSize, Math.min(imageSize?.width, imageSize?.height)));
    const x = Math.max(0, Math.min(cropBox?.x, imageSize?.width - size));
    const y = Math.max(0, Math.min(cropBox?.y, imageSize?.height - size));
    setCropBox({ x, y, size });
  };

  const applyCrop = () => {
    const img = imageRef?.current;
    if (!img) return;

    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = 200;
    outputCanvas.height = 200;
    const ctx = outputCanvas?.getContext('2d');

    // Draw circular clip
    ctx?.beginPath();
    ctx?.arc(100, 100, 100, 0, Math.PI * 2);
    ctx?.clip();

    // Source coords in original image space
    const srcX = cropBox?.x / scale;
    const srcY = cropBox?.y / scale;
    const srcSize = cropBox?.size / scale;

    ctx?.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, 200, 200);

    const dataUrl = outputCanvas?.toDataURL('image/png');
    setCroppedPhoto(dataUrl);
    onPhotoChange?.(dataUrl);
    setMode('preview');
    setRawImage(null);
  };

  const handleCancel = () => {
    setMode('preview');
    setRawImage(null);
  };

  const handleRemove = () => {
    setCroppedPhoto(null);
    onPhotoChange?.(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="block text-xs font-caption font-medium mb-1" style={{ color: 'var(--color-muted-foreground)' }}>
        Profile Photo
      </label>
      {mode === 'preview' && (
        <div className="flex items-center gap-5">
          {/* Circular Preview */}
          <div
            className="relative flex-shrink-0"
            style={{ width: 112, height: 112 }}
          >
            <div
              className="w-full h-full rounded-full overflow-hidden border-2 flex items-center justify-center"
              style={{
                borderColor: 'var(--color-primary)',
                backgroundColor: 'var(--color-background)',
              }}
            >
              {croppedPhoto ? (
                <img
                  src={croppedPhoto}
                  alt={currentPhotoAlt || 'Profile photo'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Icon name="User" size={44} color="var(--color-muted-foreground)" strokeWidth={1.5} />
              )}
            </div>
            {croppedPhoto && (
              <button
                onClick={handleRemove}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#ef4444', border: '2px solid var(--color-card)' }}
                title="Remove photo"
                aria-label="Remove profile photo"
              >
                <Icon name="X" size={11} color="white" strokeWidth={3} />
              </button>
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => fileInputRef?.current?.click()}
              className="flex items-center gap-2 px-5 py-3.5 rounded-lg text-base font-caption font-medium transition-colors"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                minHeight: 48,
              }}
            >
              <Icon name="Upload" size={16} strokeWidth={2} />
              {croppedPhoto ? 'Change Photo' : 'Upload Photo'}
            </button>
            <p className="text-xs font-caption" style={{ color: 'var(--color-muted-foreground)' }}>
              JPG, PNG or GIF · Max 5MB
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      )}
      {mode === 'crop' && rawImage && (
        <div
          ref={containerRef}
          className="flex flex-col gap-4 rounded-xl p-4"
          style={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-caption font-semibold" style={{ color: 'var(--color-foreground)' }}>
              Crop &amp; Resize Photo
            </p>
            <p className="text-xs font-caption" style={{ color: 'var(--color-muted-foreground)' }}>
              Drag the circle to reposition
            </p>
          </div>

          {/* Canvas */}
          <div className="relative overflow-hidden rounded-lg" style={{ lineHeight: 0 }}>
            <canvas
              ref={canvasRef}
              style={{
                width: '100%',
                maxWidth: imageSize?.width,
                cursor: isDragging ? 'grabbing' : 'grab',
                display: 'block',
                borderRadius: 8,
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
            />
          </div>

          {/* Size Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-caption font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
                Crop Size
              </label>
              <span className="text-xs font-caption" style={{ color: 'var(--color-foreground)' }}>
                {cropBox?.size}px
              </span>
            </div>
            <input
              type="range"
              min={60}
              max={Math.min(imageSize?.width, imageSize?.height)}
              value={cropBox?.size}
              onChange={e => handleSizeChange(Number(e?.target?.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: 'var(--color-primary)' }}
            />
          </div>

          {/* Aspect Ratio Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMaintainAspectRatio(prev => !prev)}
              className="flex items-center gap-2 text-xs font-caption"
              style={{ color: 'var(--color-muted-foreground)' }}
            >
              <div
                className="w-4 h-4 rounded flex items-center justify-center border"
                style={{
                  borderColor: maintainAspectRatio ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: maintainAspectRatio ? 'var(--color-primary)' : 'transparent',
                }}
              >
                {maintainAspectRatio && <Icon name="Check" size={10} color="white" strokeWidth={3} />}
              </div>
              Maintain 1:1 aspect ratio (circle crop)
            </button>
          </div>

          {/* Preview + Actions */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0"
                style={{ borderColor: 'var(--color-primary)', backgroundColor: 'var(--color-card)' }}
              >
                <PreviewCircle
                  imageRef={imageRef}
                  cropBox={cropBox}
                  scale={scale}
                />
              </div>
              <span className="text-xs font-caption" style={{ color: 'var(--color-muted-foreground)' }}>
                Preview
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-2 rounded-lg text-sm font-caption font-medium transition-colors"
                style={{
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-muted-foreground)',
                  backgroundColor: 'transparent',
                }}
              >
                Cancel
              </button>
              <button
                onClick={applyCrop}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-caption font-semibold"
                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
              >
                <Icon name="Crop" size={14} strokeWidth={2} />
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface PreviewCircleProps {
  imageRef: React.RefObject<HTMLImageElement | null>;
  cropBox: CropBox;
  scale: number;
}

const PreviewCircle = ({ imageRef, cropBox, scale }: PreviewCircleProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef?.current;
    const img = imageRef?.current;
    if (!canvas || !img) return;
    canvas.width = 48;
    canvas.height = 48;
    const ctx = canvas?.getContext('2d');
    ctx?.clearRect(0, 0, 48, 48);
    ctx?.beginPath();
    ctx?.arc(24, 24, 24, 0, Math.PI * 2);
    ctx?.clip();
    const srcX = cropBox?.x / scale;
    const srcY = cropBox?.y / scale;
    const srcSize = cropBox?.size / scale;
    ctx?.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, 48, 48);
  }, [imageRef, cropBox, scale]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default ProfilePhotoUpload;
