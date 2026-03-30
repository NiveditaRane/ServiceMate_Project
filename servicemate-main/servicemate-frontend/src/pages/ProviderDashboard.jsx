import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell, CalendarDays, DollarSign, LoaderCircle, LogOut, Mail, MapPin, MessageSquare,
  PencilLine, Phone, Save, Settings, ShieldCheck, Sparkles, Star, ToggleLeft,
  ToggleRight, UserCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import LiveBackground from '../components/LiveBackground';

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

const reviews = [
  ['Jessica Brown', '2026-03-28', 5, 'Excellent service! Very professional and thorough.'],
  ['David Miller', '2026-03-27', 4, 'Good work, arrived on time.'],
  ['Lisa Anderson', '2026-03-26', 5, 'Outstanding quality and attention to detail.'],
];

const statusClass = {
  PENDING: 'border-amber-300/20 bg-amber-300/10 text-amber-200',
  CONFIRMED: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200',
  CANCELLED: 'border-rose-300/20 bg-rose-300/10 text-rose-200',
};

const statStyles = [
  ['Rs 12,450', 'Total Earnings', '+12%', DollarSign, 'from-emerald-300/20'],
  [null, 'Active Bookings', null, CalendarDays, 'from-cyan-300/20'],
  ['4.8', 'Avg Rating', '+0.2', Star, 'from-amber-300/20'],
  [null, 'Completion Rate', null, ShieldCheck, 'from-violet-300/20'],
];

const formatDate = (value, opts = { day: '2-digit', month: 'short', year: 'numeric' }) =>
  value ? new Intl.DateTimeFormat('en-IN', opts).format(new Date(`${value}T00:00:00`)) : 'Date not provided';

const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const availabilityKey = `provider-availability:${storedUser.id ?? storedUser.email ?? 'unknown'}`;
  const persistedAvailability = localStorage.getItem(availabilityKey);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availabilitySaving, setAvailabilitySaving] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [showProfileOverlay, setShowProfileOverlay] = useState(false);
  const [form, setForm] = useState({
    id: storedUser.id,
    name: storedUser.name || '',
    email: storedUser.email || '',
    phone: storedUser.phone || '',
    serviceType: storedUser.serviceType || 'electrical',
    city: storedUser.city || '',
    bio: storedUser.bio || '',
    availability:
      typeof storedUser.availability === 'boolean'
        ? storedUser.availability
        : persistedAvailability === null
          ? true
          : persistedAvailability === 'true',
  });

  useEffect(() => {
    if (!storedUser?.id) {
      navigate('/login', { replace: true });
      return;
    }
    api.get(`/api/bookings/provider/${storedUser.id}`)
      .then((res) => {
        syncStoredUser(storedUser);
        setBookings(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, [navigate, storedUser?.id]);

  const metrics = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.status === 'CONFIRMED').length;
    const pending = bookings.filter((b) => b.status === 'PENDING').length;
    return {
      total,
      confirmed,
      pending,
      completion: total ? `${Math.round((confirmed / total) * 100)}%` : '0%',
    };
  }, [bookings]);

  const profileCompletion = useMemo(() => {
    const keys = ['name', 'email', 'phone', 'serviceType', 'city', 'bio'];
    return Math.round((keys.filter((k) => String(form[k] || '').trim()).length / keys.length) * 100);
  }, [form]);

  const syncStoredUser = (user, overrides = {}) => {
    const nextUser = {
      ...storedUser,
      ...user,
      ...overrides,
    };
    localStorage.setItem('user', JSON.stringify(nextUser));
    localStorage.setItem(
      availabilityKey,
      String(typeof nextUser.availability === 'boolean' ? nextUser.availability : true),
    );
    setForm((current) => ({
      ...current,
      id: nextUser.id,
      name: nextUser.name || '',
      email: nextUser.email || '',
      phone: nextUser.phone || '',
      serviceType: nextUser.serviceType || 'electrical',
      city: nextUser.city || '',
      bio: nextUser.bio || '',
      availability:
        typeof nextUser.availability === 'boolean'
          ? nextUser.availability
          : persistedAvailability === null
            ? true
            : persistedAvailability === 'true',
    }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    if (form.phone.length !== 10) return toast.error('Phone must be 10 digits');
    setSaving(true);
    try {
      const res = await api.put('/api/auth/profile', {
        id: form.id, name: form.name.trim(), phone: form.phone,
        serviceType: form.serviceType, city: form.city.trim(), bio: form.bio.trim(),
        availability: form.availability,
      });
      syncStoredUser(res.data.user);
      setEditing(false);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async () => {
    const nextAvailability = !form.availability;
    setAvailabilitySaving(true);
    setForm((current) => ({ ...current, availability: nextAvailability }));
    try {
      const res = await api.put('/api/auth/profile', {
        id: form.id,
        name: form.name.trim(),
        phone: form.phone,
        serviceType: form.serviceType,
        city: form.city.trim(),
        bio: form.bio.trim(),
        availability: nextAvailability,
      });
      syncStoredUser(res.data.user, { availability: nextAvailability });
      toast.success(nextAvailability ? 'You are visible for new jobs' : 'You are now offline');
    } catch (error) {
      setForm((current) => ({ ...current, availability: !nextAvailability }));
      toast.error(error.response?.data || 'Failed to update availability');
    } finally {
      setAvailabilitySaving(false);
    }
  };

  const updateStatus = async (id, status) => {
    setActiveBookingId(id);
    try {
      await api.put(`/api/bookings/${id}/status`, { status });
      setBookings((current) => current.map((b) => (b.id === id ? { ...b, status } : b)));
      toast.success(status === 'CONFIRMED' ? 'Booking confirmed' : 'Booking declined');
    } catch {
      toast.error('Failed to update booking');
    } finally {
      setActiveBookingId(null);
    }
  };

  return (
    <LiveBackground>
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[32px] border border-white/10 bg-black/20 px-5 py-4 backdrop-blur-2xl">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-950"><ShieldCheck size={28} /></div>
              <div><p className="text-2xl font-black text-white">ServiceMate</p><p className="text-sm text-slate-400">{labels[form.serviceType] || 'General'} provider workspace</p></div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setActivePanel((current) => current === 'notifications' ? null : 'notifications')} className={`relative rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-slate-300 ${activePanel === 'notifications' ? 'ring-2 ring-sky-400/40' : ''}`}><Bell size={18} />{metrics.pending ? <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-400" /> : null}</button>
              <button type="button" onClick={() => setActivePanel((current) => current === 'messages' ? null : 'messages')} className={`rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-slate-300 ${activePanel === 'messages' ? 'ring-2 ring-sky-400/40' : ''}`}><MessageSquare size={18} /></button>
              <button type="button" onClick={() => { setActivePanel(null); setEditing(true); setShowProfileOverlay(true); }} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-slate-300"><PencilLine size={18} /></button>
              <button type="button" onClick={() => { clearSession(); navigate('/login', { replace: true }); }} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-slate-300"><LogOut size={18} /></button>
              <button type="button" onClick={() => { setActivePanel(null); setEditing(false); setShowProfileOverlay(true); }} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2"><div><p className="text-sm font-semibold text-white">{form.name || 'Provider'}</p><p className="text-xs text-slate-400">Provider</p></div><div className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-black text-slate-950">{form.name?.[0] || 'P'}</div></button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showProfileOverlay ? (
            <div
              className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-md sm:p-6"
              style={{ backgroundColor: 'color-mix(in srgb, var(--app-bg) 42%, transparent)' }}
            >
              <motion.section
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                className="theme-card w-full max-w-lg rounded-[24px] p-4 sm:p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-sky-600">Provider Profile</p>
                    <h2 className="mt-1 text-2xl font-black text-[var(--text-primary)]">{editing ? 'Edit Profile' : 'Public Details'}</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    {!editing ? (
                      <button type="button" onClick={() => setEditing(true)} className="theme-button-secondary rounded-2xl px-4 py-2 text-sm font-semibold">
                        Edit
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => { setShowProfileOverlay(false); setEditing(false); }}
                      className="theme-button-secondary rounded-2xl px-4 py-2 text-sm font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[var(--text-primary)] text-xl font-black text-[var(--panel-strong)]">{form.name?.[0] || 'P'}</div>
                  <div>
                    <p className="text-xl font-black text-[var(--text-primary)]">{form.name || 'Service Professional'}</p>
                    <p className="mt-0.5 text-sm text-sky-600">{labels[form.serviceType] || 'General specialist'}</p>
                    <p className="mt-0.5 text-sm text-[var(--text-muted)]">{form.city || 'City not added yet'}</p>
                  </div>
                </div>

                <form onSubmit={saveProfile} className="space-y-3">
                  {[[Mail, 'email', 'Email', true], [Phone, 'phone', 'Phone', false], [MapPin, 'city', 'City', false]].map(([Icon, key, label, disabled]) => <div key={key} className="rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: 'var(--border-soft)', background: 'var(--surface-soft)', color: 'var(--text-secondary)' }}><div className="mb-1 flex items-center gap-2 text-xs text-[var(--text-muted)]"><Icon size={14} />{label}</div><input value={form[key]} disabled={disabled || !editing || saving} onChange={(e) => setForm((c) => ({ ...c, [key]: key === 'phone' ? e.target.value.replace(/\D/g, '').slice(0, 10) : e.target.value }))} className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none disabled:text-[var(--text-muted)]" /></div>)}
                  <div className="rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: 'var(--border-soft)', background: 'var(--surface-soft)', color: 'var(--text-secondary)' }}><div className="mb-1 flex items-center gap-2 text-xs text-[var(--text-muted)]"><Settings size={14} />Specialty</div><select value={form.serviceType} disabled={!editing || saving} onChange={(e) => setForm((c) => ({ ...c, serviceType: e.target.value }))} className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none">{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
                  <div className="rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: 'var(--border-soft)', background: 'var(--surface-soft)', color: 'var(--text-secondary)' }}><div className="mb-1 flex items-center gap-2 text-xs text-[var(--text-muted)]"><MessageSquare size={14} />Bio</div><textarea value={form.bio} disabled={!editing || saving} onChange={(e) => setForm((c) => ({ ...c, bio: e.target.value }))} rows={3} className="w-full resize-none bg-transparent text-sm text-[var(--text-primary)] outline-none disabled:text-[var(--text-muted)]" /></div>
                  <div className="rounded-2xl border p-3" style={{ borderColor: 'color-mix(in srgb, var(--primary-accent) 20%, var(--border-soft))', background: 'color-mix(in srgb, var(--primary-accent) 10%, var(--surface-soft))' }}><div className="flex items-center justify-between"><p className="text-sm font-semibold text-[var(--text-primary)]">Profile completion</p><span className="text-xl font-black text-sky-600">{profileCompletion}%</span></div><div className="mt-3 h-2 rounded-full bg-white/80"><div className="theme-progress-fill h-2 rounded-full" style={{ width: `${profileCompletion}%` }} /></div></div>
                  {editing ? <div className="flex flex-wrap gap-2"><button type="submit" disabled={saving} className="theme-button-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-70">{saving ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />}Save profile</button><button type="button" onClick={() => setEditing(false)} className="theme-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold">Cancel</button></div> : null}
                </form>
              </motion.section>
            </div>
          ) : null}
        </AnimatePresence>

        <section className="mb-6 rounded-[34px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200"><Sparkles size={14} /> Provider Dashboard</div><h1 className="text-3xl font-black text-white sm:text-5xl">Welcome back, {form.name || 'Service Professional'}</h1><p className="mt-3 max-w-2xl text-sm text-slate-300">Manage bookings, review performance, and keep your profile polished from one workspace.</p></div>
            <button
              type="button"
              role="switch"
              aria-checked={form.availability}
              disabled={availabilitySaving}
              onClick={toggleAvailability}
              className="theme-button-secondary inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold disabled:opacity-60"
            >
              <span
                className={`relative inline-flex h-7 w-13 items-center rounded-full border transition-colors ${
                  form.availability
                    ? 'border-emerald-300/40 bg-emerald-400/20'
                    : 'border-[var(--border-soft)] bg-[var(--surface-soft)]'
                }`}
                style={{ width: '3.25rem' }}
              >
                <span
                  className={`absolute h-5 w-5 rounded-full transition-transform ${
                    form.availability
                      ? 'bg-emerald-400'
                      : 'bg-[var(--text-muted)]'
                  }`}
                  style={{ transform: `translateX(${form.availability ? '1.75rem' : '0.25rem'})` }}
                />
              </span>
              <span>{availabilitySaving ? 'Updating...' : form.availability ? 'Available for new jobs' : 'Currently offline'}</span>
            </button>
          </div>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statStyles.map(([fallbackValue, label, change, Icon, tint], index) => {
            const value = label === 'Active Bookings' ? metrics.total : label === 'Completion Rate' ? metrics.completion : fallbackValue;
            return <motion.div key={label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className={`rounded-[30px] border border-white/10 bg-gradient-to-br ${tint} to-black/20 p-6 backdrop-blur-xl`}><div className="mb-6 flex items-start justify-between"><div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-white"><Icon size={24} /></div><span className="text-sm font-semibold text-emerald-300">{change || `+${metrics.pending}`}</span></div><p className="text-4xl font-black text-white">{value}</p><p className="mt-2 text-base text-slate-400">{label}</p></motion.div>;
          })}
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.55fr_0.9fr]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
              <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <div><h2 className="text-3xl font-black text-white">Upcoming Bookings</h2><p className="mt-2 text-sm text-slate-400">Manage your scheduled services and respond to new requests.</p></div>
                <button type="button" className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950">View All</button>
              </div>
              {loading ? <div className="flex flex-col items-center justify-center px-6 py-20 text-slate-400"><LoaderCircle size={36} className="animate-spin" /><p className="mt-4 text-sm">Loading booking requests...</p></div> : !bookings.length ? <div className="px-6 py-16 text-center"><p className="text-xl font-semibold text-white">No bookings yet</p><p className="mt-2 text-sm text-slate-400">New customer requests will show up in this table.</p></div> : <div className="overflow-x-auto"><table className="min-w-full text-left"><thead className="bg-white/[0.05] text-xs font-bold uppercase tracking-[0.18em] text-slate-400"><tr><th className="px-6 py-4 sm:px-8">Service</th><th className="px-6 py-4">Client</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Contact</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Action</th></tr></thead><tbody>{bookings.map((b) => <tr key={b.id} className="border-t border-white/8 text-sm text-slate-300"><td className="px-6 py-5 sm:px-8"><p className="font-semibold text-white">{b.description || 'Customer request'}</p><p className="mt-1 text-xs text-slate-500">{labels[form.serviceType] || 'General service'}</p></td><td className="px-6 py-5"><p className="font-semibold text-white">{b.customerName || 'Customer'}</p><p className="mt-1 text-xs text-slate-500">{b.customerCity || 'City unavailable'}</p></td><td className="px-6 py-5"><p className="font-semibold text-white">{b.bookingDate ? formatDate(b.bookingDate, { year: 'numeric', month: '2-digit', day: '2-digit' }) : 'Pending'}</p><p className="mt-1 text-xs text-slate-500">{formatDate(b.bookingDate)}</p></td><td className="px-6 py-5"><p>{b.customerPhone ? `+91 ${b.customerPhone}` : 'Phone unavailable'}</p><p className="mt-1 text-xs text-slate-500">{b.customerEmail || 'Email unavailable'}</p></td><td className="px-6 py-5"><span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass[b.status] || 'border-white/10 bg-white/5 text-slate-200'}`}>{b.status}</span></td><td className="px-6 py-5">{b.status === 'PENDING' ? <div className="flex flex-wrap gap-2"><button type="button" onClick={() => updateStatus(b.id, 'CONFIRMED')} disabled={activeBookingId === b.id} className="rounded-xl bg-emerald-400 px-3 py-2 text-xs font-bold text-slate-950 disabled:opacity-70">{activeBookingId === b.id ? 'Updating...' : 'Confirm'}</button><button type="button" onClick={() => updateStatus(b.id, 'CANCELLED')} disabled={activeBookingId === b.id} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-white disabled:opacity-70">Decline</button></div> : <span className="text-sm font-bold text-white">View Details</span>}</td></tr>)}</tbody></table></div>}
            </section>

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <section className="rounded-[34px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl sm:p-8">
                <div className="mb-6"><h2 className="text-3xl font-black text-white">Recent Reviews</h2><p className="mt-2 text-sm text-slate-400">What clients are saying</p></div>
                <div className="space-y-5">{reviews.map(([name, date, rating, note]) => <div key={`${name}-${date}`} className="border-t border-white/8 pt-5 first:border-t-0 first:pt-0"><div className="flex items-start justify-between gap-4"><div className="flex items-start gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.07] text-slate-300"><UserCircle2 size={22} /></div><div><p className="text-xl font-semibold text-white">{name}</p><p className="text-sm text-slate-500">{date}</p></div></div><div className="flex items-center gap-1 text-amber-300">{Array.from({ length: 5 }).map((_, i) => <Star key={`${name}-${i}`} size={18} className={i < rating ? 'fill-current' : 'text-slate-600'} />)}</div></div><p className="mt-4 text-base leading-7 text-slate-300">{note}</p></div>)}</div>
              </section>

              <section className="rounded-[34px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl sm:p-8">
                  <h2 className="text-3xl font-black text-white">This Month</h2>
                  <div className="mt-6 space-y-4">{[['Completed Jobs', metrics.confirmed], ['Hours Worked', metrics.confirmed * 3], ['Response Time', metrics.pending ? '8 mins' : 'On track'], ['Profile Completion', `${profileCompletion}%`]].map(([k, v]) => <div key={k} className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3"><span className="text-slate-400">{k}</span><span className="font-bold text-white">{v}</span></div>)}</div>
              </section>
            </div>
          </div>

          <aside className="space-y-6">
            {activePanel === 'notifications' ? (
              <section className="rounded-[34px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl sm:p-8">
                <div className="mb-5 flex items-center justify-between"><div><p className="text-sm uppercase tracking-[0.18em] text-cyan-300">Notifications</p><h2 className="mt-2 text-2xl font-black text-white">Recent Alerts</h2></div><button type="button" onClick={() => setActivePanel(null)} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white">Close</button></div>
                <div className="space-y-3">
                  {metrics.pending ? <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4 text-sm text-slate-300"><p className="font-semibold text-white">{metrics.pending} pending booking request{metrics.pending > 1 ? 's' : ''}</p><p className="mt-1 text-slate-400">Review the booking table and respond to new customers.</p></div> : <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4 text-sm text-slate-300">No new notifications right now.</div>}
                  <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4 text-sm text-slate-300"><p className="font-semibold text-white">Availability status</p><p className="mt-1 text-slate-400">{form.availability ? 'You are visible for new bookings.' : 'You are currently offline for new bookings.'}</p></div>
                </div>
              </section>
            ) : null}

            {activePanel === 'messages' ? (
              <section className="rounded-[34px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl sm:p-8">
                <div className="mb-5 flex items-center justify-between"><div><p className="text-sm uppercase tracking-[0.18em] text-cyan-300">Messages</p><h2 className="mt-2 text-2xl font-black text-white">Inbox</h2></div><button type="button" onClick={() => setActivePanel(null)} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white">Close</button></div>
                <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-5 text-sm text-slate-300">
                  Messaging UI is reserved here. Customer conversations are not connected yet, but this top-bar action now controls the visible panel.
                </div>
              </section>
            ) : null}

            <section className="rounded-[34px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl sm:p-8">
              <div className="mb-5"><h2 className="text-2xl font-black text-white">Schedule Snapshot</h2><p className="mt-2 text-sm text-slate-400">Booked request volume by day.</p></div>
              <div className="space-y-4">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => { const count = bookings.filter((b) => b.bookingDate && new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(`${b.bookingDate}T00:00:00`)) === day).length; return <div key={day}><div className="mb-2 flex items-center justify-between text-sm text-slate-300"><span>{day}</span><span>{count} jobs</span></div><div className="h-2 rounded-full bg-white/5"><div className="theme-progress-fill h-2 rounded-full" style={{ width: `${Math.min(count * 20, 100)}%` }} /></div></div>; })}</div>
            </section>
          </aside>
        </div>
      </div>
    </LiveBackground>
  );
};

export default ProviderDashboard;
