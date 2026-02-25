import { format, isToday, isYesterday } from 'date-fns';
import { JournalEntry, Mood } from '../../types/journal';
import { cn } from '../../lib/utils';
import { 
  Smile, 
  Frown, 
  Meh, 
  Zap, 
  Moon, 
  Wind, 
  AlertCircle,
  Calendar
} from 'lucide-react';

interface EntryListProps {
  entries: JournalEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const moodIcons: Record<string, any> = {
  happy: Smile,
  sad: Frown,
  neutral: Meh,
  excited: Zap,
  tired: Moon,
  calm: Wind,
  anxious: AlertCircle,
};

const moodColors: Record<string, string> = {
  happy: 'text-yellow-500',
  sad: 'text-blue-500',
  neutral: 'text-stone-500',
  excited: 'text-orange-500',
  tired: 'text-indigo-500',
  calm: 'text-emerald-500',
  anxious: 'text-rose-500',
};

export function EntryList({ entries, selectedId, onSelect }: EntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-stone-400 text-sm">No entries found</p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="divide-y divide-stone-100">
      {entries.map((entry) => {
        const isSelected = entry.id === selectedId;
        const MoodIcon = entry.mood ? moodIcons[entry.mood] : null;

        return (
          <button
            key={entry.id}
            onClick={() => onSelect(entry.id)}
            className={cn(
              "w-full p-5 text-left transition-all hover:bg-stone-50 group relative",
              isSelected && "bg-emerald-50/50 hover:bg-emerald-50/50"
            )}
          >
            {isSelected && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600" />
            )}
            
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                {formatDate(entry.entry_date)}
              </span>
              {MoodIcon && (
                <MoodIcon size={14} className={moodColors[entry.mood as string]} />
              )}
            </div>
            
            <h3 className={cn(
              "text-sm font-bold text-stone-900 mb-1 line-clamp-1",
              isSelected && "text-emerald-900"
            )}>
              {entry.title || 'Untitled Entry'}
            </h3>
            
            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
              {entry.content}
            </p>
          </button>
        );
      })}
    </div>
  );
}
