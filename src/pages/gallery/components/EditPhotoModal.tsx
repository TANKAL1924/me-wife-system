import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

interface Photo {
  id: number;
  photo_name: string;
  title: string;
  fav: boolean;
  created_at: string;
}

interface EditPhotoModalProps {
  photo: Photo;
  onClose: () => void;
  onSave: (photo: Photo) => void;
}

const EditPhotoModal = ({ photo, onClose, onSave }: EditPhotoModalProps) => {
  const [title, setTitle] = useState<string>(photo?.title || '');
  const [fav, setFav] = useState<boolean>(photo?.fav ?? false);

  const handleSave = () => {
    onSave({ ...photo, title, fav });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-modal px-4"
      style={{ backgroundColor: 'rgba(44,24,16,0.6)', zIndex: 'var(--z-modal)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl p-6 flex flex-col gap-4"
        style={{ backgroundColor: 'var(--color-card)', boxShadow: 'var(--shadow-2xl)' }}
        onClick={(e) => e?.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl" style={{ color: 'var(--color-foreground)' }}>Edit Photo Details</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md transition-base focus-ring" style={{ color: 'var(--color-muted-foreground)' }}>
            <Icon name="X" size={18} />
          </button>
        </div>

        <Input label="Title" type="text" value={title} onChange={(e) => setTitle(e?.target?.value)} placeholder="Photo title" />

        {/* Favourite toggle */}
        <button
          onClick={() => setFav((v) => !v)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg transition-base focus-ring w-fit"
          style={{
            backgroundColor: fav ? 'rgba(212,118,26,0.10)' : 'var(--color-muted)',
            color: fav ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
          }}
          type="button"
        >
          <Icon name="Heart" size={16} color={fav ? 'var(--color-primary)' : 'currentColor'} strokeWidth={fav ? 2.5 : 2} />
          <span className="font-caption text-sm">{fav ? 'Marked as favourite' : 'Mark as favourite'}</span>
        </button>

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="default" onClick={handleSave} iconName="Save" iconPosition="left">Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default EditPhotoModal;