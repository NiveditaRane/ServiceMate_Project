import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, Bell, CalendarDays, ChevronRight, Loader2, LogOut, Search, ShieldCheck,
  Sparkles, Star, UserCircle2, Wrench, Zap, Paintbrush, Droplets, Hammer, Bug, Wind, X, Phone, Mail, Clock3,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
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

const labels = {
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  cleaning: 'Cleaning',
  carpentry: 'Carpentry',
  'deep cleaning': 'Deep Cleaning',
  'appliance repair': 'Appliance Repair',
  'pest control': 'Pest Control',
  'ac service': 'AC Service',
  'home safety': 'Home Safety',
};

const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const bookingStatusClass = {
  PENDING: 'border-amber-200 bg-amber-50 text-amber-700',
  CONFIRMED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  CANCELLED: 'border-rose-200 bg-rose-50 text-rose-700',
};

// Colors for the Priority Badges
const priorityClass = {
  HIGH: 'border-rose-200 bg-rose-50 text-rose-600',
  MEDIUM: 'border-amber-200 bg-amber-50 text-amber-600',
  LOW: 'border-sky-200 bg-sky-50 text-sky-600',
};

const formatDate = (value, opts = { day: '2-digit', month: 'short', year: 'numeric' }) =>
    value ? new Intl.DateTimeFormat('en-IN', opts).format(new Date(`${value}T00:00:00`)) : 'Date not provided';

const getErrorMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (typeof data === 'string' && data.trim()) return data;
  if (typeof data?.message === 'string' && data.message.trim()) return data.message;
  if (typeof error?.message === 'string' && error.message.trim()) return error.message;
  return fallback;
};

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [view, setView] = useState(searchParams.get('view') === 'listing' ? 'listing' : 'home');
  const [homeSection, setHomeSection] = useState(searchParams.get('section') === 'bookings' ? 'bookings' : 'services');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingProvider, setBookingProvider] = useState(null);
  const [priorityBookingOpen, setPriorityBookingOpen] = useState(false);
  const [priorityCategory, setPriorityCategory] = useState('');
  const [priorityProviders, setPriorityProviders] = useState([]);
  const [priorityProvidersLoading, setPriorityProvidersLoading] = useState(false);
  const [priorityProviderId, setPriorityProviderId] = useState('');
  const [customerBookings, setCustomerBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    const nextView = searchParams.get('view') === 'listing' ? 'listing' : 'home';
    const nextSection = searchParams.get('section') === 'bookings' ? 'bookings' : 'services';
    const nextCategory = searchParams.get('category') || '';
    const nextSearch = searchParams.get('search') || '';
    setView(nextView);
    setHomeSection(nextSection);
    setSelectedCategory(nextCategory);
    setSearch(nextSearch);
  }, [searchParams]);

  useEffect(() => {
    const nextParams = {};
    if (view === 'listing' && selectedCategory) {
      nextParams.view = 'listing';
      nextParams.category = selectedCategory;
    }
    if (view === 'home' && homeSection !== 'services') {
      nextParams.section = homeSection;
    }
    if (search.trim()) {
      nextParams.search = search;
    }
    setSearchParams(nextParams, { replace: true });
  }, [view, homeSection, selectedCategory, search, setSearchParams]);

  const loadProviders = (showLoader = false) => {
    if (!selectedCategory) return Promise.resolve();
    if (showLoader) setLoading(true);
    return api
        .get(`/api/providers/specialty/${selectedCategory.toLowerCase()}`)
        .then((res) => {
          const nextProviders = (Array.isArray(res.data) ? res.data : []).filter((provider) => provider.availability !== false);
          setProviders(nextProviders);
          setBookingProvider((current) => (
              current && !nextProviders.some((provider) => provider.id === current.id) ? null : current
          ));
        })
        .catch(() => {
          toast.error('Database connection failed.');
        })
        .finally(() => {
          if (showLoader) setLoading(false);
        });
  };

  const loadCustomerBookings = (showLoader = false) => {
    if (!user?.id) return Promise.resolve();
    if (showLoader) setBookingsLoading(true);
    return api
        .get(`/api/bookings/user/${user.id}`)
        .then((res) => {
          setCustomerBookings(Array.isArray(res.data) ? res.data : []);
        })
        .catch(() => {
          if (showLoader) {
            toast.error('Failed to load your bookings.');
          }
        })
        .finally(() => {
          if (showLoader) setBookingsLoading(false);
        });
  };

  const loadPriorityProviders = (category, showLoader = false) => {
    if (!category) {
      setPriorityProviders([]);
      setPriorityProviderId('');
      return Promise.resolve();
    }

    if (showLoader) setPriorityProvidersLoading(true);
    return api
        .get(`/api/providers/specialty/${category.toLowerCase()}`)
        .then((res) => {
          const nextProviders = (Array.isArray(res.data) ? res.data : []).filter((provider) => provider.availability !== false);
          setPriorityProviders(nextProviders);
          setPriorityProviderId((current) => (
              current && nextProviders.some((provider) => String(provider.id) === current) ? current : ''
          ));
        })
        .catch(() => {
          toast.error('Failed to load priority providers.');
        })
        .finally(() => {
          if (showLoader) setPriorityProvidersLoading(false);
        });
  };

  useEffect(() => {
    loadCustomerBookings(true);

    const intervalId = window.setInterval(() => {
      loadCustomerBookings(false);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [user?.id]);

  useEffect(() => {
    if (view !== 'listing' || !selectedCategory) return;
    loadProviders(true);

    const intervalId = window.setInterval(() => {
      loadProviders(false);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [view, selectedCategory]);

  useEffect(() => {
    if (!priorityBookingOpen || !priorityCategory) return;
    loadPriorityProviders(priorityCategory, true);
  }, [priorityBookingOpen, priorityCategory]);

  const filteredCategories = useMemo(
      () => categories.filter(([name]) => name.toLowerCase().includes(search.toLowerCase())),
      [search],
  );

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await api.post('/api/bookings/create', {
        userId: Number(user.id),
        providerId: Number(bookingProvider.id),
        bookingDate: formData.get('date'),
        description: formData.get('description'),
      });

      toast.success('Booking successful!');
      setBookingProvider(null);
      loadCustomerBookings(false);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Booking failed.'));
    }
  };

  const handlePriorityBookingSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const priority = 'HIGH';

    try {
      const createResponse = await api.post('/api/bookings/create', {
        userId: Number(user.id),
        providerId: Number(priorityProviderId),
        bookingDate: formData.get('date'),
        description: formData.get('description'),
      });

      const bookingId = createResponse?.data?.id;
      if (bookingId) {
        await api.put(`/api/bookings/${bookingId}/priority`, null, {
          params: { priority },
        });
      }

      toast.success('Priority booking requested successfully!');
      setPriorityBookingOpen(false);
      setPriorityCategory('');
      setPriorityProviders([]);
      setPriorityProviderId('');
      loadCustomerBookings(false);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Priority booking failed.'));
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
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[var(--text-muted)] ml-1">Preferred Date</label>
                      <input name="date" type="date" required className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-4 text-[var(--text-primary)] outline-none" />
                    </div>

                    <textarea name="description" required placeholder="Describe the issue or requirement" rows={4} className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-4 text-[var(--text-primary)] outline-none" />
                    <button type="submit" className="theme-button-primary w-full rounded-2xl px-5 py-4 text-sm font-bold">Request Service</button>
                  </form>
                </motion.div>
              </div>
          ) : null}
          {priorityBookingOpen ? (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="theme-card w-full max-w-2xl rounded-[2rem] p-8 shadow-2xl">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-500">Priority Booking</p><h2 className="mt-2 text-3xl font-black text-[var(--text-primary)]">Request urgent service</h2></div>
                    <button type="button" onClick={() => { setPriorityBookingOpen(false); setPriorityCategory(''); setPriorityProviders([]); setPriorityProviderId(''); }} className="theme-button-secondary rounded-full p-2 text-[var(--text-muted)]"><X size={18} /></button>
                  </div>
                  <form onSubmit={handlePriorityBookingSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="ml-1 text-xs font-bold text-[var(--text-muted)]">Service Category</label>
                        <select
                          name="category"
                          required
                          value={priorityCategory}
                          onChange={(e) => setPriorityCategory(e.target.value)}
                          className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-4 text-[var(--text-primary)] outline-none"
                        >
                          <option value="">Select a service</option>
                          {categories.map(([name]) => (
                              <option key={name} value={name}>{name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="ml-1 text-xs font-bold text-[var(--text-muted)]">Provider</label>
                        <select
                          name="provider"
                          required
                          value={priorityProviderId}
                          onChange={(e) => setPriorityProviderId(e.target.value)}
                          disabled={!priorityCategory || priorityProvidersLoading || !priorityProviders.length}
                          className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-4 text-[var(--text-primary)] outline-none disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="">
                            {priorityProvidersLoading ? 'Loading providers...' : priorityCategory ? 'Select a provider' : 'Choose a category first'}
                          </option>
                          {priorityProviders.map((provider) => (
                              <option key={provider.id} value={provider.id}>{provider.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="ml-1 text-xs font-bold text-[var(--text-muted)]">Preferred Date</label>
                      <input name="date" type="date" required className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-4 text-[var(--text-primary)] outline-none" />
                    </div>

                    <div className="space-y-1">
                      <label className="ml-1 text-xs font-bold text-[var(--text-muted)]">Issue Details</label>
                      <textarea name="description" required placeholder="Describe the issue or requirement" rows={4} className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-4 text-[var(--text-primary)] outline-none" />
                    </div>
                    <button type="submit" className="theme-button-primary w-full rounded-2xl px-5 py-4 text-sm font-bold">Request Priority Service</button>
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
                <button type="button" onClick={() => { clearSession(); navigate('/login', { replace: true }); }} className="theme-button-secondary rounded-2xl px-4 py-3 text-sm font-semibold"><span className="inline-flex items-center gap-2"><LogOut size={16} />Logout</span></button>
                <div className="theme-panel flex items-center gap-3 rounded-2xl px-4 py-2"><div><p className="text-sm font-semibold text-[var(--text-primary)]">{user?.name || 'Customer'}</p><p className="text-xs text-[var(--text-muted)]">Customer</p></div><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--text-primary)] text-sm font-black text-[var(--panel-strong)]">{user?.name?.[0] || 'C'}</div></div>
              </div>
            </div>
          </div>

          {view === 'home' ? (
              <>
                <section className="theme-card mb-6 rounded-[34px] p-4 sm:p-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={() => setHomeSection('services')}
                        className={`rounded-[24px] border px-5 py-4 text-left transition ${
                            homeSection === 'services'
                                ? 'border-sky-300 bg-sky-50 shadow-sm'
                                : 'border-[var(--border-soft)] bg-[var(--surface-soft)]'
                        }`}
                    >
                      <p className={`text-xl font-black ${homeSection === 'services' ? 'text-slate-900' : 'text-[var(--text-primary)]'}`}>Browse Services</p>
                      <p className={`mt-1 text-sm ${homeSection === 'services' ? 'text-slate-600' : 'text-[var(--text-muted)]'}`}>Open service categories and book a provider.</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => setHomeSection('bookings')}
                        className={`rounded-[24px] border px-5 py-4 text-left transition ${
                            homeSection === 'bookings'
                                ? 'border-sky-300 bg-sky-50 shadow-sm'
                                : 'border-[var(--border-soft)] bg-[var(--surface-soft)]'
                        }`}
                    >
                      <p className={`text-xl font-black ${homeSection === 'bookings' ? 'text-slate-900' : 'text-[var(--text-primary)]'}`}>Your Bookings</p>
                      <p className={`mt-1 text-sm ${homeSection === 'bookings' ? 'text-slate-600' : 'text-[var(--text-muted)]'}`}>Open your confirmed, pending, and cancelled requests.</p>
                    </button>
                  </div>
                </section>

                {homeSection === 'bookings' ? (
                    <section className="theme-card rounded-[34px] p-6 sm:p-8">
                      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-500">Your Bookings</p>
                          <h2 className="mt-2 text-3xl font-black text-[var(--text-primary)]">Track accepted and pending requests</h2>
                          <p className="mt-2 text-sm text-[var(--text-muted)]">Accepted bookings from the provider dashboard will appear here automatically.</p>
                        </div>
                        <span className="theme-panel rounded-full px-4 py-2 text-sm font-semibold text-[var(--text-secondary)]">{customerBookings.length} total</span>
                      </div>

                      {bookingsLoading ? (
                          <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)]">
                            <Loader2 className="mb-4 animate-spin" size={32} />
                            <p>Loading your bookings...</p>
                          </div>
                      ) : customerBookings.length ? (
                          <div className="grid gap-4 lg:grid-cols-2">
                            {customerBookings.map((booking) => (
                                <div key={booking.id} className="theme-panel rounded-[2rem] p-5">
                                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                      <p className="text-xl font-bold text-[var(--text-primary)]">{booking.providerName || 'Assigned provider'}</p>
                                      <p className="mt-1 text-sm text-[var(--text-muted)]">{labels[booking.providerServiceType] || booking.providerServiceType || 'Service provider'}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${bookingStatusClass[booking.status] || 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                              {booking.status}
                            </span>
                                      {/* Priority Badge */}
                                      <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${priorityClass[booking.priority] || priorityClass.LOW}`}>
                              {booking.priority || 'LOW'} PRIORITY
                            </span>
                                    </div>
                                  </div>

                                  <div className="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">
                                    <div className="flex items-center gap-2">
                                      <Clock3 size={16} className="text-sky-500" />
                                      <span>{formatDate(booking.bookingDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone size={16} className="text-sky-500" />
                                      <span>{booking.providerPhone ? `+91 ${booking.providerPhone}` : 'Phone not available yet'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail size={16} className="text-sky-500" />
                                      <span>{booking.providerEmail || 'Email not available yet'}</span>
                                    </div>
                                    <p className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-3 leading-7 text-[var(--text-secondary)]">
                                      {booking.description || 'No description provided.'}
                                    </p>
                                  </div>
                                </div>
                            ))}
                          </div>
                      ) : (
                          <div className="theme-panel rounded-[2rem] border border-dashed px-6 py-14 text-center">
                            <p className="text-lg font-semibold text-[var(--text-primary)]">You have no bookings yet.</p>
                            <p className="mt-2 text-sm text-[var(--text-muted)]">Open Browse Services to create your first booking.</p>
                          </div>
                      )}
                    </section>
                ) : (
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
                          <button type="button" onClick={() => setPriorityBookingOpen(true)} className="theme-button-primary mt-6 rounded-2xl px-5 py-4 text-sm font-bold">Request Priority</button>
                        </div>
                        <div className="theme-card rounded-[34px] p-6 sm:p-8">
                          <h3 className="text-2xl font-black text-[var(--text-primary)]">Account Snapshot</h3>
                          <div className="mt-5 space-y-4">{[['Name', user?.name || 'Customer'], ['Role', user?.role || 'customer'], ['Preferred flow', 'Book and manage services']].map(([k, v]) => <div key={k} className="theme-panel flex items-center justify-between rounded-2xl px-4 py-3"><span className="text-[var(--text-muted)]">{k}</span><span className="font-semibold text-[var(--text-primary)]">{v}</span></div>)}</div>
                        </div>
                      </aside>
                    </section>
                )}
              </>
          ) : (
              <section className="theme-card rounded-[34px] p-6 sm:p-8">
                <button type="button" onClick={() => { setView('home'); setSelectedCategory(''); }} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-sky-600"><ArrowLeft size={16} /> Back to dashboard</button>
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
