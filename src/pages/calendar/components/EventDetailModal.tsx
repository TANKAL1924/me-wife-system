import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { type CalendarEvent } from './UpcomingEvents';

const formatDateTime = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

interface EventDetailModalProps {
  isOpen: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}

const EventDetailModal = ({ isOpen, event, onClose, onEdit, onDelete }: EventDetailModalProps) => {
  if (!isOpen || !event) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(44,24,16,0.5)', zIndex: 'var(--z-modal)' }}
      onClick={(e) => e?.target === e?.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-xl shadow-warm-xl overflow-hidden"
        style={{ backgroundColor: 'var(--color-card)' }}
      >
        {/* Color bar */}
        <div className="h-1.5 w-full" style={{ backgroundColor: 'var(--color-primary)' }} />

        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(212,118,26,0.08)' }}
            >
              <Icon name="Calendar" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold leading-tight" style={{ color: 'var(--color-foreground)' }}>
                {event?.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-base hover:bg-orange-50 flex-shrink-0"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Details */}
        <div className="px-5 pb-4 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <Icon name="Clock" size={16} color="var(--color-muted-foreground)" className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-caption" style={{ color: 'var(--color-foreground)' }}>
                {formatDateTime(event?.startDate)}
              </p>
              {event?.endDate && (
                <p className="text-xs font-caption mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                  Until {formatDateTime(event.endDate)}
                </p>
              )}
            </div>
          </div>

          {event?.location && (
            <div className="flex items-start gap-3">
              <Icon name="MapPin" size={16} color="var(--color-muted-foreground)" className="mt-0.5 flex-shrink-0" />
              <p className="text-sm font-caption" style={{ color: 'var(--color-foreground)' }}>{event?.location}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          className="flex items-center justify-end gap-2 px-5 py-3 border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <Button variant="ghost" size="sm" iconName="Trash2" iconPosition="left" onClick={() => onDelete(event?.id)} className="text-red-600">
            Delete
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          <Button variant="default" size="sm" iconName="Pencil" iconPosition="left" onClick={() => onEdit(event)}>
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;