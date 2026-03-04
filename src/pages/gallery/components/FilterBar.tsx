import Icon from '../../../components/AppIcon';

type ViewMode = 'grid' | 'masonry';
type SortOption = 'newest' | 'oldest' | 'title';

interface FilterBarProps {
  activeAlbum: string;
  onAlbumChange: (album: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onCreateAlbum: () => void;
}


const ALBUMS = ['All', 'Trips', 'Anniversaries', 'Daily Life', 'Milestones', 'Holidays'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'title', label: 'By Title' },
];

const FilterBar = ({ activeAlbum, onAlbumChange, sortBy, onSortChange, viewMode, onViewModeChange, onCreateAlbum }: FilterBarProps) => {
  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* Albums */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {ALBUMS?.map((album) => (
          <button
            key={album}
            onClick={() => onAlbumChange(album)}
            className="flex-shrink-0 px-4 py-2 rounded-full font-caption text-sm font-medium transition-base focus-ring whitespace-nowrap"
            style={{
              backgroundColor: activeAlbum === album ? 'var(--color-primary)' : 'var(--color-muted)',
              color: activeAlbum === album ? 'var(--color-primary-foreground)' : 'var(--color-muted-foreground)',
              minHeight: '36px',
            }}
          >
            {album}
          </button>
        ))}
        <button
          onClick={onCreateAlbum}
          className="flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-full font-caption text-sm font-medium transition-base focus-ring whitespace-nowrap"
          style={{ border: '1.5px dashed var(--color-border)', color: 'var(--color-muted-foreground)', minHeight: '36px' }}
        >
          <Icon name="Plus" size={14} />
          New Album
        </button>
      </div>
      {/* Sort & View */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon name="SlidersHorizontal" size={16} color="var(--color-muted-foreground)" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e?.target?.value as SortOption)}
            className="font-caption text-sm rounded-md px-3 py-1.5 focus-ring"
            style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-foreground)', border: '1px solid var(--color-border)' }}
          >
            {SORT_OPTIONS?.map((opt) => (
              <option key={opt?.value} value={opt?.value}>{opt?.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-md" style={{ backgroundColor: 'var(--color-muted)' }}>
          <button
            onClick={() => onViewModeChange('grid')}
            className="p-1.5 rounded transition-base focus-ring"
            style={{ backgroundColor: viewMode === 'grid' ? 'var(--color-card)' : 'transparent', color: viewMode === 'grid' ? 'var(--color-primary)' : 'var(--color-muted-foreground)' }}
            aria-label="Grid view"
          >
            <Icon name="Grid3X3" size={16} />
          </button>
          <button
            onClick={() => onViewModeChange('masonry')}
            className="p-1.5 rounded transition-base focus-ring"
            style={{ backgroundColor: viewMode === 'masonry' ? 'var(--color-card)' : 'transparent', color: viewMode === 'masonry' ? 'var(--color-primary)' : 'var(--color-muted-foreground)' }}
            aria-label="Masonry view"
          >
            <Icon name="LayoutGrid" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;