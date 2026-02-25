import { useState } from 'react';
import { Mood } from '../../types/journal';
import { cn } from '../../lib/utils';
import { 
  Smile, 
  Frown, 
  Meh, 
  Zap, 
  Moon, 
  Wind, 
  AlertCircle 
} from 'lucide-react';

interface MoodSelectorProps {
  value: Mood | null;
  onChange: (mood: Mood | null) => void;
  className?: string;
}

const moods: { value: Mood; label: string; icon: any; color: string }[] = [
  { value: 'happy', label: 'Happy', icon: Smile, color: 'text-yellow-500 bg-yellow-50' },
  { value: 'excited', label: 'Excited', icon: Zap, color: 'text-orange-500 bg-orange-50' },
  { value: 'calm', label: 'Calm', icon: Wind, color: 'text-emerald-500 bg-emerald-50' },
  { value: 'neutral', label: 'Neutral', icon: Meh, color: 'text-stone-500 bg-stone-50' },
  { value: 'tired', label: 'Tired', icon: Moon, color: 'text-indigo-500 bg-indigo-50' },
  { value: 'sad', label: 'Sad', icon: Frown, color: 'text-blue-500 bg-blue-50' },
  { value: 'anxious', label: 'Anxious', icon: AlertCircle, color: 'text-rose-500 bg-rose-50' },
];

export function MoodSelector({ value, onChange, className }: MoodSelectorProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {moods.map((mood) => {
        const Icon = mood.icon;
        const isSelected = value === mood.value;
        
        return (
          <button
            key={mood.value}
            type="button"
            onClick={() => onChange(isSelected ? null : mood.value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
              isSelected 
                ? cn("border-transparent shadow-sm", mood.color)
                : "border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50"
            )}
          >
            <Icon size={16} />
            {mood.label}
          </button>
        );
      })}
    </div>
  );
}
