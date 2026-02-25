import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Book, PenLine, Shield, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-2 rounded-xl text-white">
            <Book size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">DailyJournal</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-4 py-2 font-medium text-stone-600 hover:text-stone-900 transition-colors">
            Log in
          </Link>
          <Link to="/signup" className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-full hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg">
            Sign up free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-8">
              Capture your thoughts, <span className="text-emerald-600">one day at a time.</span>
            </h1>
            <p className="text-xl text-stone-600 mb-10 max-w-lg leading-relaxed">
              A private, secure space for your daily reflections. Track your moods, organize your memories, and grow through writing.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="px-8 py-4 bg-emerald-600 text-white text-lg font-semibold rounded-2xl hover:bg-emerald-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                Start Journaling Now
              </Link>
              <div className="flex items-center gap-2 text-stone-500 px-4">
                <Shield size={20} className="text-emerald-500" />
                <span className="text-sm font-medium">Encrypted & Private</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden p-8">
              <div className="flex items-center gap-3 mb-8 border-b border-stone-100 pb-4">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="space-y-6">
                <div className="h-4 bg-stone-100 rounded-full w-3/4" />
                <div className="h-4 bg-stone-100 rounded-full w-full" />
                <div className="h-4 bg-stone-100 rounded-full w-5/6" />
                <div className="h-4 bg-stone-100 rounded-full w-2/3" />
                <div className="pt-8 flex gap-3">
                  <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium">Happy</div>
                  <div className="px-4 py-2 bg-stone-50 text-stone-500 rounded-full text-sm font-medium">Reflective</div>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-lg border border-stone-100 animate-bounce">
              <Sparkles className="text-amber-500" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-lg border border-stone-100">
              <PenLine className="text-emerald-600" />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Features */}
      <section className="bg-white py-32 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Everything you need to reflect.</h2>
            <p className="text-stone-600">Simple tools for a profound habit.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <PenLine size={24} />
              </div>
              <h3 className="text-xl font-bold">Simple Writing</h3>
              <p className="text-stone-600 leading-relaxed">A clean, distraction-free editor that lets your thoughts flow onto the page.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold">Mood Tracking</h3>
              <p className="text-stone-600 leading-relaxed">Tag your entries with moods to see patterns in your emotional well-being over time.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold">Private & Secure</h3>
              <p className="text-stone-600 leading-relaxed">Your data is yours. Securely stored and only accessible by you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-stone-200 text-center text-stone-500 text-sm">
        <p>&copy; {new Date().getFullYear()} DailyJournal. Built with love for your mind.</p>
      </footer>
    </div>
  );
}
