import { useState, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import GalleryHeader from './components/GalleryHeader';
import FilterBar from './components/FilterBar';
import PhotoCard from './components/PhotoCard';
import Lightbox from './components/Lightbox';
import UploadModal from './components/UploadModal';
import EditPhotoModal from './components/EditPhotoModal';
import CreateAlbumModal from './components/CreateAlbumModal';
import EmptyState from './components/EmptyState';

type SortOption = 'newest' | 'oldest' | 'title';
type ViewMode = 'grid' | 'masonry';

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

interface Toast {
  message: string;
  type: 'success' | 'error';
}

const SIDEBAR_NAV = [
  { label: 'Our Home', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Our Calendar', path: '/calendar', icon: 'CalendarHeart' },
  { label: 'Our Gallery', path: '/gallery', icon: 'Images' },
  { label: 'Profile', path: '/profile-page', icon: 'UserCircle' },
  { label: 'Portfolio', path: '/portfolio-resume-settings', icon: 'Briefcase' },
];

const INITIAL_PHOTOS: Photo[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1615325254799-c3817f87f925",
    alt: "Couple holding hands walking along a golden sunset beach with waves gently lapping the shore",
    title: "Sunset Walk",
    date: "02/14/2026",
    album: "Anniversaries",
    tags: ["beach", "sunset", "romantic"],
    description: "Our Valentine\'s Day evening walk along the coast. Pure magic."
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1582226560262-03e5308c5afb",
    alt: "Panoramic mountain landscape with snow-capped peaks reflecting in a crystal clear alpine lake",
    title: "Mountain Escape",
    date: "01/20/2026",
    album: "Trips",
    tags: ["mountains", "nature", "adventure"],
    description: "Our winter getaway to the Rockies. Breathtaking views every morning."
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1694111154322-2fe2c80ad188",
    alt: "Happy couple laughing together at a cozy outdoor cafe table with coffee cups and autumn leaves",
    title: "Sunday Coffee",
    date: "01/12/2026",
    album: "Daily Life",
    tags: ["coffee", "cozy", "weekend"],
    description: "Our favorite Sunday ritual at the corner café."
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1730863761965-9e38920bf975",
    alt: "Romantic candlelit dinner table with flowers and wine glasses in an elegant restaurant setting",
    title: "Anniversary Dinner",
    date: "12/25/2025",
    album: "Anniversaries",
    tags: ["dinner", "celebration", "anniversary"],
    description: "Three years and counting. Here\'s to forever."
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1676412952691-5e4a229485a7",
    alt: "Aerial view of turquoise tropical ocean water with a small wooden boat and white sandy beach",
    title: "Maldives Trip",
    date: "11/05/2025",
    album: "Trips",
    tags: ["maldives", "ocean", "tropical"],
    description: "Our dream honeymoon destination finally checked off the list!"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1606787620819-8bdf0c44c293",
    alt: "Couple cooking together in a bright modern kitchen with vegetables and herbs on the counter",
    title: "Cooking Together",
    date: "10/18/2025",
    album: "Daily Life",
    tags: ["cooking", "home", "fun"],
    description: "Attempting a new pasta recipe. It turned out amazing!"
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1670739613475-4db838952533",
    alt: "Festive Christmas tree decorated with colorful ornaments and warm fairy lights in a cozy living room",
    title: "Christmas Morning",
    date: "12/25/2025",
    album: "Holidays",
    tags: ["christmas", "holiday", "cozy"],
    description: "Our first Christmas in the new home."
  },
  {
    id: 8,
    src: "https://img.rocket.new/generatedImages/rocket_gen_img_12d03603c-1766810079146.png",
    alt: "Colorful birthday cake with candles lit surrounded by balloons and confetti at a celebration party",
    title: "Birthday Surprise",
    date: "09/14/2025",
    album: "Milestones",
    tags: ["birthday", "surprise", "celebration"],
    description: "The look on your face when you walked in was priceless!"
  },
  {
    id: 9,
    src: "https://img.rocket.new/generatedImages/rocket_gen_img_1db69a325-1772563692977.png",
    alt: "Couple hiking on a forest trail surrounded by tall pine trees with sunlight filtering through the canopy",
    title: "Forest Hike",
    date: "08/22/2025",
    album: "Trips",
    tags: ["hiking", "forest", "nature"],
    description: "10 miles and totally worth every step."
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1601396773761-4cae1fff7a00",
    alt: "Two people watching fireworks display over a city skyline on a warm summer evening",
    title: "4th of July",
    date: "07/04/2025",
    album: "Holidays",
    tags: ["fireworks", "4th of july", "summer"],
    description: "Best fireworks show we\'ve ever seen from the rooftop."
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1727729890956-88233128a7cc",
    alt: "Elegant wedding reception hall with floral decorations, fairy lights, and guests dancing on the dance floor",
    title: "Wedding Day",
    date: "06/15/2025",
    album: "Milestones",
    tags: ["wedding", "love", "milestone"],
    description: "The most beautiful day of our lives. Forever starts here."
  },
  {
    id: 12,
    src: "https://img.rocket.new/generatedImages/rocket_gen_img_1bd74b118-1772563690996.png",
    alt: "Couple sitting on a couch watching a movie together with popcorn and blankets on a rainy evening",
    title: "Movie Night",
    date: "03/01/2026",
    album: "Daily Life",
    tags: ["movie", "cozy", "home"],
    description: "Rainy Saturday, hot cocoa, and a great film. Perfect."
  }
];

const mockUser = { name: "Sarah & James", email: "sarah.james@together.com" };

const GalleryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeAlbum, setActiveAlbum] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [editPhoto, setEditPhoto] = useState<Photo | null>(null);
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const isActive = (path: string): boolean => location?.pathname === path;

  const getInitials = () => {
    const name = mockUser?.name || '';
    return name?.split(' ')?.map(n => n?.[0])?.join('')?.slice(0, 2)?.toUpperCase();
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredPhotos = useMemo(() => {
    let result = [...photos];
    if (activeAlbum !== 'All') result = result?.filter((p) => p?.album === activeAlbum);
    if (searchQuery?.trim()) {
      const q = searchQuery?.toLowerCase();
      result = result?.filter((p) =>
        p?.title?.toLowerCase()?.includes(q) ||
        (p?.description || '')?.toLowerCase()?.includes(q) ||
        (p?.tags || [])?.some((t) => t?.toLowerCase()?.includes(q)) ||
        p?.date?.includes(q)
      );
    }
    if (sortBy === 'newest') result?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    else if (sortBy === 'oldest') result?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    else if (sortBy === 'title') result?.sort((a, b) => a?.title?.localeCompare(b?.title));
    return result;
  }, [photos, activeAlbum, searchQuery, sortBy]);

  const handleSelect = (id: number) => {
    setSelectedIds((prev) => prev?.includes(id) ? prev?.filter((i) => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    setPhotos((prev) => prev?.filter((p) => !selectedIds?.includes(p?.id)));
    setSelectedIds([]);
    showToast(`${selectedIds?.length} photo(s) deleted.`);
  };

  const handleBulkDownload = () => {
    showToast(`${selectedIds?.length} photo(s) downloaded.`);
    setSelectedIds([]);
  };

  const handleOpenLightbox = (photo: Photo) => setLightboxPhoto(photo);

  const lightboxIndex = lightboxPhoto ? filteredPhotos?.findIndex((p) => p?.id === lightboxPhoto?.id) : -1;

  const handleLightboxPrev = () => {
    if (lightboxIndex > 0) setLightboxPhoto(filteredPhotos?.[lightboxIndex - 1]);
  };

  const handleLightboxNext = () => {
    if (lightboxIndex < filteredPhotos?.length - 1) setLightboxPhoto(filteredPhotos?.[lightboxIndex + 1]);
  };

  const handleUpload = ({ files, title, album }: { files: File[]; title: string; album: string }) => {
    const newPhotos: Photo[] = files?.map((file: File, i: number) => ({
      id: Date.now() + i,
      src: URL.createObjectURL(file),
      alt: `Uploaded photo titled ${title || file?.name} showing a personal memory captured by the couple`,
      title: title || file?.name?.replace(/\.[^/.]+$/, ''),
      date: new Date()?.toLocaleDateString('en-US'),
      album: album || undefined,
      tags: [],
      description: ''
    }));
    setPhotos((prev) => [...newPhotos, ...prev]);
    showToast(`${files?.length} photo(s) uploaded successfully!`);
  };

  const handleSaveEdit = (updatedPhoto: Photo) => {
    setPhotos((prev) => prev?.map((p) => p?.id === updatedPhoto?.id ? updatedPhoto : p));
    if (lightboxPhoto?.id === updatedPhoto?.id) setLightboxPhoto(updatedPhoto);
    showToast('Photo details saved.');
  };

  const handleCreateAlbum = ({ name }: { name: string }) => {
    showToast(`Album "${name}" created!`);
  };

  const gridClass = viewMode === 'grid' ?'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4' :'columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 md:gap-4';

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>

      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-60 flex-shrink-0 sticky top-0 h-screen"
        style={{ backgroundColor: 'var(--color-card)', borderRight: '1px solid var(--color-border)', zIndex: 100 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
          >
            <Icon name="Heart" size={18} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-heading text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>Together</span>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {SIDEBAR_NAV?.map((item) => (
            <NavLink
              key={item?.path}
              to={item?.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-caption font-medium transition-base"
              style={{
                color: isActive(item?.path) ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                backgroundColor: isActive(item?.path) ? 'rgba(212,118,26,0.10)' : 'transparent',
              }}
              aria-current={isActive(item?.path) ? 'page' : undefined}
            >
              <Icon
                name={item?.icon}
                size={18}
                color={isActive(item?.path) ? 'var(--color-primary)' : 'currentColor'}
                strokeWidth={isActive(item?.path) ? 2.5 : 2}
              />
              <span>{item?.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User area */}
        <div className="px-4 py-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold font-caption flex-shrink-0"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
            >
              {getInitials()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-caption font-medium truncate" style={{ color: 'var(--color-foreground)' }}>
                {mockUser?.name}
              </p>
              <p className="text-xs font-caption truncate" style={{ color: 'var(--color-muted-foreground)' }}>
                {mockUser?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="mt-3 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-caption font-medium transition-colors hover:bg-red-50"
            style={{ color: 'var(--color-muted-foreground)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-muted-foreground)'; }}
          >
            <Icon name="LogOut" size={16} strokeWidth={2} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 h-14 z-50"
        style={{ backgroundColor: 'var(--color-card)', borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
          >
            <Icon name="Heart" size={16} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-heading text-base font-semibold" style={{ color: 'var(--color-foreground)' }}>Together</span>
        </div>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold font-caption"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
          onClick={() => navigate('/profile-page')}
          aria-label="Profile"
        >
          {getInitials()}
        </button>
      </div>

      {/* Mobile Bottom Nav */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around h-16 z-50"
        style={{ backgroundColor: 'var(--color-card)', borderTop: '1px solid var(--color-border)' }}
      >
        {SIDEBAR_NAV?.map((item) => (
          <NavLink
            key={item?.path}
            to={item?.path}
            className="flex flex-col items-center gap-0.5 px-3 py-1"
            style={{ color: isActive(item?.path) ? 'var(--color-primary)' : 'var(--color-muted-foreground)' }}
            aria-current={isActive(item?.path) ? 'page' : undefined}
          >
            <Icon
              name={item?.icon}
              size={20}
              color={isActive(item?.path) ? 'var(--color-primary)' : 'currentColor'}
              strokeWidth={isActive(item?.path) ? 2.5 : 2}
            />
            <span className="text-xs font-caption">{item?.label?.split(' ')?.pop()}</span>
          </NavLink>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto page-enter">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 mt-14 md:mt-0 mb-16 md:mb-0">

          <GalleryHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onUploadClick={() => setShowUpload(true)}
            selectedCount={selectedIds?.length}
            onBulkDelete={handleBulkDelete}
            onBulkDownload={handleBulkDownload}
            onClearSelection={() => setSelectedIds([])} />

          <FilterBar
            activeAlbum={activeAlbum}
            onAlbumChange={setActiveAlbum}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onCreateAlbum={() => setShowCreateAlbum(true)} />

          {/* Stats bar */}
          <div className="flex items-center gap-4 mb-5 font-caption text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            <span>{filteredPhotos?.length} photo{filteredPhotos?.length !== 1 ? 's' : ''}</span>
            {selectedIds?.length > 0 &&
              <span style={{ color: 'var(--color-primary)' }}>{selectedIds?.length} selected</span>
            }
          </div>

          {filteredPhotos?.length === 0 ?
            <EmptyState
              searchQuery={searchQuery}
              activeAlbum={activeAlbum}
              onUploadClick={() => setShowUpload(true)} /> :

            viewMode === 'grid' ?
            <div className={gridClass}>
              {filteredPhotos?.map((photo, index) =>
                <PhotoCard
                  key={photo?.id}
                  photo={photo}
                  index={index}
                  isSelected={selectedIds?.includes(photo?.id)}
                  onSelect={handleSelect}
                  onOpen={handleOpenLightbox}
                  selectionMode={selectedIds?.length > 0} />
              )}
            </div> :

            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 md:gap-4">
              {filteredPhotos?.map((photo, index) =>
                <div key={photo?.id} className="break-inside-avoid mb-3 md:mb-4">
                  <PhotoCard
                    photo={photo}
                    index={index}
                    isSelected={selectedIds?.includes(photo?.id)}
                    onSelect={handleSelect}
                    onOpen={handleOpenLightbox}
                    selectionMode={selectedIds?.length > 0} />
                </div>
              )}
            </div>
          }
        </div>
      </main>

      {/* Lightbox */}
      {lightboxPhoto &&
        <Lightbox
          photo={lightboxPhoto}
          photos={filteredPhotos}
          onClose={() => setLightboxPhoto(null)}
          onPrev={handleLightboxPrev}
          onNext={handleLightboxNext}
          onEdit={(p) => { setEditPhoto(p); setLightboxPhoto(null); }} />
      }
      {/* Upload Modal */}
      {showUpload &&
        <UploadModal onClose={() => setShowUpload(false)} onUpload={handleUpload} />
      }
      {/* Edit Modal */}
      {editPhoto &&
        <EditPhotoModal photo={editPhoto} onClose={() => setEditPhoto(null)} onSave={handleSaveEdit} />
      }
      {/* Create Album Modal */}
      {showCreateAlbum &&
        <CreateAlbumModal onClose={() => setShowCreateAlbum(false)} onCreate={handleCreateAlbum} />
      }
      {/* Toast */}
      {toast &&
        <div
          className="fixed bottom-24 md:bottom-6 right-4 flex items-center gap-3 px-4 py-3 rounded-lg font-caption text-sm"
          style={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 'var(--z-toast)',
            color: 'var(--color-foreground)'
          }}
          role="alert">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: toast?.type === 'success' ? 'var(--color-success)' : 'var(--color-error)' }} />
          {toast?.message}
        </div>
      }
    </div>
  );
};

export default GalleryPage;