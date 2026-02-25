import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { JournalEntry, CreateEntryData } from '../types/journal';
import { EntryList } from '../components/Journal/EntryList';
import { EntryEditor } from '../components/Journal/EntryEditor';
import { EntryListSkeleton, EditorSkeleton } from '../components/Journal/Skeletons';
import { Book, LogOut, Plus, Search, Filter, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function JournalPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('entry_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error('Error fetching entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEntry = async (data: CreateEntryData) => {
    try {
      const { data: newEntry, error } = await supabase
        .from('journal_entries')
        .insert([{ ...data, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      
      setEntries([newEntry, ...entries]);
      setSelectedId(newEntry.id);
      setIsCreating(false);
    } catch (err) {
      console.error('Error creating entry:', err);
      throw err;
    }
  };

  const handleUpdateEntry = async (id: string, data: Partial<CreateEntryData>) => {
    try {
      const { data: updatedEntry, error } = await supabase
        .from('journal_entries')
        .update({ ...data, updated_at: new Date().toISOString() })
        .match({ id })
        .select()
        .single();

      if (error) throw error;
      
      setEntries(entries.map(e => e.id === id ? updatedEntry : e));
    } catch (err) {
      console.error('Error updating entry:', err);
      throw err;
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .match({ id });

      if (error) throw error;
      
      setEntries(entries.filter(e => e.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
      }
    } catch (err) {
      console.error('Error deleting entry:', err);
      throw err;
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !dateFilter || entry.entry_date === dateFilter;
    return matchesSearch && matchesDate;
  });

  const selectedEntry = entries.find(e => e.id === selectedId) || null;

  return (
    <div className="h-screen bg-stone-50 flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex justify-between items-center shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-xl text-white">
            <Book size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900 hidden sm:block">My Journal</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-stone-50 rounded-lg text-sm text-stone-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {user?.email}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-rose-600 font-medium transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Entry List */}
        <aside className={cn(
          "w-full md:w-80 lg:w-96 bg-white border-r border-stone-200 flex flex-col shrink-0",
          (selectedId || isCreating) && "hidden md:flex"
        )}>
          <div className="p-4 space-y-4 border-b border-stone-100">
            <button
              onClick={() => {
                setIsCreating(true);
                setSelectedId(null);
              }}
              className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              New Entry
            </button>

            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <EntryListSkeleton />
            ) : (
              <EntryList
                entries={filteredEntries}
                selectedId={selectedId}
                onSelect={(id) => {
                  setSelectedId(id);
                  setIsCreating(false);
                }}
              />
            )}
          </div>
        </aside>

        {/* Right Panel: Editor/Viewer */}
        <main className={cn(
          "flex-1 bg-stone-50 overflow-y-auto relative",
          !(selectedId || isCreating) && "hidden md:block"
        )}>
          <AnimatePresence mode="wait">
            {loading ? (
              <EditorSkeleton />
            ) : isCreating ? (
              <motion.div
                key="new"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full"
              >
                <EntryEditor
                  onSave={handleCreateEntry}
                  onCancel={() => setIsCreating(false)}
                />
              </motion.div>
            ) : selectedEntry ? (
              <motion.div
                key={selectedEntry.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="h-full"
              >
                <EntryEditor
                  entry={selectedEntry}
                  onSave={(data) => handleUpdateEntry(selectedEntry.id, data)}
                  onDelete={() => handleDeleteEntry(selectedEntry.id)}
                  onCancel={() => setSelectedId(null)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6 text-stone-300">
                  <Book size={48} />
                </div>
                <h2 className="text-2xl font-bold text-stone-800 mb-2">Your story starts here</h2>
                <p className="text-stone-500 max-w-xs mx-auto">
                  Select an entry from the list or create a new one to begin writing.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
