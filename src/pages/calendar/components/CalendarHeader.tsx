import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

interface CalendarHeaderProps {
  currentDate: Date;
  view: 'month' | 'week';
  onViewChange: (view: 'month' | 'week') => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onAddEvent: () => void;
}

const CalendarHeader = ({ currentDate, view, onViewChange, onPrev, onNext, onToday, onAddEvent }: CalendarHeaderProps) => {
  const monthLabel = `${MONTHS?.[currentDate?.getMonth()]} ${currentDate?.getFullYear()}`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      {/* Left: Nav */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onPrev} aria-label="Previous">
          <Icon name="ChevronLeft" size={18} />
        </Button>
        <Button variant="outline" size="icon" onClick={onNext} aria-label="Next">
          <Icon name="ChevronRight" size={18} />
        </Button>
        <h2 className="font-heading text-lg md:text-xl font-semibold ml-1" style={{ color: 'var(--color-foreground)' }}>
          {monthLabel}
        </h2>
        <Button variant="ghost" size="sm" onClick={onToday} className="ml-1 hidden sm:inline-flex">
          Today
        </Button>
      </div>
      {/* Right: View toggle + Add */}
      <div className="flex items-center gap-2">
        {/* View toggle */}
        <div
          className="flex rounded-lg overflow-hidden border"
          style={{ borderColor: 'var(--color-border)' }}
        >
          {(['month', 'week'] as const)?.map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className="px-3 py-1.5 text-xs font-caption font-medium capitalize transition-base"
              style={{
                backgroundColor: view === v ? 'var(--color-primary)' : 'var(--color-card)',
                color: view === v ? 'white' : 'var(--color-muted-foreground)',
              }}
            >
              {v}
            </button>
          ))}
        </div>

        <Button
          variant="default"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          onClick={onAddEvent}
        >
          <span className="hidden sm:inline">Add Event</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;