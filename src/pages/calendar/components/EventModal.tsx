import { useState, useEffect, type FormEvent } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { type CalendarEvent } from './UpcomingEvents';

// Malaysia = UTC+8
const toMYTLocal = (isoStr: string): string => {
  const d = new Date(isoStr);
  const myt = new Date(d.getTime() + 8 * 60 * 60 * 1000);
  return myt.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'
};

const fromMYTLocal = (localStr: string): string =>
  new Date(localStr + ':00+08:00').toISOString();

// Current time as 'YYYY-MM-DDTHH:mm' in MYT
const nowMYT = (): string => toMYTLocal(new Date().toISOString());

interface EventForm {
  title: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
}

interface FormErrors {
  title?: string;
  startDateTime?: string;
  endDateTime?: string;
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
    startDateTime: '',
    endDateTime: '',
    location: '',
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
        startDateTime: toMYTLocal(start.toISOString()),
        endDateTime: toMYTLocal(end.toISOString()),
        location: event?.location || '',
      });
    } else {
      const d = selectedDate || new Date();
      const mytDate = toMYTLocal(d.toISOString()).split('T')[0];
      setForm({
        ...defaultForm,
        startDateTime: mytDate + 'T08:00',
        endDateTime: mytDate + 'T09:00',
      });
    }
    setErrors({});
    setShowDeleteConfirm(false);
  }, [isOpen, mode, event, selectedDate]);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    const now = nowMYT();
    if (!form?.title?.trim()) e.title = 'Title is required';
    if (!form?.startDateTime) {
      e.startDateTime = 'Start date & time is required';
    } else if (form.startDateTime < now) {
      e.startDateTime = 'Start time cannot be in the past';
    }
    if (form?.endDateTime && form.endDateTime < now) {
      e.endDateTime = 'End time cannot be in the past';
    }
    if (form?.endDateTime && form?.startDateTime && form.endDateTime < form.startDateTime) {
      e.endDateTime = 'End time must be after start time';
    }
    return e;
  };

  const handleSubmit = (e: FormEvent) => {
    e?.preventDefault();
    const errs = validate();
    if (Object.keys(errs)?.length > 0) { setErrors(errs); return; }

    onSave({
      ...(mode === 'edit' && event ? { id: event?.id } : {}),
      title: form?.title?.trim(),
      startDate: fromMYTLocal(form.startDateTime),
      endDate: form?.endDateTime ? fromMYTLocal(form.endDateTime) : undefined,
      location: form?.location?.trim(),
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
            value={form?.title ?? ''}
            onChange={(e) => handleChange('title', e?.target?.value)}
            error={errors?.title}
            required
          />

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Start Date & Time (MYT)"
              type="datetime-local"
              value={form?.startDateTime ?? ''}
              min={nowMYT()}
              onChange={(e) => handleChange('startDateTime', e?.target?.value)}
              error={errors?.startDateTime}
              required
            />
            <Input
              label="End Date & Time (MYT)"
              type="datetime-local"
              value={form?.endDateTime ?? ''}
              min={form?.startDateTime || nowMYT()}
              onChange={(e) => handleChange('endDateTime', e?.target?.value)}
              error={errors?.endDateTime}
            />
          </div>

          {/* Location */}
          <Input
            label="Location"
            type="text"
            placeholder="e.g., Central Park, New York"
            value={form?.location ?? ''}
            onChange={(e) => handleChange('location', e?.target?.value)}
          />

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