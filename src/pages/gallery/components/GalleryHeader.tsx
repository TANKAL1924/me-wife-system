import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

interface GalleryHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onUploadClick: () => void;
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkDownload: () => void;
  onClearSelection: () => void;
}

const GalleryHeader = ({ searchQuery, onSearchChange, onUploadClick, selectedCount, onBulkDelete, onBulkDownload, onClearSelection }: GalleryHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl" style={{ color: 'var(--color-foreground)' }}>
            Our Gallery
          </h1>
          <p className="font-caption text-sm md:text-base mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
            Cherish every moment together
          </p>
        </div>
        <Button
          variant="default"
          iconName="Upload"
          iconPosition="left"
          onClick={onUploadClick}
          size="default"
        >
          Upload Photos
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="w-full sm:max-w-xs">
          <Input
            type="search"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e?.target?.value)}
          />
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-caption text-sm px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(212,118,26,0.12)', color: 'var(--color-primary)' }}>
              {selectedCount} selected
            </span>
            <Button variant="outline" size="sm" iconName="Download" iconPosition="left" onClick={onBulkDownload}>
              Download
            </Button>
            <Button variant="destructive" size="sm" iconName="Trash2" iconPosition="left" onClick={onBulkDelete}>
              Delete
            </Button>
            <Button variant="ghost" size="sm" onClick={onClearSelection}>
              Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryHeader;