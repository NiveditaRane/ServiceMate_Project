import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, Bell, CalendarDays, ChevronRight, Loader2, LogOut, Search, ShieldCheck,
  Sparkles, Star, UserCircle2, Wrench, Zap, Paintbrush, Droplets, Hammer, Bug, Wind, X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LiveBackground from '../components/LiveBackground';
import ThemeToggle from '../components/ThemeToggle';

const categories = [
  ['Deep Cleaning', Paintbrush, 'Expert home and office detailing.'],
  ['Electrical', Zap, 'Diagnostics, wiring, and installs.'],
  ['Appliance Repair', Wrench, 'Fridge, washer, and gadget fixes.'],
  ['Plumbing', Droplets, 'Leak repairs and pipe fitting.'],
  ['Carpentry', Hammer, 'Furniture and custom woodwork.'],
  ['Pest Control', Bug, 'Rodent and insect management.'],
  ['AC Service', Wind, 'Installation, servicing, and gas charging.'],
  ['Home Safety', ShieldCheck, 'CCTV and smart lock setup.'],
];

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [view, setView] = useState('home');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingProvider, setBookingProvider] = useState(null);

  useEffect(() => {
    if (view !== 'listing' || !selectedCategory) return;
    setLoading(true);
    axios.get(`http://localhost:8080/api/providers/specialty/${selectedCategory.toLowerCase()}`)
      .then((res) => setProviders(res.data))
      .catch(() => toast.error('Database connection failed.'))
      .finally(() => setLoading(false));
  }, [view, selectedCategory]);

  const filteredCategories = useMemo(
    () => categories.filter(([name]) => name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await axios.post('http://localhost:8080/api/bookings/create', {
        userId: Number(user.id),
        providerId: Number(bookingProvider.id),
        bookingDate: formData.get('date'),
        description: formData.get('description'),
      });
      toast.success('Booking successful!');
      setBookingProvider(null);
    } catch (err) {
      toast.error('Booking failed. Check console.');
    }
  };

  return (
    <LiveBackground>
      <AnimatePresence>
        {bookingProvider ? (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="theme-card w-full max-w-lg rounded-[2rem] p-8 shadow-2xl">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-500">Confirm Booking</p><h2 className="mt-2 text-3xl font-black text-[var(--text-primary)]">{bookingProvider.name}</h2></div>
                <button type="button" onClick={() => setBookingProvider(null)} className="theme-button-secondary rounded-full p-2 text-[var(--text-muted)]"><X size={18} /></button>
              </div>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <input name="date" type="date" required className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-4 text-[var(--text-primary)] outline-none" />
                <textarea name="description" required placeholder="Describe the issue or requirement" rows={5} className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-4 text-[var(--text-primary)] outline-none" />
                <button type="submit" className="theme-button-primary w-full rounded-2xl px-5 py-4 text-sm font-bold">Request Service</button>
              </form>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="theme-card mb-6 rounded-[32px] px-5 py-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-xl font-black text-white">S</div>
              <div><p className="text-2xl font-black text-[var(--text-primary)]">ServiceMate</p><p className="text-sm text-[var(--text-muted)]">Customer workspace</p></div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" className="theme-button-secondary rounded-2xl p-3 text-[var(--text-muted)]"><Bell size={18} /></button>
              <ThemeToggle />
              <button type="button" onClick={() => { localStorage.clear(); navigate('/login', { replace: true }); }} className="theme-button-secondary rounded-2xl px-4 py-3 text-sm font-semibold"><span className="inline-flex items-center gap-2"><LogOut size={16} />Logout</span></button>
              <div className="theme-panel flex items-center gap-3 rounded-2xl px-4 py-2"><div><p className="text-sm font-semibold text-[var(--text-primary)]">{user?.name || 'Customer'}</p><p className="text-xs text-[var(--text-muted)]">Customer</p></div><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--text-primary)] text-sm font-black text-[var(--panel-strong)]">{user?.name?.[0] || 'C'}</div></div>
            </div>
          </div>
        </div>

        {view === 'home' ? (
          <>
            <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="theme-card rounded-[34px] p-6 sm:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-sky-600"><Sparkles size={14} /> Customer Dashboard</div><h2 className="text-3xl font-black text-[var(--text-primary)]">Browse Services</h2><p className="mt-2 text-sm text-[var(--text-muted)]">Pick a category and see available experts.</p></div>
                  <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search services" className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] py-3 pl-11 pr-4 text-[var(--text-primary)] outline-none" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredCategories.map(([name, Icon, desc]) => (
                    <button key={name} type="button" onClick={() => { setSelectedCategory(name); setView('listing'); }} className="theme-panel rounded-[2rem] p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200">
                      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-500"><Icon size={24} /></div>
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{name}</p>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{desc}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-sky-600">Explore experts <ChevronRight size={16} /></span>
                    </button>
                  ))}
                </div>
              </div>
              <aside className="space-y-6">
                <div className="rounded-[34px] border border-sky-100 bg-gradient-to-br from-cyan-50 to-blue-50 p-6 shadow-sm sm:p-8">
                  <CalendarDays className="text-sky-500" size={28} />
                  <h3 className="mt-5 text-2xl font-black text-slate-900">Priority Booking</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">Need urgent help? Get connected with experts faster and keep your request moving.</p>
                  <button type="button" className="theme-button-primary mt-6 rounded-2xl px-5 py-4 text-sm font-bold">Request Priority</button>
                </div>
                <div className="theme-card rounded-[34px] p-6 sm:p-8">
                  <h3 className="text-2xl font-black text-[var(--text-primary)]">Account Snapshot</h3>
                  <div className="mt-5 space-y-4">{[['Name', user?.name || 'Customer'], ['Role', user?.role || 'customer'], ['Preferred flow', 'Book and manage services']].map(([k, v]) => <div key={k} className="theme-panel flex items-center justify-between rounded-2xl px-4 py-3"><span className="text-[var(--text-muted)]">{k}</span><span className="font-semibold text-[var(--text-primary)]">{v}</span></div>)}</div>
                </div>
              </aside>
            </section>
          </>
        ) : (
          <section className="theme-card rounded-[34px] p-6 sm:p-8">
            <button type="button" onClick={() => setView('home')} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-sky-600"><ArrowLeft size={16} /> Back to dashboard</button>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div><h2 className="text-3xl font-black text-[var(--text-primary)]">{selectedCategory} Pros</h2><p className="mt-2 text-sm text-[var(--text-muted)]">Verified providers available for this category.</p></div>
              <span className="theme-panel rounded-full px-4 py-2 text-sm font-semibold text-[var(--text-secondary)]">{providers.length} providers</span>
            </div>
            {loading ? <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]"><Loader2 className="mb-4 animate-spin" size={36} /><p>Loading providers...</p></div> : providers.length ? <div className="overflow-x-auto"><table className="min-w-full text-left"><thead className="bg-[var(--surface-soft)] text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]"><tr><th className="px-4 py-4">Provider</th><th className="px-4 py-4">Trust</th><th className="px-4 py-4">Price</th><th className="px-4 py-4">Action</th></tr></thead><tbody>{providers.map((pro) => <tr key={pro.id} className="border-t border-[var(--border-soft)] text-sm text-[var(--text-secondary)]"><td className="px-4 py-5"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 font-black text-sky-600">{pro.name?.[0]}</div><div><p className="font-semibold text-[var(--text-primary)]">{pro.name}</p><p className="text-xs text-[var(--text-muted)]">{selectedCategory} specialist</p></div></div></td><td className="px-4 py-5"><div className="flex items-center gap-3"><span className="inline-flex items-center gap-1 text-amber-500"><Star size={14} fill="currentColor" />4.8</span><span className="inline-flex items-center gap-1 text-emerald-600"><ShieldCheck size={14} />Verified</span></div></td><td className="px-4 py-5 font-black text-[var(--text-primary)]">Rs {pro.price || '499'}</td><td className="px-4 py-5"><button type="button" onClick={() => setBookingProvider(pro)} className="theme-button-primary rounded-2xl px-4 py-3 text-sm font-bold">Book Now</button></td></tr>)}</tbody></table></div> : <div className="theme-panel rounded-[2rem] border border-dashed px-6 py-14 text-center"><p className="text-lg font-semibold text-[var(--text-primary)]">No experts found for "{selectedCategory}" yet.</p></div>}
          </section>
        )}
      </div>
    </LiveBackground>
  );
};

export default CustomerDashboard;
