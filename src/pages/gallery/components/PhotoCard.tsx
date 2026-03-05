import { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import useScrollAnimation from '../../../hooks/useScrollAnimation';
import { getGalleryPhotoUrl } from '../../../utils/supabase';

interface Photo {
  id: number;
  photo_name: string;
  title: string;
  fav: boolean;
  created_at: string;
}

interface PhotoCardProps {
  photo: Photo;
  onOpen: (photo: Photo) => void;
  onToggleFav: (id: number) => void;
  index?: number;
}

const PhotoCard = ({ photo, onOpen, onToggleFav, index = 0 }: PhotoCardProps) => {
  const [hovered, setHovered] = useState(false);
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  // Cap stagger delay at 10 steps (0-9)
  const delayClass = `scroll-delay-${Math.min((index % 10) + 1, 10)}`;

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-lg cursor-pointer group transition-base scroll-hidden ${delayClass} ${isVisible ? 'scroll-visible' : ''}`}
      style={{
        boxShadow: 'var(--shadow-sm)',
        borderRadius: 'var(--radius-md)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(photo)}
    >
      <div className="w-full aspect-square overflow-hidden">
        <Image
          src={getGalleryPhotoUrl(photo.photo_name)}
          alt={photo.title || photo.photo_name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-between p-3 transition-opacity duration-200"
        style={{
          background: 'linear-gradient(to bottom, rgba(44,24,16,0.0) 0%, rgba(44,24,16,0.65) 100%)',
          opacity: hovered ? 1 : 0,
        }}
      >
        {/* Top: fav heart toggle */}
        <div className="flex justify-end">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFav(photo.id); }}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-base focus-ring"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
            aria-label={photo.fav ? 'Remove from favourites' : 'Add to favourites'}
          >
            <Icon
              name="Heart"
              size={14}
              color={photo.fav ? 'var(--color-primary)' : 'white'}
              strokeWidth={2.5}
              fill={photo.fav ? 'var(--color-primary)' : 'none'}
            />
          </button>
        </div>

        {/* Bottom: title */}
        <div>
          <p className="font-caption text-xs font-semibold text-white line-clamp-1">{photo.title}</p>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;