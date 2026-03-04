import { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import useScrollAnimation from '../../../hooks/useScrollAnimation';

interface Photo {
  id: number;
  src: string;
  alt: string;
  title: string;
  date: string;
  album?: string;
  tags: string[];
  description: string;
}

interface PhotoCardProps {
  photo: Photo;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onOpen: (photo: Photo) => void;
  selectionMode: boolean;
  index?: number;
}

const PhotoCard = ({ photo, isSelected, onSelect, onOpen, selectionMode, index = 0 }: PhotoCardProps) => {
  const [hovered, setHovered] = useState(false);
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  // Cap stagger delay at 10 steps (0-9)
  const delayClass = `scroll-delay-${Math.min((index % 10) + 1, 10)}`;

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-lg cursor-pointer group transition-base scroll-hidden ${delayClass} ${isVisible ? 'scroll-visible' : ''}`}
      style={{
        boxShadow: isSelected ? '0 0 0 3px var(--color-primary)' : 'var(--shadow-sm)',
        borderRadius: 'var(--radius-md)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => selectionMode ? onSelect(photo?.id) : onOpen(photo)}
    >
      <div className="w-full aspect-square overflow-hidden">
        <Image
          src={photo?.src}
          alt={photo?.alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-between p-3 transition-opacity duration-200"
        style={{
          background: 'linear-gradient(to bottom, rgba(44,24,16,0.0) 0%, rgba(44,24,16,0.65) 100%)',
          opacity: hovered || isSelected ? 1 : 0,
        }}
      >
        {/* Top: checkbox */}
        <div className="flex justify-end">
          <button
            onClick={(e) => { e?.stopPropagation(); onSelect(photo?.id); }}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-base focus-ring"
            style={{
              backgroundColor: isSelected ? 'var(--color-primary)' : 'rgba(255,255,255,0.85)',
              border: isSelected ? 'none' : '2px solid rgba(255,255,255,0.7)',
            }}
            aria-label={isSelected ? 'Deselect photo' : 'Select photo'}
          >
            {isSelected && <Icon name="Check" size={14} color="white" strokeWidth={3} />}
          </button>
        </div>

        {/* Bottom: info */}
        <div>
          <p className="font-caption text-xs font-semibold text-white line-clamp-1">{photo?.title}</p>
          <p className="font-caption text-xs text-white/70">{photo?.date}</p>
        </div>
      </div>
      {/* Album tag */}
      {photo?.album && (
        <div
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full font-caption text-xs"
          style={{ backgroundColor: 'rgba(212,118,26,0.85)', color: 'white' }}
        >
          {photo?.album}
        </div>
      )}
    </div>
  );
};

export default PhotoCard;