import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

interface EmptyStateProps {
  searchQuery: string;
  onUploadClick: () => void;
}

const EmptyState = ({ searchQuery, onUploadClick }: EmptyStateProps) => {
  const isFiltered = !!searchQuery;

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-muted)' }}
      >
        <Icon name="Images" size={36} color="var(--color-muted-foreground)" />
      </div>
      <div>
        <h3 className="font-heading text-xl mb-2" style={{ color: 'var(--color-foreground)' }}>
          {isFiltered ? 'No photos found' : 'Your gallery is empty'}
        </h3>
        <p className="font-caption text-sm max-w-xs mx-auto" style={{ color: 'var(--color-muted-foreground)' }}>
          {isFiltered
            ? 'Try adjusting your search or filter to find your memories.' :'Start capturing your beautiful moments together by uploading your first photo.'}
        </p>
      </div>
      {!isFiltered && (
        <Button variant="default" iconName="Upload" iconPosition="left" onClick={onUploadClick}>
          Upload Your First Photo
        </Button>
      )}
    </div>
  );
};

export default EmptyState;