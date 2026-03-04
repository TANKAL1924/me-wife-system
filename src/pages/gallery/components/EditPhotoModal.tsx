import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

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

interface EditPhotoModalProps {
  photo: Photo;
  onClose: () => void;
  onSave: (photo: Photo) => void;
}

const ALBUMS = ['Trips', 'Anniversaries', 'Daily Life', 'Milestones', 'Holidays'];

const EditPhotoModal = ({ photo, onClose, onSave }: EditPhotoModalProps) => {
  const [title, setTitle] = useState<string>(photo?.title || '');
  const [description, setDescription] = useState<string>(photo?.description || '');
  const [album, setAlbum] = useState<string>(photo?.album || '');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>(photo?.tags || []);

  const addTag = () => {
    const t = tagInput?.trim();
    if (t && !tags?.includes(t)) setTags([...tags, t]);
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags(tags?.filter((t) => t !== tag));

  const handleSave = () => {
    onSave({ ...photo, title, description, album, tags });
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

        <div className="flex flex-col gap-1">
          <label className="font-caption text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e?.target?.value)}
            rows={3}
            placeholder="Add a memory note..."
            className="w-full px-3 py-2 rounded-md font-body text-sm resize-none focus-ring"
            style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-foreground)', border: '1px solid var(--color-border)' }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-caption text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Album</label>
          <select
            value={album}
            onChange={(e) => setAlbum(e?.target?.value)}
            className="w-full px-3 py-2 rounded-md font-caption text-sm focus-ring"
            style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-foreground)', border: '1px solid var(--color-border)' }}
          >
            <option value="">No album</option>
            {ALBUMS?.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-caption text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e?.target?.value)}
              onKeyDown={(e) => e?.key === 'Enter' && addTag()}
              placeholder="Add tag..."
              className="flex-1 px-3 py-2 rounded-md font-caption text-sm focus-ring"
              style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-foreground)', border: '1px solid var(--color-border)' }}
            />
            <button
              onClick={addTag}
              className="px-3 py-2 rounded-md font-caption text-sm transition-base focus-ring"
              style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
            >
              Add
            </button>
          </div>
          {tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags?.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full font-caption text-xs" style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-base" aria-label={`Remove tag ${tag}`}>
                    <Icon name="X" size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="default" onClick={handleSave} iconName="Save" iconPosition="left">Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default EditPhotoModal;