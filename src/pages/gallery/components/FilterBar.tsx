import Icon from '../../../components/AppIcon';

type ViewMode = 'grid' | 'masonry';
type SortOption = 'newest' | 'oldest' | 'title';

interface FilterBarProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'title', label: 'By Title' },
];

const FilterBar = ({ sortBy, onSortChange, viewMode, onViewModeChange }: FilterBarProps) => {
  return (
    <div className="flex flex-col gap-3 mb-6">
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