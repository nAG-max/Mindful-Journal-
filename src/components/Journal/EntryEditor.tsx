import { useState, useEffect } from 'react';
import { JournalEntry, CreateEntryData, Mood } from '../../types/journal';
import { MoodSelector } from './MoodSelector';
import { ConfirmDialog } from './ConfirmDialog';
import { format } from 'date-fns';
import { 
  Save, 
  Trash2, 
  X, 
  Calendar, 
  Clock, 
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface EntryEditorProps {
  entry?: JournalEntry | null;
  onSave: (data: CreateEntryData) => Promise<void>;
  onCancel?: () => void;
  onDelete?: () => Promise<void>;
}

export function EntryEditor({ entry, onSave, onCancel, onDelete }: EntryEditorProps) {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [mood, setMood] = useState<Mood | null>(entry?.mood || null);
  const [entryDate, setEntryDate] = useState(entry?.entry_date || format(new Date(), 'yyyy-MM-dd'));
  
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setMood(entry.mood);
      setEntryDate(entry.entry_date);
      setHasChanges(false);
    } else {
      setTitle('');
      setContent('');
      setMood(null);
      setEntryDate(format(new Date(), 'yyyy-MM-dd'));
      setHasChanges(false);
    }
  }, [entry]);

  useEffect(() => {
    const isChanged = 
      title !== (entry?.title || '') ||
      content !== (entry?.content || '') ||
      mood !== (entry?.mood || null) ||
      entryDate !== (entry?.entry_date || format(new Date(), 'yyyy-MM-dd'));
    
    setHasChanges(isChanged);
  }, [title, content, mood, entryDate, entry]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;
    
    setIsSaving(true);
    try {
      await onSave({
        title: title.trim() || 'Untitled Entry',
        content,
        mood,
        entry_date: entryDate,
      });
      setHasChanges(false);
      setLastSaved(new Date());
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete();
    } catch (err) {
      console.error('Failed to delete:', err);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Editor Toolbar */}
      <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-2 hover:bg-stone-50 rounded-lg text-stone-500 transition-colors md:hidden"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-widest">
              <Calendar size={12} />
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="bg-transparent outline-none hover:text-stone-600 transition-colors cursor-pointer"
              />
            </div>
            {lastSaved && !hasChanges && (
              <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-medium mt-0.5">
                <CheckCircle2 size={10} />
                Saved {format(lastSaved, 'h:mm a')}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
              title="Delete entry"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={cn(
              "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm whitespace-nowrap",
              hasChanges 
                ? "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md" 
                : "bg-stone-100 text-stone-400 cursor-not-allowed"
            )}
          >
            {isSaving ? <Clock className="animate-spin" size={16} /> : <Save size={16} />}
            <span>{entry ? 'Update' : (
              <>
                <span className="hidden sm:inline">Save Entry</span>
                <span className="sm:hidden">Save</span>
              </>
            )}</span>
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 lg:p-16 max-w-4xl mx-auto w-full">
        <div className="space-y-8">
          <input
            type="text"
            placeholder="Entry Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 placeholder:text-stone-200 outline-none bg-transparent border-none focus:ring-0 p-0"
          />

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">How are you feeling?</label>
            <MoodSelector value={mood} onChange={setMood} />
          </div>

          <textarea
            placeholder="Start writing your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[400px] text-lg text-stone-700 placeholder:text-stone-300 outline-none bg-transparent border-none focus:ring-0 p-0 resize-none leading-relaxed"
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Entry"
        message="Are you sure you want to delete this entry? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
      />
    </div>
  );
}
