import { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (data: { files: File[]; title: string }) => void;
}

const UploadModal = ({ onClose, onUpload }: UploadModalProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e?.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e?.dataTransfer?.files)?.filter((f) => f?.type?.startsWith('image/'));
    setFiles(dropped);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e?.target?.files ?? [])?.filter((f) => f?.type?.startsWith('image/'));
    setFiles(selected);
  };

  const handleUpload = () => {
    if (!files?.length) return;
    setUploading(true);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      setProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onUpload({ files, title });
          onClose();
        }, 400);
      }
    }, 300);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-modal px-4"
      style={{ backgroundColor: 'rgba(44,24,16,0.6)', zIndex: 'var(--z-modal)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl p-6 flex flex-col gap-5"
        style={{ backgroundColor: 'var(--color-card)', boxShadow: 'var(--shadow-2xl)' }}
        onClick={(e) => e?.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl" style={{ color: 'var(--color-foreground)' }}>Upload Photos</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md transition-base focus-ring" style={{ color: 'var(--color-muted-foreground)' }}>
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e?.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef?.current?.click()}
          className="flex flex-col items-center justify-center gap-3 p-8 rounded-lg cursor-pointer transition-base"
          style={{
            border: `2px dashed ${dragOver ? 'var(--color-primary)' : 'var(--color-border)'}`,
            backgroundColor: dragOver ? 'rgba(212,118,26,0.06)' : 'var(--color-muted)',
          }}
        >
          <Icon name="ImagePlus" size={36} color={dragOver ? 'var(--color-primary)' : 'var(--color-muted-foreground)'} />
          <div className="text-center">
            <p className="font-caption text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
              {files?.length > 0 ? `${files?.length} file(s) selected` : 'Drag & drop photos here'}
            </p>
            <p className="font-caption text-xs mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
              or click to browse — JPG, PNG, WEBP supported
            </p>
          </div>
          <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>

        <Input label="Title" type="text" placeholder="e.g. Baby" value={title} onChange={(e) => setTitle(e?.target?.value)} />

        {uploading && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between font-caption text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-muted)' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: 'var(--color-primary)' }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={uploading}>Cancel</Button>
          <Button variant="default" onClick={handleUpload} loading={uploading} disabled={!files?.length || uploading} iconName="Upload" iconPosition="left">
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;