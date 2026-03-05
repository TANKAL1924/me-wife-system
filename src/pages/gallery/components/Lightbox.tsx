import { useEffect, useCallback } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { getGalleryPhotoUrl } from '../../../utils/supabase';

interface Photo {
  id: number;
  photo_name: string;
  title: string;
  fav: boolean;
  created_at: string;
}

interface LightboxProps {
  photo: Photo;
  photos: Photo[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onEdit: (photo: Photo) => void;
  onDelete: (photo: Photo) => void;
}

const Lightbox = ({ photo, photos, onClose, onPrev, onNext, onEdit, onDelete }: LightboxProps) => {
  const currentIndex = photos?.findIndex((p) => p?.id === photo?.id);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e?.key === 'Escape') onClose();
    if (e?.key === 'ArrowLeft') onPrev();
    if (e?.key === 'ArrowRight') onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-modal"
      style={{ backgroundColor: 'rgba(26,15,10,0.95)', zIndex: 'var(--z-modal)' }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative flex flex-col lg:flex-row w-full max-w-5xl mx-4 rounded-xl overflow-hidden"
        style={{ backgroundColor: 'var(--color-card)', maxHeight: '90vh', boxShadow: 'var(--shadow-2xl)' }}
        onClick={(e) => e?.stopPropagation()}
      >
        {/* Image area */}
        <div className="relative flex-1 flex items-center justify-center bg-black min-h-[280px] lg:min-h-[500px]">
          <Image
            src={getGalleryPhotoUrl(photo.photo_name)}
            alt={photo.title || photo.photo_name}
            className="max-w-full max-h-[60vh] lg:max-h-[80vh] object-contain"
          />

          {/* Prev */}
          <button
            onClick={(e) => { e?.stopPropagation(); onPrev(); }}
            disabled={currentIndex === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-base focus-ring disabled:opacity-30"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}
            aria-label="Previous photo"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e?.stopPropagation(); onNext(); }}
            disabled={currentIndex === photos?.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-base focus-ring disabled:opacity-30"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}
            aria-label="Next photo"
          >
            <Icon name="ChevronRight" size={20} />
          </button>

          {/* Counter */}
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full font-data text-xs"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }}
          >
            {currentIndex + 1} / {photos?.length}
          </div>
        </div>

        {/* Info panel */}
        <div className="w-full lg:w-72 flex flex-col p-5 gap-4" style={{ borderLeft: '1px solid var(--color-border)' }}>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-lg" style={{ color: 'var(--color-foreground)' }}>{photo.title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-md transition-base focus-ring flex-shrink-0"
              style={{ color: 'var(--color-muted-foreground)' }}
              aria-label="Close lightbox"
            >
              <Icon name="X" size={18} />
            </button>
          </div>

          <div className="mt-auto flex flex-col gap-2">
            <Button variant="outline" size="sm" iconName="Pencil" iconPosition="left" onClick={() => onEdit(photo)}>
              Edit Details
            </Button>
            <Button variant="ghost" size="sm" iconName="Download" iconPosition="left">
              Download
            </Button>
            <Button variant="destructive" size="sm" iconName="Trash2" iconPosition="left" onClick={() => onDelete(photo)}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;