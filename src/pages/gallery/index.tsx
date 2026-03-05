import { useState, useMemo, useEffect } from 'react';
import AppShell from '../../components/ui/AppShell';
import Icon from '../../components/AppIcon';
import GalleryHeader from './components/GalleryHeader';
import FilterBar from './components/FilterBar';
import PhotoCard from './components/PhotoCard';
import Lightbox from './components/Lightbox';
import UploadModal from './components/UploadModal';
import EditPhotoModal from './components/EditPhotoModal';
import EmptyState from './components/EmptyState';
import { supabase } from '../../utils/supabase';

type SortOption = 'newest' | 'oldest' | 'title';
type ViewMode = 'grid' | 'masonry';

interface Photo {
  id: number;
  photo_name: string;
  title: string;
  fav: boolean;
  created_at: string;
}

interface Toast {
  message: string;
  type: 'success' | 'error';
}

const GalleryPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [editPhoto, setEditPhoto] = useState<Photo | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchPhotos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('id, photo_name, title, fav, created_at')
        .order('created_at', { ascending: false })
        .abortSignal(controller.signal);
      if (controller.signal.aborted) return;
      if (error) {
        showToast('Failed to load photos.', 'error');
        setLoading(false);
        return;
      }
      setPhotos((data ?? []).map((row) => {
        const r = row as { id: number; photo_name: string; title: string; fav: boolean; created_at: string };
        return {
          id: r.id,
          photo_name: r.photo_name ?? '',
          title: r.title ?? '',
          fav: r.fav ?? false,
          created_at: r.created_at,
        };
      }));
      setLoading(false);
    };

    fetchPhotos();
    return () => controller.abort();
  }, []);

  const filteredPhotos = useMemo(() => {
    let result = [...photos];
    if (searchQuery?.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        (p.title || '').toLowerCase().includes(q)
      );
    }
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else if (sortBy === 'oldest') result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    else if (sortBy === 'title') result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    return result;
  }, [photos, searchQuery, sortBy]);

  const handleToggleFav = async (id: number) => {
    const photo = photos.find((p) => p.id === id);
    if (!photo) return;
    const newFav = !photo.fav;
    const { error } = await supabase
      .from('gallery')
      .update({ fav: newFav })
      .eq('id', id);
    if (error) {
      showToast('Failed to update favourite.', 'error');
      return;
    }
    setPhotos((prev) => prev.map((p) => p.id === id ? { ...p, fav: newFav } : p));
    if (lightboxPhoto?.id === id) setLightboxPhoto({ ...photo, fav: newFav });
    showToast(newFav ? 'Added to favourites!' : 'Removed from favourites.');
  };

  const handleDeleteFromLightbox = async (photo: Photo) => {
    const { error: storageError } = await supabase.storage.from('gallery').remove([photo.photo_name]);
    if (storageError) {
      showToast('Failed to delete file.', 'error');
      return;
    }
    const { error: dbError } = await supabase.from('gallery').delete().eq('id', photo.id);
    if (dbError) {
      showToast('Failed to delete record.', 'error');
      return;
    }
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    setLightboxPhoto(null);
    showToast('Photo deleted.');
  };

  const handleOpenLightbox = (photo: Photo) => setLightboxPhoto(photo);

  const lightboxIndex = lightboxPhoto ? filteredPhotos?.findIndex((p) => p?.id === lightboxPhoto?.id) : -1;

  const handleLightboxPrev = () => {
    if (lightboxIndex > 0) setLightboxPhoto(filteredPhotos?.[lightboxIndex - 1]);
  };

  const handleLightboxNext = () => {
    if (lightboxIndex < filteredPhotos?.length - 1) setLightboxPhoto(filteredPhotos?.[lightboxIndex + 1]);
  };

  const handleUpload = async ({ files, title }: { files: File[]; title: string }) => {
    const uploaded: Photo[] = [];
    for (const file of files) {
      const fileName = file.name;
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file, { upsert: true });
      if (uploadError) {
        showToast(`Failed to upload ${file.name}.`, 'error');
        continue;
      }
      const { data: insertData, error: insertError } = await supabase
        .from('gallery')
        .insert({ photo_name: fileName, title: title || '' })
        .select('id, photo_name, title, fav, created_at')
        .single();
      if (insertError || !insertData) {
        showToast(`Failed to save ${file.name}.`, 'error');
        continue;
      }
      const row = insertData as { id: number; photo_name: string; title: string; fav: boolean; created_at: string };
      uploaded.push({
        id: row.id,
        photo_name: row.photo_name,
        title: row.title ?? '',
        fav: false,
        created_at: row.created_at,
      });
    }
    if (uploaded.length > 0) {
      setPhotos((prev) => [...uploaded, ...prev]);
      showToast(`${uploaded.length} photo(s) uploaded successfully!`);
    }
  };

  const handleSaveEdit = async (updatedPhoto: Photo) => {
    const { error } = await supabase
      .from('gallery')
      .update({ title: updatedPhoto.title, fav: updatedPhoto.fav })
      .eq('id', updatedPhoto.id);
    if (error) {
      showToast('Failed to save changes.', 'error');
      return;
    }
    setPhotos((prev) => prev.map((p) => p.id === updatedPhoto.id ? updatedPhoto : p));
    if (lightboxPhoto?.id === updatedPhoto.id) setLightboxPhoto(updatedPhoto);
    showToast('Photo details saved.');
  };

  const gridClass = viewMode === 'grid' ?'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4' :'columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 md:gap-4';

  return (
    <AppShell>
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 mt-14 md:mt-0 mb-16 md:mb-0">

          <GalleryHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onUploadClick={() => setShowUpload(true)} />

          <FilterBar
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode} />

          {/* Stats bar */}
          <div className="flex items-center gap-4 mb-5 font-caption text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            {loading ? (
              <span>Loading photos...</span>
            ) : (
              <span>{filteredPhotos?.length} photo{filteredPhotos?.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Icon name="Loader2" size={36} color="var(--color-primary)" className="animate-spin" />
            </div>
          ) : filteredPhotos?.length === 0 ?
            <EmptyState
              searchQuery={searchQuery}
              onUploadClick={() => setShowUpload(true)} /> :

            viewMode === 'grid' ?
            <div className={gridClass}>
              {filteredPhotos?.map((photo, index) =>
                <PhotoCard
                  key={photo?.id}
                  photo={photo}
                  index={index}
                  onOpen={handleOpenLightbox}
                  onToggleFav={handleToggleFav} />
              )}
            </div> :

            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 md:gap-4">
              {filteredPhotos?.map((photo, index) =>
                <div key={photo?.id} className="break-inside-avoid mb-3 md:mb-4">
                  <PhotoCard
                    photo={photo}
                    index={index}
                    onOpen={handleOpenLightbox}
                    onToggleFav={handleToggleFav} />
                </div>
              )}
            </div>
          }
        </div>

      {/* Lightbox */}
      {lightboxPhoto &&
        <Lightbox
          photo={lightboxPhoto}
          photos={filteredPhotos}
          onClose={() => setLightboxPhoto(null)}
          onPrev={handleLightboxPrev}
          onNext={handleLightboxNext}
          onEdit={(p) => { setEditPhoto(p); setLightboxPhoto(null); }}
          onDelete={handleDeleteFromLightbox} />
      }
      {/* Upload Modal */}
      {showUpload &&
        <UploadModal onClose={() => setShowUpload(false)} onUpload={handleUpload} />
      }
      {/* Edit Modal */}
      {editPhoto &&
        <EditPhotoModal photo={editPhoto} onClose={() => setEditPhoto(null)} onSave={handleSaveEdit} />
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
    </AppShell>
  );
};

export default GalleryPage;