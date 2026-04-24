import { useEffect, useState } from 'react';
import AppShell from '../../components/ui/AppShell';
import Icon from '../../components/AppIcon';
import { useAuthStore } from '../../store/authStore';
import {
  fetchStudyRecords,
  createStudyRecord,
  updateStudyRecord,
  deleteStudyRecord,
  type StudyRecord,
} from './service/studyService';
import {
  fetchExperienceRecords,
  createExperienceRecord,
  updateExperienceRecord,
  deleteExperienceRecord,
  type ExperienceRecord,
} from './service/experienceService';
import {
  fetchSkillRecords,
  createSkillRecord,
  deleteSkillRecord,
  type SkillRecord,
} from './service/skillService';
import {
  fetchLanguageRecords,
  createLanguageRecord,
  deleteLanguageRecord,
  type LanguageRecord,
} from './service/languageService';

// ─── Types ────────────────────────────────────────────────────────────────────

type LocalStudyRecord = Omit<StudyRecord, 'id' | 'created_at'> & { id: number; isNew: true };
type AnyStudyRecord = StudyRecord | LocalStudyRecord;

type LocalExperienceRecord = Omit<ExperienceRecord, 'id' | 'created_at'> & { id: number; isNew: true };
type AnyExperienceRecord = ExperienceRecord | LocalExperienceRecord;

// ─── StudyCard ────────────────────────────────────────────────────────────────

interface StudyCardProps {
  record: AnyStudyRecord;
  userId: number | null;
  onCreated: (tempId: number, saved: StudyRecord) => void;
  onSaved: (updated: StudyRecord) => void;
  onDelete: (id: number) => void;
}

const StudyCard = ({ record, userId, onCreated, onSaved, onDelete }: StudyCardProps) => {
  const isNew = 'isNew' in record && record.isNew;

  const [expanded, setExpanded] = useState(isNew);
  const [form, setForm] = useState({
    uni_name: record.uni_name ?? '',
    course: record.course ?? '',
    description: record.description ?? '',
    start_date: record.start_date ?? '',
    end_date: record.end_date ?? '',
    cgpa: record.cgpa !== null ? String(record.cgpa) : '',
    location: record.location ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
    setCardError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setCardError(null);

    const payload = {
      uni_name: form.uni_name || null,
      course: form.course || null,
      description: form.description || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      cgpa: form.cgpa !== '' ? parseFloat(form.cgpa) : null,
      location: form.location || null,
    };

    if (isNew) {
      if (!userId) {
        setCardError('User session not ready. Please wait a moment and try again.');
        setSaving(false);
        return;
      }
      const { data, error } = await createStudyRecord({ ...payload, user_id: userId, achievement: null });
      if (error || !data) {
        setCardError(error ?? 'Failed to save. Please try again.');
        setSaving(false);
        return;
      }
      setSaving(false);
      setSaved(true);
      setExpanded(false);
      onCreated(record.id, data);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const { data, error } = await updateStudyRecord(record.id, payload);
      if (error || !data) {
        setCardError(error ?? 'Failed to update. Please try again.');
        setSaving(false);
        return;
      }
      setSaving(false);
      setSaved(true);
      setExpanded(false);
      onSaved(data);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  // Format date for display: "2019-01-01" → "Jan 2019"
  const fmtDate = (d: string | null) => {
    if (!d) return null;
    const dt = new Date(d);
    return dt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const dateRange = [fmtDate(form.start_date), fmtDate(form.end_date)].filter(Boolean).join(' – ');

  const inputCls = [
    'w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors',
    'bg-[var(--color-background)] border border-[var(--color-border)]',
    'text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]',
    'focus:border-[var(--color-primary)]',
  ].join(' ');

  return (
    <div
      className="rounded-2xl overflow-hidden transition-shadow"
      style={{
        backgroundColor: 'var(--color-card)',
        border: isNew ? '1.5px dashed var(--color-primary)' : '1px solid var(--color-border)',
        boxShadow: expanded ? '0 4px 16px rgba(0,0,0,0.07)' : 'none',
      }}
    >
      {/* ── Card header (always visible) ── */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-black/5 transition-colors"
      >
        <div
          className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
        >
          <Icon name="GraduationCap" size={18} color="white" strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-heading text-sm font-semibold truncate" style={{ color: 'var(--color-foreground)' }}>
            {form.uni_name || <span style={{ color: 'var(--color-muted-foreground)', fontWeight: 400 }}>Untitled Institution</span>}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {form.course && (
              <span className="font-caption text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                {form.course}
              </span>
            )}
            {form.course && dateRange && (
              <span style={{ color: 'var(--color-border)' }}>·</span>
            )}
            {dateRange && (
              <span className="font-caption text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                {dateRange}
              </span>
            )}
            {form.cgpa && (
              <>
                <span style={{ color: 'var(--color-border)' }}>·</span>
                <span
                  className="font-caption text-xs font-medium px-1.5 py-0.5 rounded-md"
                  style={{ backgroundColor: 'rgba(212,118,26,0.12)', color: 'var(--color-primary)' }}
                >
                  CGPA {form.cgpa}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {saved && !expanded && (
            <span
              className="font-caption text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#16a34a' }}
            >
              <Icon name="Check" size={11} strokeWidth={2.5} />
              Saved
            </span>
          )}
          <Icon
            name={expanded ? 'ChevronUp' : 'ChevronDown'}
            size={16}
            color="var(--color-muted-foreground)"
            strokeWidth={2}
          />
        </div>
      </button>

      {/* ── Expandable form ── */}
      {expanded && (
        <div className="px-5 pb-5 flex flex-col gap-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          {isNew && (
            <p className="text-xs font-caption pt-3" style={{ color: 'var(--color-primary)' }}>
              New entry — fill in the details and click Save
            </p>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-3">
            {/* University */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
                University / Institution
              </label>
              <input className={inputCls} value={form.uni_name} onChange={e => handleChange('uni_name', e.target.value)} placeholder="e.g. MIT" />
            </div>

            {/* Course */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
                Course / Degree
              </label>
              <input className={inputCls} value={form.course} onChange={e => handleChange('course', e.target.value)} placeholder="e.g. Bachelor of Computer Science" />
            </div>

            {/* Location + CGPA */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
                Location
              </label>
              <input className={inputCls} value={form.location} onChange={e => handleChange('location', e.target.value)} placeholder="e.g. Shah Alam, MY" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
                CGPA
              </label>
              <input className={inputCls} type="number" step="0.01" min="0" max="4" value={form.cgpa} onChange={e => handleChange('cgpa', e.target.value)} placeholder="e.g. 3.8" />
            </div>

            {/* Dates */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
                Start Date
              </label>
              <input className={inputCls} type="date" value={form.start_date} onChange={e => handleChange('start_date', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
                End Date
              </label>
              <input className={inputCls} type="date" value={form.end_date} onChange={e => handleChange('end_date', e.target.value)} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
              Description
            </label>
            <textarea
              className={inputCls}
              style={{ resize: 'vertical', minHeight: '80px' }}
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Briefly describe your studies or key achievements…"
            />
          </div>

          {cardError && (
            <p className="text-xs font-caption -mt-1" style={{ color: '#ef4444' }}>{cardError}</p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              onClick={() => onDelete(record.id)}
              className="flex items-center gap-1.5 text-sm font-caption px-3 py-2 rounded-xl transition-colors"
              style={{ color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)' }}
            >
              <Icon name="Trash2" size={14} strokeWidth={2} />
              {isNew ? 'Discard' : 'Delete'}
            </button>

            <div className="flex items-center gap-2">
              {!isNew && (
                <button
                  onClick={() => setExpanded(false)}
                  className="text-sm font-caption px-3 py-2 rounded-xl transition-colors"
                  style={{ color: 'var(--color-muted-foreground)', backgroundColor: 'var(--color-background)' }}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 text-sm font-caption font-semibold px-5 py-2 rounded-xl disabled:opacity-60 transition-opacity"
                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
              >
                {saving
                  ? <Icon name="Loader2" size={14} strokeWidth={2} className="animate-spin" />
                  : saved
                    ? <Icon name="Check" size={14} strokeWidth={2.5} />
                    : <Icon name="Save" size={14} strokeWidth={2} />}
                {saving ? 'Saving…' : saved ? 'Saved!' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── ExperienceCard ──────────────────────────────────────────────────────────

interface ExperienceCardProps {
  record: AnyExperienceRecord;
  userId: number | null;
  onCreated: (tempId: number, saved: ExperienceRecord) => void;
  onSaved: (updated: ExperienceRecord) => void;
  onDelete: (id: number) => void;
}

// ─── Description types ────────────────────────────────────────────────────────

interface WorkItem { work: string; }
interface ProjectEntry { project: string; work_list: WorkItem[]; }

/** Parse raw JSONB into ProjectEntry[]. Supports both formats. */
function parseDescriptionJson(raw: unknown): ProjectEntry[] {
  const arr = (() => {
    if (!raw) return [];
    if (typeof raw === 'string') { try { return JSON.parse(raw); } catch { return []; } }
    if (Array.isArray(raw)) return raw;
    return [];
  })() as unknown[];

  if (arr.length === 0) return [{ project: '', work_list: [{ work: '' }] }];

  // Complex format: [{project, work_list}]
  if (arr[0] && typeof arr[0] === 'object' && 'project' in (arr[0] as object)) {
    return (arr as ProjectEntry[]).map(p => ({
      project: p.project ?? '',
      work_list: Array.isArray(p.work_list) && p.work_list.length > 0
        ? p.work_list.map(w => ({ work: w.work ?? '' }))
        : [{ work: '' }],
    }));
  }

  // Simple format: [{work}] — treat as a single unnamed project
  return [{ project: '', work_list: (arr as WorkItem[]).map(w => ({ work: w.work ?? '' })) }];
}

const ExperienceCard = ({ record, userId, onCreated, onSaved, onDelete }: ExperienceCardProps) => {
  const isNew = 'isNew' in record && record.isNew;

  const [expanded, setExpanded] = useState(isNew);
  const [form, setForm] = useState({
    company_name: record.company_name ?? '',
    title_company: record.title_company ?? '',
    start_date: record.start_date ?? '',
    end_date: record.end_date ?? '',
  });
  const [projects, setProjects] = useState<ProjectEntry[]>(() =>
    parseDescriptionJson(record.description)
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleFormChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
    setCardError(null);
  };

  // Project-level helpers
  const updateProjectName = (pi: number, value: string) =>
    setProjects(prev => prev.map((p, i) => i === pi ? { ...p, project: value } : p));

  const addProject = () =>
    setProjects(prev => [...prev, { project: '', work_list: [{ work: '' }] }]);

  const removeProject = (pi: number) =>
    setProjects(prev => prev.length > 1 ? prev.filter((_, i) => i !== pi) : prev);

  // Work-item helpers
  const updateWork = (pi: number, wi: number, value: string) =>
    setProjects(prev => prev.map((p, i) =>
      i !== pi ? p : { ...p, work_list: p.work_list.map((w, j) => j === wi ? { work: value } : w) }
    ));

  const addWork = (pi: number) =>
    setProjects(prev => prev.map((p, i) =>
      i !== pi ? p : { ...p, work_list: [...p.work_list, { work: '' }] }
    ));

  const removeWork = (pi: number, wi: number) =>
    setProjects(prev => prev.map((p, i) =>
      i !== pi ? p : { ...p, work_list: p.work_list.length > 1 ? p.work_list.filter((_, j) => j !== wi) : p.work_list }
    ));

  const buildDescription = (): ProjectEntry[] | WorkItem[] | null => {
    const clean = projects
      .map(p => ({ ...p, work_list: p.work_list.filter(w => w.work.trim()) }))
      .filter(p => p.work_list.length > 0);
    if (clean.length === 0) return null;
    // If all projects are unnamed → save as simple [{work}] format
    if (clean.every(p => !p.project.trim())) return clean.flatMap(p => p.work_list);
    return clean;
  };

  const handleSave = async () => {
    setSaving(true);
    setCardError(null);
    const payload: Partial<ExperienceRecord> = {
      company_name: form.company_name || null,
      title_company: form.title_company || null,
      description: buildDescription(),
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    };
    if (isNew) {
      if (!userId) { setCardError('User session not ready.'); setSaving(false); return; }
      const { data, error } = await createExperienceRecord({ ...payload, user_id: userId } as ExperienceRecord);
      if (error || !data) { setCardError(error ?? 'Failed to save.'); setSaving(false); return; }
      setSaving(false); setSaved(true); setExpanded(false);
      onCreated(record.id, data);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const { data, error } = await updateExperienceRecord(record.id, payload);
      if (error || !data) { setCardError(error ?? 'Failed to update.'); setSaving(false); return; }
      setSaving(false); setSaved(true); setExpanded(false);
      onSaved(data);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : null;

  const dateRange = [fmtDate(form.start_date), fmtDate(form.end_date)].filter(Boolean).join(' – ');
  const totalWorks = projects.reduce((n, p) => n + p.work_list.filter(w => w.work.trim()).length, 0);
  const projectCount = projects.filter(p => p.project.trim()).length;

  const inputCls = [
    'w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors',
    'bg-[var(--color-background)] border border-[var(--color-border)]',
    'text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]',
    'focus:border-[var(--color-primary)]',
  ].join(' ');

  return (
    <div
      className="rounded-2xl overflow-hidden transition-shadow"
      style={{
        backgroundColor: 'var(--color-card)',
        border: isNew ? '1.5px dashed var(--color-primary)' : '1px solid var(--color-border)',
        boxShadow: expanded ? '0 4px 16px rgba(0,0,0,0.07)' : 'none',
      }}
    >
      {/* ── Card header ── */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-black/5 transition-colors"
      >
        <div
          className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
        >
          <Icon name="Briefcase" size={18} color="white" strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-heading text-sm font-semibold truncate" style={{ color: 'var(--color-foreground)' }}>
            {form.company_name || <span style={{ color: 'var(--color-muted-foreground)', fontWeight: 400 }}>Untitled Company</span>}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {form.title_company && (
              <span className="font-caption text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{form.title_company}</span>
            )}
            {form.title_company && dateRange && <span style={{ color: 'var(--color-border)' }}>·</span>}
            {dateRange && (
              <span className="font-caption text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{dateRange}</span>
            )}
            {projectCount > 0 && (
              <>
                <span style={{ color: 'var(--color-border)' }}>·</span>
                <span className="font-caption text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  {projectCount} {projectCount === 1 ? 'project' : 'projects'}
                </span>
              </>
            )}
            {totalWorks > 0 && (
              <>
                <span style={{ color: 'var(--color-border)' }}>·</span>
                <span className="font-caption text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  {totalWorks} {totalWorks === 1 ? 'task' : 'tasks'}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {saved && !expanded && (
            <span
              className="font-caption text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#16a34a' }}
            >
              <Icon name="Check" size={11} strokeWidth={2.5} />
              Saved
            </span>
          )}
          <Icon name={expanded ? 'ChevronUp' : 'ChevronDown'} size={16} color="var(--color-muted-foreground)" strokeWidth={2} />
        </div>
      </button>

      {/* ── Expandable form ── */}
      {expanded && (
        <div className="px-5 pb-5 flex flex-col gap-5" style={{ borderTop: '1px solid var(--color-border)' }}>
          {isNew && (
            <p className="text-xs font-caption pt-3" style={{ color: 'var(--color-primary)' }}>
              New entry — fill in the details and click Save
            </p>
          )}

          {/* Basic fields */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted-foreground)' }}>Company Name</label>
              <input className={inputCls} value={form.company_name} onChange={e => handleFormChange('company_name', e.target.value)} placeholder="e.g. Accenture" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted-foreground)' }}>Job Title</label>
              <input className={inputCls} value={form.title_company} onChange={e => handleFormChange('title_company', e.target.value)} placeholder="e.g. Software Engineer" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted-foreground)' }}>Start Date</label>
              <input className={inputCls} type="date" value={form.start_date} onChange={e => handleFormChange('start_date', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted-foreground)' }}>End Date</label>
              <input className={inputCls} type="date" value={form.end_date} onChange={e => handleFormChange('end_date', e.target.value)} />
            </div>
          </div>

          {/* Projects + work items */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
                Projects &amp; Responsibilities
              </label>
              <button
                onClick={addProject}
                className="flex items-center gap-1 text-xs font-caption font-medium px-2.5 py-1 rounded-lg"
                style={{ backgroundColor: 'rgba(212,118,26,0.10)', color: 'var(--color-primary)' }}
              >
                <Icon name="Plus" size={12} strokeWidth={2.5} />
                Add Project
              </button>
            </div>

            {projects.map((proj, pi) => (
              <div
                key={pi}
                className="rounded-xl flex flex-col gap-3 p-4"
                style={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)' }}
              >
                {/* Project name row */}
                <div className="flex items-center gap-2">
                  <input
                    className={inputCls}
                    value={proj.project}
                    onChange={e => updateProjectName(pi, e.target.value)}
                    placeholder="Project name (optional — leave blank for general tasks)"
                  />
                  {projects.length > 1 && (
                    <button
                      onClick={() => removeProject(pi)}
                      className="flex-shrink-0 p-1.5 rounded-lg transition-colors"
                      style={{ color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)' }}
                    >
                      <Icon name="X" size={14} strokeWidth={2} />
                    </button>
                  )}
                </div>

                {/* Work items */}
                <div className="flex flex-col gap-2 pl-2">
                  {proj.work_list.map((w, wi) => (
                    <div key={wi} className="flex items-start gap-2">
                      <span
                        className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      />
                      <input
                        className={inputCls}
                        value={w.work}
                        onChange={e => updateWork(pi, wi, e.target.value)}
                        placeholder="Describe a responsibility or achievement…"
                      />
                      {proj.work_list.length > 1 && (
                        <button
                          onClick={() => removeWork(pi, wi)}
                          className="flex-shrink-0 mt-1 p-1.5 rounded-lg transition-colors"
                          style={{ color: 'var(--color-muted-foreground)', backgroundColor: 'transparent' }}
                        >
                          <Icon name="Minus" size={13} strokeWidth={2} />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={() => addWork(pi)}
                    className="flex items-center gap-1 self-start text-xs font-caption mt-1 px-2 py-1 rounded-lg"
                    style={{ color: 'var(--color-primary)', backgroundColor: 'rgba(212,118,26,0.07)' }}
                  >
                    <Icon name="Plus" size={11} strokeWidth={2.5} />
                    Add task
                  </button>
                </div>
              </div>
            ))}
          </div>

          {cardError && (
            <p className="text-xs font-caption" style={{ color: '#ef4444' }}>{cardError}</p>
          )}

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => onDelete(record.id)}
              className="flex items-center gap-1.5 text-sm font-caption px-3 py-2 rounded-xl transition-colors"
              style={{ color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)' }}
            >
              <Icon name="Trash2" size={14} strokeWidth={2} />
              {isNew ? 'Discard' : 'Delete'}
            </button>
            <div className="flex items-center gap-2">
              {!isNew && (
                <button
                  onClick={() => setExpanded(false)}
                  className="text-sm font-caption px-3 py-2 rounded-xl"
                  style={{ color: 'var(--color-muted-foreground)', backgroundColor: 'var(--color-background)' }}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 text-sm font-caption font-semibold px-5 py-2 rounded-xl disabled:opacity-60 transition-opacity"
                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
              >
                {saving
                  ? <Icon name="Loader2" size={14} strokeWidth={2} className="animate-spin" />
                  : saved
                    ? <Icon name="Check" size={14} strokeWidth={2.5} />
                    : <Icon name="Save" size={14} strokeWidth={2} />}
                {saving ? 'Saving…' : saved ? 'Saved!' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const PortfolioResumeSettings = () => {
  const { user, loading: authLoading } = useAuthStore();

  const [studyRecords, setStudyRecords] = useState<AnyStudyRecord[]>([]);
  const [expRecords, setExpRecords] = useState<AnyExperienceRecord[]>([]);
  const [skillRecords, setSkillRecords] = useState<SkillRecord[]>([]);
  const [langRecords, setLangRecords] = useState<LanguageRecord[]>([]);
  const [publicUserId, setPublicUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingSkillType, setAddingSkillType] = useState<'tech' | 'personal' | null>(null);
  const [newSkillText, setNewSkillText] = useState('');
  const [addingSkillSaving, setAddingSkillSaving] = useState(false);
  const [addingLang, setAddingLang] = useState(false);
  const [newLangText, setNewLangText] = useState('');
  const [newProfText, setNewProfText] = useState('');
  const [addingLangSaving, setAddingLangSaving] = useState(false);

  useEffect(() => {
    if (authLoading) { setLoading(true); return; }
    if (!user?.id) { setLoading(false); return; }
    setLoading(true);
    Promise.all([
      fetchStudyRecords(user.id),
      fetchExperienceRecords(user.id),
      fetchSkillRecords(user.id),
      fetchLanguageRecords(user.id),
    ]).then(([study, exp, skills, langs]) => {
      setStudyRecords(study.data);
      setExpRecords(exp.data);
      setSkillRecords(skills.data);
      setLangRecords(langs.data);
      setPublicUserId(study.userId ?? exp.userId ?? skills.userId ?? langs.userId);
      if (study.error) setError(study.error);
      if (exp.error) setError(exp.error);
      if (skills.error) setError(skills.error);
      if (langs.error) setError(langs.error);
      setLoading(false);
    });
  }, [user?.id, authLoading]);

  // ── Study handlers ──
  const handleAddStudy = () => {
    const tempId = -Date.now();
    setStudyRecords(prev => [{ id: tempId, isNew: true, user_id: publicUserId, uni_name: null, course: null, description: null, start_date: null, end_date: null, cgpa: null, location: null, achievement: null } as LocalStudyRecord, ...prev]);
  };
  const handleStudyCreated = (tempId: number, saved: StudyRecord) =>
    setStudyRecords(prev => prev.map(r => (r.id === tempId ? saved : r)));
  const handleStudySaved = (updated: StudyRecord) =>
    setStudyRecords(prev => prev.map(r => (r.id === updated.id ? updated : r)));
  const handleStudyDelete = async (id: number) => {
    if (id < 0) { setStudyRecords(prev => prev.filter(r => r.id !== id)); return; }
    const { error: e } = await deleteStudyRecord(id);
    if (!e) setStudyRecords(prev => prev.filter(r => r.id !== id));
    else setError(e);
  };

  // ── Experience handlers ──
  const handleAddExp = () => {
    const tempId = -Date.now();
    setExpRecords(prev => [{ id: tempId, isNew: true, user_id: publicUserId, company_name: null, title_company: null, description: null, start_date: null, end_date: null } as LocalExperienceRecord, ...prev]);
  };
  const handleExpCreated = (tempId: number, saved: ExperienceRecord) =>
    setExpRecords(prev => prev.map(r => (r.id === tempId ? saved : r)));
  const handleExpSaved = (updated: ExperienceRecord) =>
    setExpRecords(prev => prev.map(r => (r.id === updated.id ? updated : r)));
  const handleExpDelete = async (id: number) => {
    if (id < 0) { setExpRecords(prev => prev.filter(r => r.id !== id)); return; }
    const { error: e } = await deleteExperienceRecord(id);
    if (!e) setExpRecords(prev => prev.filter(r => r.id !== id));
    else setError(e);
  };

  // ── Skill handlers ──
  const handleSkillAdd = async () => {
    if (!newSkillText.trim() || !addingSkillType || !publicUserId) return;
    setAddingSkillSaving(true);
    const { data, error: e } = await createSkillRecord({
      user_id: publicUserId,
      skills: newSkillText.trim(),
      type: addingSkillType,
    });
    setAddingSkillSaving(false);
    if (data) {
      setSkillRecords(prev => [...prev, data]);
      setNewSkillText('');
      setAddingSkillType(null);
    } else if (e) setError(e);
  };
  const handleSkillDelete = async (id: number) => {
    const { error: e } = await deleteSkillRecord(id);
    if (!e) setSkillRecords(prev => prev.filter(r => r.id !== id));
    else setError(e);
  };

  // ── Language handlers ──
  const handleLangAdd = async () => {
    if (!newLangText.trim() || !publicUserId) return;
    setAddingLangSaving(true);
    const { data, error: e } = await createLanguageRecord({
      user_id: publicUserId,
      language: newLangText.trim(),
      proficient: newProfText.trim() || null,
    });
    setAddingLangSaving(false);
    if (data) {
      setLangRecords(prev => [...prev, data]);
      setNewLangText('');
      setNewProfText('');
      setAddingLang(false);
    } else if (e) setError(e);
  };
  const handleLangDelete = async (id: number) => {
    const { error: e } = await deleteLanguageRecord(id);
    if (!e) setLangRecords(prev => prev.filter(r => r.id !== id));
    else setError(e);
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 mt-14 md:mt-0 mb-16 md:mb-0">

        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
            >
              <Icon name="Briefcase" size={18} color="white" strokeWidth={2.5} />
            </div>
            <h1 className="font-heading text-xl md:text-2xl font-semibold" style={{ color: 'var(--color-foreground)' }}>
              Portfolio &amp; Resume Settings
            </h1>
          </div>
          <p className="font-caption text-sm ml-12" style={{ color: 'var(--color-muted-foreground)' }}>
            Manage your individual professional profiles and portfolio links.
          </p>
        </div>

        {/* Education / Study Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading text-base font-semibold" style={{ color: 'var(--color-foreground)' }}>Education</h2>
              <p className="font-caption text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>Your academic background and qualifications</p>
            </div>
            <button
              onClick={handleAddStudy}
              className="flex items-center gap-1.5 text-sm font-caption font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: 'white' }}
            >
              <Icon name="Plus" size={14} strokeWidth={2.5} />
              Add Education
            </button>
          </div>

          {error && (
            <p className="text-sm font-caption mb-3" style={{ color: '#ef4444' }}>{error}</p>
          )}

          {loading ? (
            <div className="flex items-center gap-2 py-6" style={{ color: 'var(--color-muted-foreground)' }}>
              <Icon name="Loader2" size={16} strokeWidth={2} className="animate-spin" />
              <span className="font-caption text-sm">Loading education records…</span>
            </div>
          ) : studyRecords.length === 0 ? (
            <div
              className="rounded-2xl px-6 py-12 text-center"
              style={{ backgroundColor: 'var(--color-card)', border: '1px dashed var(--color-border)' }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
              >
                <Icon name="GraduationCap" size={24} color="white" strokeWidth={2} />
              </div>
              <p className="font-heading text-sm font-semibold mb-1" style={{ color: 'var(--color-foreground)' }}>No education records yet</p>
              <p className="font-caption text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                Click <strong>Add Education</strong> to add your academic background.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {studyRecords.map(record => (
                <StudyCard
                  key={record.id}
                  record={record}
                  userId={publicUserId}
                  onCreated={handleStudyCreated}
                  onSaved={handleStudySaved}
                  onDelete={handleStudyDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Experience Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading text-base font-semibold" style={{ color: 'var(--color-foreground)' }}>Work Experience</h2>
              <p className="font-caption text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>Your professional career history</p>
            </div>
            <button
              onClick={handleAddExp}
              className="flex items-center gap-1.5 text-sm font-caption font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: 'white' }}
            >
              <Icon name="Plus" size={14} strokeWidth={2.5} />
              Add Experience
            </button>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 py-6" style={{ color: 'var(--color-muted-foreground)' }}>
              <Icon name="Loader2" size={16} strokeWidth={2} className="animate-spin" />
              <span className="font-caption text-sm">Loading experience records…</span>
            </div>
          ) : expRecords.length === 0 ? (
            <div
              className="rounded-2xl px-6 py-12 text-center"
              style={{ backgroundColor: 'var(--color-card)', border: '1px dashed var(--color-border)' }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
              >
                <Icon name="Briefcase" size={24} color="white" strokeWidth={2} />
              </div>
              <p className="font-heading text-sm font-semibold mb-1" style={{ color: 'var(--color-foreground)' }}>No experience records yet</p>
              <p className="font-caption text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                Click <strong>Add Experience</strong> to add your work history.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {expRecords.map(record => (
                <ExperienceCard
                  key={record.id}
                  record={record}
                  userId={publicUserId}
                  onCreated={handleExpCreated}
                  onSaved={handleExpSaved}
                  onDelete={handleExpDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Skills Section */}
        <div className="mt-10">
          <div className="mb-5">
            <h2 className="font-heading text-base font-semibold" style={{ color: 'var(--color-foreground)' }}>Skills</h2>
            <p className="font-caption text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>Your technical and personal competencies</p>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 py-6" style={{ color: 'var(--color-muted-foreground)' }}>
              <Icon name="Loader2" size={16} strokeWidth={2} className="animate-spin" />
              <span className="font-caption text-sm">Loading skills…</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Tech Skills */}
              <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
                      <Icon name="Code2" size={13} color="white" strokeWidth={2} />
                    </div>
                    <span className="font-heading text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>Tech Skills</span>
                  </div>
                  <button
                    onClick={() => { setAddingSkillType('tech'); setNewSkillText(''); }}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: 'var(--color-primary)', backgroundColor: 'rgba(212,118,26,0.10)' }}
                  >
                    <Icon name="Plus" size={13} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[28px]">
                  {skillRecords.filter(s => s.type === 'tech').map(s => (
                    <span
                      key={s.id}
                      className="flex items-center gap-1.5 text-xs font-caption font-medium px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: 'rgba(212,118,26,0.10)', color: 'var(--color-primary)', border: '1px solid rgba(212,118,26,0.2)' }}
                    >
                      {s.skills}
                      <button onClick={() => handleSkillDelete(s.id)} className="opacity-60 hover:opacity-100 transition-opacity">
                        <Icon name="X" size={11} strokeWidth={2.5} />
                      </button>
                    </span>
                  ))}
                  {skillRecords.filter(s => s.type === 'tech').length === 0 && addingSkillType !== 'tech' && (
                    <span className="font-caption text-xs" style={{ color: 'var(--color-muted-foreground)' }}>No tech skills yet</span>
                  )}
                </div>

                {addingSkillType === 'tech' && (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      className="flex-1 rounded-lg px-3 py-1.5 text-sm outline-none transition-colors bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:border-[var(--color-primary)]"
                      value={newSkillText}
                      onChange={e => setNewSkillText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleSkillAdd(); if (e.key === 'Escape') setAddingSkillType(null); }}
                      placeholder="e.g. React, TypeScript…"
                    />
                    <button
                      onClick={handleSkillAdd}
                      disabled={addingSkillSaving || !newSkillText.trim()}
                      className="p-1.5 rounded-lg disabled:opacity-50 transition-opacity"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                    >
                      {addingSkillSaving
                        ? <Icon name="Loader2" size={13} strokeWidth={2} className="animate-spin" />
                        : <Icon name="Check" size={13} strokeWidth={2.5} />}
                    </button>
                    <button onClick={() => setAddingSkillType(null)} className="p-1.5 rounded-lg" style={{ color: 'var(--color-muted-foreground)', backgroundColor: 'var(--color-background)' }}>
                      <Icon name="X" size={13} strokeWidth={2} />
                    </button>
                  </div>
                )}
              </div>

              {/* Personal Skills */}
              <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
                      <Icon name="User" size={13} color="white" strokeWidth={2} />
                    </div>
                    <span className="font-heading text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>Personal Skills</span>
                  </div>
                  <button
                    onClick={() => { setAddingSkillType('personal'); setNewSkillText(''); }}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: 'var(--color-primary)', backgroundColor: 'rgba(212,118,26,0.10)' }}
                  >
                    <Icon name="Plus" size={13} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[28px]">
                  {skillRecords.filter(s => s.type === 'personal').map(s => (
                    <span
                      key={s.id}
                      className="flex items-center gap-1.5 text-xs font-caption font-medium px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: 'rgba(99,102,241,0.10)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}
                    >
                      {s.skills}
                      <button onClick={() => handleSkillDelete(s.id)} className="opacity-60 hover:opacity-100 transition-opacity">
                        <Icon name="X" size={11} strokeWidth={2.5} />
                      </button>
                    </span>
                  ))}
                  {skillRecords.filter(s => s.type === 'personal').length === 0 && addingSkillType !== 'personal' && (
                    <span className="font-caption text-xs" style={{ color: 'var(--color-muted-foreground)' }}>No personal skills yet</span>
                  )}
                </div>

                {addingSkillType === 'personal' && (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      className="flex-1 rounded-lg px-3 py-1.5 text-sm outline-none transition-colors bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:border-[var(--color-primary)]"
                      value={newSkillText}
                      onChange={e => setNewSkillText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleSkillAdd(); if (e.key === 'Escape') setAddingSkillType(null); }}
                      placeholder="e.g. Leadership, Communication…"
                    />
                    <button
                      onClick={handleSkillAdd}
                      disabled={addingSkillSaving || !newSkillText.trim()}
                      className="p-1.5 rounded-lg disabled:opacity-50 transition-opacity"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                    >
                      {addingSkillSaving
                        ? <Icon name="Loader2" size={13} strokeWidth={2} className="animate-spin" />
                        : <Icon name="Check" size={13} strokeWidth={2.5} />}
                    </button>
                    <button onClick={() => setAddingSkillType(null)} className="p-1.5 rounded-lg" style={{ color: 'var(--color-muted-foreground)', backgroundColor: 'var(--color-background)' }}>
                      <Icon name="X" size={13} strokeWidth={2} />
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Languages Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading text-base font-semibold" style={{ color: 'var(--color-foreground)' }}>Languages</h2>
              <p className="font-caption text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>Languages you speak and your proficiency level</p>
            </div>
            {!addingLang && (
              <button
                onClick={() => { setAddingLang(true); setNewLangText(''); setNewProfText(''); }}
                className="flex items-center gap-1.5 text-sm font-caption font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: 'white' }}
              >
                <Icon name="Plus" size={14} strokeWidth={2.5} />
                Add Language
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center gap-2 py-6" style={{ color: 'var(--color-muted-foreground)' }}>
              <Icon name="Loader2" size={16} strokeWidth={2} className="animate-spin" />
              <span className="font-caption text-sm">Loading languages…</span>
            </div>
          ) : (
            <div
              className="rounded-2xl p-5 flex flex-col gap-4"
              style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
            >
              {langRecords.length === 0 && !addingLang && (
                <p className="font-caption text-sm" style={{ color: 'var(--color-muted-foreground)' }}>No languages added yet.</p>
              )}

              {langRecords.map(lang => (
                <div key={lang.id} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
                  >
                    <Icon name="Languages" size={15} color="white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold font-heading" style={{ color: 'var(--color-foreground)' }}>{lang.language}</p>
                    {lang.proficient && (
                      <p className="font-caption text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{lang.proficient}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleLangDelete(lang.id)}
                    className="p-1.5 rounded-lg transition-colors flex-shrink-0"
                    style={{ color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)' }}
                  >
                    <Icon name="Trash2" size={13} strokeWidth={2} />
                  </button>
                </div>
              ))}

              {addingLang && (
                <div
                  className="flex flex-col gap-3 rounded-xl p-4"
                  style={{ backgroundColor: 'var(--color-background)', border: '1.5px dashed var(--color-primary)' }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted-foreground)' }}>Language</label>
                      <input
                        autoFocus
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:border-[var(--color-primary)]"
                        value={newLangText}
                        onChange={e => setNewLangText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleLangAdd(); if (e.key === 'Escape') setAddingLang(false); }}
                        placeholder="e.g. English"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted-foreground)' }}>Proficiency</label>
                      <input
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:border-[var(--color-primary)]"
                        value={newProfText}
                        onChange={e => setNewProfText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleLangAdd(); if (e.key === 'Escape') setAddingLang(false); }}
                        placeholder="e.g. Native Speaker, Proficient"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setAddingLang(false)}
                      className="text-sm font-caption px-3 py-2 rounded-xl"
                      style={{ color: 'var(--color-muted-foreground)', backgroundColor: 'var(--color-background)' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLangAdd}
                      disabled={addingLangSaving || !newLangText.trim()}
                      className="flex items-center gap-1.5 text-sm font-caption font-semibold px-5 py-2 rounded-xl disabled:opacity-60 transition-opacity"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                    >
                      {addingLangSaving
                        ? <Icon name="Loader2" size={14} strokeWidth={2} className="animate-spin" />
                        : <Icon name="Check" size={14} strokeWidth={2.5} />}
                      {addingLangSaving ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div
          className="mt-6 rounded-xl flex items-start gap-3 px-4 py-3"
          style={{ backgroundColor: 'rgba(212,118,26,0.08)', border: '1px solid rgba(212,118,26,0.2)' }}
        >
          <Icon name="Info" size={16} color="var(--color-primary)" strokeWidth={2} className="flex-shrink-0 mt-0.5" />
          <p className="font-caption text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            Add your portfolio website URL and save your profile. Use the <strong style={{ color: 'var(--color-foreground)' }}>Visit Portfolio</strong> button to preview your site in a new tab.
          </p>
        </div>
      </div>
    </AppShell>
  );
};

export default PortfolioResumeSettings;
