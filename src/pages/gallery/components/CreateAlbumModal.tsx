import { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

interface CreateAlbumModalProps {
  onClose: () => void;
  onCreate: (album: { name: string; description: string }) => void;
}

const CreateAlbumModal = ({ onClose, onCreate }: CreateAlbumModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!name?.trim()) { setError('Album name is required'); return; }
    onCreate({ name: name?.trim(), description: description?.trim() });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-modal px-4"
      style={{ backgroundColor: 'rgba(44,24,16,0.6)', zIndex: 'var(--z-modal)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl p-6 flex flex-col gap-4"
        style={{ backgroundColor: 'var(--color-card)', boxShadow: 'var(--shadow-2xl)' }}
        onClick={(e) => e?.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl" style={{ color: 'var(--color-foreground)' }}>Create Album</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md transition-base focus-ring" style={{ color: 'var(--color-muted-foreground)' }}>
            <Icon name="X" size={18} />
          </button>
        </div>
        <Input
          label="Album Name"
          type="text"
          value={name}
          onChange={(e) => { setName(e?.target?.value); setError(''); }}
          placeholder="e.g. Summer Vacation 2025"
          error={error}
          required
        />
        <div className="flex flex-col gap-1">
          <label className="font-caption text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e?.target?.value)}
            rows={2}
            placeholder="What's this album about?"
            className="w-full px-3 py-2 rounded-md font-body text-sm resize-none focus-ring"
            style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-foreground)', border: '1px solid var(--color-border)' }}
          />
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="default" onClick={handleCreate} iconName="FolderPlus" iconPosition="left">Create</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateAlbumModal;