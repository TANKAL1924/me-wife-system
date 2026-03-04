import { useState, useEffect, type FormEvent } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { type CalendarEvent, type EventCategory } from './UpcomingEvents';

const CATEGORIES = [
  { value: 'date', label: '💕 Date Night', color: '#FF6B35' },
  { value: 'appointment', label: '🏥 Appointment', color: '#3B82F6' },
  { value: 'travel', label: '✈️ Travel', color: '#B8860B' },
  { value: 'anniversary', label: '⭐ Anniversary', color: '#8B5CF6' },
  { value: 'other', label: '📅 Other', color: '#2D5016' },
];

interface EventForm {
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  description: string;
  category: EventCategory;
  allDay: boolean;
}

interface FormErrors {
  title?: string;
  startDate?: string;
}

interface EventModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  event: CalendarEvent | null;
  selectedDate: Date | null;
  onClose: () => void;
  onSave: (data: Omit<CalendarEvent, 'id'> & { id?: string }) => void;
  onDelete: (id: string) => void;
}

const EventModal = ({ isOpen, mode, event, selectedDate, onClose, onSave, onDelete }: EventModalProps) => {
  const defaultForm = {
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    description: '',
    category: 'other' as EventCategory,
    allDay: false,
  };

  const [form, setForm] = useState<EventForm>(defaultForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && event) {
      const start = new Date(event.startDate);
      const end = event?.endDate ? new Date(event.endDate) : start;
      setForm({
        title: event?.title || '',
        startDate: start?.toISOString()?.split('T')?.[0],
        startTime: event?.allDay ? '' : start?.toTimeString()?.slice(0, 5),
        endDate: end?.toISOString()?.split('T')?.[0],
        endTime: event?.allDay ? '' : end?.toTimeString()?.slice(0, 5),
        location: event?.location || '',
        description: event?.description || '',
        category: event?.category || 'other',
        allDay: event?.allDay || false,
      });
    } else {
      const d = selectedDate || new Date();
      setForm({
        ...defaultForm,
        startDate: d?.toISOString()?.split('T')?.[0],
        endDate: d?.toISOString()?.split('T')?.[0],
      });
    }
    setErrors({});
    setShowDeleteConfirm(false);
  }, [isOpen, mode, event, selectedDate]);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form?.title?.trim()) e.title = 'Title is required';
    if (!form?.startDate) e.startDate = 'Start date is required';
    return e;
  };

  const handleSubmit = (e: FormEvent) => {
    e?.preventDefault();
    const errs = validate();
    if (Object.keys(errs)?.length > 0) { setErrors(errs); return; }

    const startDateTime = form?.allDay
      ? new Date(form.startDate + 'T00:00:00')
      : new Date(`${form.startDate}T${form.startTime || '00:00'}`);
    const endDateTime = form?.allDay
      ? new Date(form.endDate + 'T23:59:59')
      : new Date(`${form.endDate || form.startDate}T${form.endTime || form.startTime || '01:00'}`);

    onSave({
      ...(mode === 'edit' && event ? { id: event?.id } : {}),
      title: form?.title?.trim(),
      startDate: startDateTime?.toISOString(),
      endDate: endDateTime?.toISOString(),
      location: form?.location?.trim(),
      description: form?.description?.trim(),
      category: form?.category,
      allDay: form?.allDay,
    });
  };

  const handleChange = (field: keyof EventForm, value: EventForm[keyof EventForm]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors?.[field as keyof FormErrors]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(44,24,16,0.5)', zIndex: 'var(--z-modal)' }}
      onClick={(e) => e?.target === e?.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-xl shadow-warm-xl overflow-hidden"
        style={{ backgroundColor: 'var(--color-card)', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <h2 className="font-heading text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>
            {mode === 'edit' ? 'Edit Event' : 'Add New Event'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-base hover:bg-orange-50"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* Title */}
          <Input
            label="Event Title"
            type="text"
            placeholder="e.g., Dinner at Rosewood"
            value={form?.title}
            onChange={(e) => handleChange('title', e?.target?.value)}
            error={errors?.title}
            required
          />

          {/* Category */}
          <div>
            <label className="block text-sm font-caption font-medium mb-2" style={{ color: 'var(--color-foreground)' }}>
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES?.map((cat) => (
                <button
                  key={cat?.value}
                  type="button"
                  onClick={() => handleChange('category', cat?.value)}
                  className="px-3 py-1.5 rounded-full text-xs font-caption font-medium border transition-base"
                  style={{
                    backgroundColor: form?.category === cat?.value ? cat?.color : 'transparent',
                    borderColor: cat?.color,
                    color: form?.category === cat?.value ? 'white' : cat?.color,
                  }}
                >
                  {cat?.label}
                </button>
              ))}
            </div>
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleChange('allDay', !form?.allDay)}
              className="w-10 h-5 rounded-full transition-base relative flex-shrink-0"
              style={{ backgroundColor: form?.allDay ? 'var(--color-primary)' : 'var(--color-muted)' }}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-base"
                style={{ left: form?.allDay ? '22px' : '2px' }}
              />
            </button>
            <span className="text-sm font-caption" style={{ color: 'var(--color-foreground)' }}>All day event</span>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={form?.startDate}
              onChange={(e) => handleChange('startDate', e?.target?.value)}
              error={errors?.startDate}
              required
            />
            {!form?.allDay && (
              <Input
                label="Start Time"
                type="time"
                value={form?.startTime}
                onChange={(e) => handleChange('startTime', e?.target?.value)}
              />
            )}
            <Input
              label="End Date"
              type="date"
              value={form?.endDate}
              onChange={(e) => handleChange('endDate', e?.target?.value)}
            />
            {!form?.allDay && (
              <Input
                label="End Time"
                type="time"
                value={form?.endTime}
                onChange={(e) => handleChange('endTime', e?.target?.value)}
              />
            )}
          </div>

          {/* Location */}
          <Input
            label="Location"
            type="text"
            placeholder="e.g., Central Park, New York"
            value={form?.location}
            onChange={(e) => handleChange('location', e?.target?.value)}
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-caption font-medium mb-1" style={{ color: 'var(--color-foreground)' }}>
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Add notes or details..."
              value={form?.description}
              onChange={(e) => handleChange('description', e?.target?.value)}
              className="w-full rounded-lg px-3 py-2 text-sm font-caption resize-none focus:outline-none focus:ring-2 border"
              style={{
                backgroundColor: 'var(--color-input)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
              }}
            />
          </div>

          {/* Delete confirm */}
          {showDeleteConfirm && (
            <div
              className="rounded-lg p-3 border flex items-center justify-between gap-3"
              style={{ backgroundColor: 'rgba(160,82,45,0.08)', borderColor: 'var(--color-error)' }}
            >
              <p className="text-sm font-caption" style={{ color: 'var(--color-error)' }}>
                Delete this event permanently?
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" size="xs" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                <Button variant="destructive" size="xs" onClick={() => onDelete(event!.id)}>Delete</Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            {mode === 'edit' && !showDeleteConfirm && (
              <Button
                variant="ghost"
                size="sm"
                iconName="Trash2"
                iconPosition="left"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600"
              >
                Delete
              </Button>
            )}
            <div className={`flex gap-2 ${mode !== 'edit' || showDeleteConfirm ? 'ml-auto' : ''}`}>
              <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
              <Button variant="default" size="sm" type="submit" iconName="Check" iconPosition="left">
                {mode === 'edit' ? 'Save Changes' : 'Add Event'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;