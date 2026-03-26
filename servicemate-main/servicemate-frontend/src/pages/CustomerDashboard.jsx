import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, CalendarDays, Clock3, LogOut, MapPin, Paintbrush,
  Search, ShieldCheck, Sparkles, Star, Wrench, Zap, LayoutDashboard,
  Bell, ChevronRight, X, ArrowLeft, Loader2, Droplets, Hammer, Bug, Wind
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LiveBackground from '../components/LiveBackground';
import ThemeToggle from '../components/ThemeToggle';

// 1. CATEGORIES CONFIGURATION
const categories = [
  { name: 'Deep Cleaning', icon: Paintbrush, accent: 'from-cyan-400/30', desc: 'Expert home & office detailing.' },
  { name: 'Electrical', icon: Zap, accent: 'from-amber-400/30', desc: 'Diagnostics, wiring, and installs.' },
  { name: 'Appliance Repair', icon: Wrench, accent: 'from-rose-400/30', desc: 'Fridge, Washer, and Gadget fixes.' },
  { name: 'Plumbing', icon: Droplets, accent: 'from-blue-500/30', desc: 'Leak repairs and pipe fitting.' },
  { name: 'Carpentry', icon: Hammer, accent: 'from-orange-500/30', desc: 'Furniture and custom woodwork.' },
  { name: 'Pest Control', icon: Bug, accent: 'from-red-500/30', desc: 'Rodent and insect management.' },
  { name: 'AC Service', icon: Wind, accent: 'from-sky-400/30', desc: 'AC Installation and gas charging.' },
  { name: 'Home Safety', icon: ShieldCheck, accent: 'from-emerald-400/30', desc: 'CCTV and Smart Lock security.' },
];

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [view, setView] = useState('home'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [providers, setProviders] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookingProvider, setBookingProvider] = useState(null); 

  // 2. API: Fetching Providers by Specialty
  useEffect(() => {
    if (view === 'listing' && selectedCategory) {
      setLoading(true);
      const categoryForApi = selectedCategory.toLowerCase();

      axios.get(`http://localhost:8080/api/providers/specialty/${categoryForApi}`)
        .then(res => {
          setProviders(res.data);
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
          toast.error("Database connection failed.");
        });
    }
  }, [view, selectedCategory]);

  // 3. FIXED API: Handling Booking Form Submission (Matches your SQL Schema)
  // 3. FIXED API: Handling Booking Form Submission
const handleBookingSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  // ✅ Status constants (clean + reusable)
  const BOOKING_STATUS = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED'
  };

  const bookingDetails = {
    userId: parseInt(user.id),
    providerId: parseInt(bookingProvider.id),
    serviceId: 1,
    bookingDate: formData.get('date'),
    description: formData.get('description'),
    status: BOOKING_STATUS.PENDING   // ✅ FIXED HERE
  };

  try {
    await axios.post('http://localhost:8080/api/bookings/create', bookingDetails);
    toast.success("Booking successful!");
    setBookingProvider(null);
  } catch (err) {
    console.error("Error details:", err.response?.data);
    toast.error("Booking failed. Check console.");
  }
};

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  const filteredCategories = useMemo(() => {
    return categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  return (
    <LiveBackground>
      {/* --- BOOKING MODAL --- */}
      <AnimatePresence>
        {bookingProvider && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} 
              className="bg-[#0c0c0e] border border-white/10 p-8 rounded-[2.5rem] max-w-md w-full relative shadow-2xl">
              <button onClick={() => setBookingProvider(null)} className="absolute right-6 top-6 text-slate-500 hover:text-white transition-colors"><X /></button>
              <h2 className="text-2xl font-black text-white mb-1">Confirm Booking</h2>
              <p className="text-indigo-400 font-bold mb-6">Expert: {bookingProvider.name}</p>
              
              <form className="space-y-4" onSubmit={handleBookingSubmit}>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Appointment Date</label>
                  <input name="date" type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 ring-indigo-500/20" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Describe Requirements</label>
                  <textarea name="description" placeholder="E.g., Kitchen sink pipe is leaking..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white h-28 outline-none focus:ring-2 ring-indigo-500/20" required />
                </div>
                <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/30">
                  Request Service
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen text-slate-200">
        <aside className="hidden lg:flex w-72 flex-col border-r border-white/5 bg-black/20 backdrop-blur-2xl px-6 py-10">
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <span className="text-xl font-black text-white tracking-tighter">ServiceMate</span>
          </div>
          <nav className="flex-1 space-y-2">
            <button onClick={() => setView('home')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${view === 'home' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 shadow-inner' : 'text-slate-500 hover:text-white'}`}>
              <LayoutDashboard size={20}/> <span className="font-bold text-sm">Explore</span>
            </button>
          </nav>
          <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-red-400 transition-all font-bold text-sm mt-auto">
            <LogOut size={20} /> Logout
          </button>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12">
          {view === 'home' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <header className="mb-12 flex justify-between items-start">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <Sparkles size={12} /> Dashboard v1.0
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-black text-white">
                    Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">{user?.name || 'Sanjay'}</span>
                  </h1>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <ThemeToggle />
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 font-bold text-indigo-400 shadow-xl">
                    {user?.name?.[0] || 'S'}
                  </div>
                </div>
              </header>

              <div className="grid gap-8 xl:grid-cols-[1fr_350px]">
                <div className="space-y-8">
                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={22} />
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search services..." 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-6 pl-14 pr-6 text-lg text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCategories.map((cat) => (
                      <motion.button key={cat.name} whileHover={{ y: -5 }} onClick={() => { setSelectedCategory(cat.name); setView('listing'); }}
                        className="group relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 text-left hover:border-indigo-500/40 transition-all overflow-hidden">
                        <div className={`absolute -right-4 -top-4 w-32 h-32 blur-[60px] opacity-20 bg-gradient-to-br ${cat.accent}`} />
                        <cat.icon className="mb-6 text-white group-hover:scale-110 transition-transform duration-500" size={32} />
                        <h3 className="text-2xl font-bold text-white leading-none">{cat.name}</h3>
                        <p className="text-slate-500 text-sm mt-3 leading-relaxed">{cat.desc}</p>
                        <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest mt-6">
                          Explore Experts <ChevronRight size={14} />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
                <aside className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-800 text-white shadow-2xl h-fit">
                  <Clock3 size={40} className="mb-6 text-white/40" />
                  <h3 className="text-2xl font-black mb-4">Urgent Help?</h3>
                  <p className="text-indigo-100/70 mb-8 text-sm leading-relaxed">Priority booking connects you with experts within 60 minutes.</p>
                  <button className="w-full py-4 bg-white text-indigo-700 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg">Request Priority</button>
                </aside>
              </div>
            </motion.div>
          ) : (
            <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <button onClick={() => setView('home')} className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-8 font-bold">
                <ArrowLeft size={18} /> Back to Dashboard
              </button>
              <h2 className="text-4xl font-black text-white mb-2 capitalize">
                {selectedCategory} <span className="text-indigo-500">Pros</span>
              </h2>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                  <Loader2 className="animate-spin mb-4" size={44} />
                  <p className="font-medium">Connecting to ServiceMate Database...</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {providers.length > 0 ? providers.map((pro) => (
                    <div key={pro.id} className="p-6 bg-white/[0.03] border border-white/10 rounded-[2rem] flex flex-col sm:flex-row justify-between items-center group hover:bg-white/[0.05] transition-all">
                      <div className="flex gap-5 items-center">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold text-2xl border border-indigo-500/20 shadow-inner">
                          {pro.name[0]}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">{pro.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-slate-400 mt-1 font-medium">
                            <span className="flex items-center gap-1 text-yellow-500"><Star size={14} fill="currentColor"/> 4.8</span>
                            <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-500"/> Verified</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 sm:mt-0 text-right">
                        <p className="text-2xl font-black text-white">₹{pro.price || '499'}<span className="text-xs text-slate-500 font-normal">/hr</span></p>
                        <button onClick={() => setBookingProvider(pro)} className="mt-3 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-xl shadow-indigo-600/20">
                          Book Now
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="p-12 text-center rounded-[2.5rem] border border-dashed border-white/10 bg-white/[0.02]">
                      <p className="text-slate-500 text-lg mb-2">No experts found for "{selectedCategory}" yet.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.section>
          )}
        </main>
      </div>
    </LiveBackground>
  );
};

export default CustomerDashboard;
