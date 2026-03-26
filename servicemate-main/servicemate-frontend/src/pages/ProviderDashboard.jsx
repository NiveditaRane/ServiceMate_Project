import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  FileText,
  IndianRupee,
  LoaderCircle,
  LogOut,
  MapPin,
  Mail,
  PencilLine,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  Star,
  ToggleLeft,
  ToggleRight,
  UserCircle2,
  Users,
  Wrench,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import LiveBackground from '../components/LiveBackground';

const pipeline = [
  {
    id: 1,
    customer: 'Priya Sharma',
    service: 'Fan wiring inspection',
    time: 'Today, 5:00 PM',
    location: 'Koramangala, Bangalore',
    status: 'New lead',
  },
  {
    id: 2,
    customer: 'Rahul Menon',
    service: 'AC service follow-up',
    time: 'Today, 7:30 PM',
    location: 'Indiranagar, Bangalore',
    status: 'Confirmed',
  },
  {
    id: 3,
    customer: 'Nisha Verma',
    service: 'Switchboard replacement',
    time: '17 Mar, 11:00 AM',
    location: 'HSR Layout, Bangalore',
    status: 'Awaiting quote',
  },
];

const weeklySchedule = [
  { day: 'Mon', jobs: 4 },
  { day: 'Tue', jobs: 3 },
  { day: 'Wed', jobs: 5 },
  { day: 'Thu', jobs: 2 },
  { day: 'Fri', jobs: 6 },
  { day: 'Sat', jobs: 4 },
];

const reviews = [
  {
    name: 'Ananya',
    note: 'Arrived on time and fixed the issue in one visit.',
    rating: '5.0',
  },
  {
    name: 'Vikram',
    note: 'Clear communication, clean work and fair pricing.',
    rating: '4.9',
  },
];

const statCards = [
  {
    label: 'Pending requests',
    value: '12',
    icon: Users,
  },
  {
    label: 'Completed this week',
    value: '18',
    icon: BadgeCheck,
  },
  {
    label: 'Weekly earnings',
    value: 'Rs 24,800',
    icon: IndianRupee,
  },
];

const statusClasses = {
  'New lead': 'border-cyan-300/20 bg-cyan-300/10 text-cyan-200',
  Confirmed: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200',
  'Awaiting quote': 'border-amber-300/20 bg-amber-300/10 text-amber-200',
};

const serviceTypeLabels = {
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  cleaning: 'Cleaning',
  carpentry: 'Carpentry',
};

const defaultProfile = {
  name: '',
  email: '',
  phone: '',
  serviceType: 'electrical',
  city: '',
  bio: '',
};

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [currentUser, setCurrentUser] = useState({ ...defaultProfile, ...storedUser });
  const [isAvailable, setIsAvailable] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    id: currentUser.id,
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    serviceType: currentUser.serviceType || 'electrical',
    city: currentUser.city || '',
    bio: currentUser.bio || '',
  });

  const profileCompletion = useMemo(() => {
    const fields = ['name', 'email', 'phone', 'serviceType', 'city', 'bio'];
    const completedFields = fields.filter((field) => String(profileForm[field] || '').trim()).length;
    return Math.round((completedFields / fields.length) * 100);
  }, [profileForm]);

  const handleProfileFieldChange = (field, value) => {
    setProfileForm((current) => ({
      ...current,
      [field]: field === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value,
    }));
  };

  const handleCancelProfileEdit = () => {
    setProfileForm({
      id: currentUser.id,
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      serviceType: currentUser.serviceType || 'electrical',
      city: currentUser.city || '',
      bio: currentUser.bio || '',
    });
    setIsEditingProfile(false);
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    if (!profileForm.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (profileForm.phone.length !== 10) {
      toast.error('Phone must be 10 digits');
      return;
    }

    if (!profileForm.serviceType) {
      toast.error('Please select a specialty');
      return;
    }

    setIsSavingProfile(true);
    try {
      const response = await api.put('/api/auth/profile', {
        id: profileForm.id,
        name: profileForm.name.trim(),
        phone: profileForm.phone,
        serviceType: profileForm.serviceType,
        city: profileForm.city.trim(),
        bio: profileForm.bio.trim(),
      });

      const updatedUser = {
        ...currentUser,
        ...response.data.user,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setProfileForm({
        id: updatedUser.id,
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        phone: updatedUser.phone || '',
        serviceType: updatedUser.serviceType || 'electrical',
        city: updatedUser.city || '',
        bio: updatedUser.bio || '',
      });
      setIsEditingProfile(false);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <LiveBackground>
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
                <Sparkles size={14} />
                Provider Operations
              </div>
              <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-2xl font-black text-white">
                  {currentUser?.name?.[0] || 'P'}
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
                    {currentUser?.name || 'Service Professional'}
                  </h1>
                  <p className="mt-2 text-sm text-slate-300 sm:text-base">
                    {(serviceTypeLabels[currentUser?.serviceType] || currentUser?.serviceType || 'General')} expert dashboard with live demand, earnings and schedule visibility.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <button
                type="button"
                onClick={() => setIsAvailable((current) => !current)}
                className="theme-button-secondary inline-flex items-center justify-center gap-3 rounded-2xl px-5 py-3 text-sm font-semibold transition"
              >
                {isAvailable ? <ToggleRight size={18} className="text-emerald-300" /> : <ToggleLeft size={18} className="text-slate-500" />}
                {isAvailable ? 'Available for new jobs' : 'Currently offline'}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="theme-button-primary inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {statCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.08 }}
                  className="rounded-3xl border border-white/8 bg-black/20 p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">{card.label}</p>
                    <Icon size={18} className="text-slate-300" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-white">{card.value}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.header>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                    <UserCircle2 size={14} />
                    Provider Profile
                  </div>
                  <h2 className="text-2xl font-bold text-white">Build trust before the first call</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Keep your core details sharp so customers see the right specialty, location and service identity.
                  </p>
                </div>

                {!isEditingProfile ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="theme-button-secondary inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition"
                  >
                    <PencilLine size={16} />
                    Edit profile
                  </button>
                ) : null}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[28px] border border-white/8 bg-black/20 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-cyan-300/30 to-emerald-300/20 text-3xl font-black text-white">
                      {(profileForm.name || currentUser.name || 'P').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{profileForm.name || 'Service Professional'}</h3>
                      <p className="mt-1 text-sm text-cyan-200">
                        {serviceTypeLabels[profileForm.serviceType] || profileForm.serviceType || 'General specialist'}
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        {profileForm.city?.trim() || 'Add your city to improve local discovery'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 text-sm text-slate-300">
                    <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                      <Mail size={16} className="text-slate-400" />
                      <span>{profileForm.email || 'No email available'}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                      <Phone size={16} className="text-slate-400" />
                      <span>{profileForm.phone ? `+91 ${profileForm.phone}` : 'Add a contact number'}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                      <MapPin size={16} className="text-slate-400" />
                      <span>{profileForm.city || 'City not added yet'}</span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl border border-emerald-300/10 bg-emerald-300/5 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">Profile completion</p>
                        <p className="mt-1 text-sm text-slate-400">A stronger profile helps conversion and response quality.</p>
                      </div>
                      <span className="text-2xl font-black text-emerald-200">{profileCompletion}%</span>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/5">
                      <div
                        className="theme-progress-fill h-2 rounded-full"
                        style={{ width: `${profileCompletion}%` }}
                      />
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="rounded-[28px] border border-white/8 bg-black/20 p-5">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">Profile details</h3>
                      <p className="mt-1 text-sm text-slate-400">Update how customers see and contact you.</p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-slate-300">
                      <BriefcaseBusiness size={14} />
                      Provider
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-300">Full name</span>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(event) => handleProfileFieldChange('name', event.target.value)}
                        disabled={!isEditingProfile || isSavingProfile}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 disabled:cursor-not-allowed disabled:opacity-70"
                        placeholder="Your public display name"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-300">Phone</span>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(event) => handleProfileFieldChange('phone', event.target.value)}
                        disabled={!isEditingProfile || isSavingProfile}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 disabled:cursor-not-allowed disabled:opacity-70"
                        placeholder="10-digit mobile number"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-300">Specialty</span>
                      <select
                        value={profileForm.serviceType}
                        onChange={(event) => handleProfileFieldChange('serviceType', event.target.value)}
                        disabled={!isEditingProfile || isSavingProfile}
                        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-300/40 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {Object.entries(serviceTypeLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-300">City</span>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(event) => handleProfileFieldChange('city', event.target.value)}
                        disabled={!isEditingProfile || isSavingProfile}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 disabled:cursor-not-allowed disabled:opacity-70"
                        placeholder="Where you primarily serve"
                      />
                    </label>
                  </div>

                  <label className="mt-4 block">
                    <span className="mb-2 block text-sm font-medium text-slate-300">Email</span>
                    <input
                      type="email"
                      value={profileForm.email}
                      disabled
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-slate-400 outline-none"
                    />
                  </label>

                  <label className="mt-4 block">
                    <span className="mb-2 block text-sm font-medium text-slate-300">Professional bio</span>
                    <textarea
                      value={profileForm.bio}
                      onChange={(event) => handleProfileFieldChange('bio', event.target.value)}
                      disabled={!isEditingProfile || isSavingProfile}
                      rows={5}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 disabled:cursor-not-allowed disabled:opacity-70"
                      placeholder="Highlight your experience, approach and what customers can expect."
                    />
                  </label>

                  <div className="mt-5 rounded-3xl border border-white/8 bg-white/[0.03] p-4 text-sm text-slate-300">
                    <div className="flex items-start gap-3">
                      <FileText size={18} className="mt-0.5 text-cyan-200" />
                      <p>
                        Customers are more likely to trust profiles with a clear specialty, service area and a short intro.
                      </p>
                    </div>
                  </div>

                  {isEditingProfile ? (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="theme-button-primary inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isSavingProfile ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
                        Save profile
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelProfileEdit}
                        disabled={isSavingProfile}
                        className="theme-button-secondary inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : null}
                </form>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Incoming job pipeline</h2>
                  <p className="mt-1 text-sm text-slate-400">Review your newest requests and upcoming visits.</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  <ShieldCheck size={14} />
                  Verified provider
                </div>
              </div>

              <div className="space-y-4">
                {pipeline.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.24 + index * 0.08 }}
                    className="rounded-3xl border border-white/8 bg-black/20 p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-white">{job.service}</p>
                        <p className="mt-1 text-sm text-slate-300">{job.customer}</p>
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                          statusClasses[job.status] || 'border-white/10 bg-white/5 text-slate-200'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={15} />
                        <span>{job.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={15} />
                        <span>{job.location}</span>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        className="theme-button-primary rounded-2xl px-4 py-2 text-sm font-semibold transition"
                      >
                        Accept job
                      </button>
                      <button
                        type="button"
                        className="theme-button-secondary rounded-2xl px-4 py-2 text-sm font-semibold transition"
                      >
                        Send quote
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
            >
              <div className="mb-5">
                <h2 className="text-xl font-bold text-white">Customer feedback</h2>
                <p className="mt-1 text-sm text-slate-400">Recent ratings that shape your visibility.</p>
              </div>

              <div className="grid gap-4">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.name}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.34 + index * 0.08 }}
                    className="rounded-3xl border border-white/8 bg-black/20 p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-lg font-semibold text-white">{review.name}</p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-300/10 px-3 py-1 text-sm font-semibold text-amber-200">
                        <Star size={14} className="fill-current" />
                        {review.rating}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{review.note}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-6"
          >
            <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-white">Weekly schedule</h2>
                <p className="mt-1 text-sm text-slate-400">Estimated job load across the week.</p>
              </div>

              <div className="space-y-4">
                {weeklySchedule.map((slot) => (
                  <div key={slot.day}>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                      <span>{slot.day}</span>
                      <span>{slot.jobs} jobs</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5">
                      <div
                        className="theme-progress-fill h-2 rounded-full"
                        style={{ width: `${Math.min(slot.jobs * 15, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-emerald-400/12 via-white/[0.04] to-transparent p-6 backdrop-blur-xl">
              <div className="inline-flex rounded-2xl border border-emerald-200/20 bg-emerald-200/10 p-3 text-emerald-100">
                <Wrench size={20} />
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">Performance snapshot</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                  <span>Response time</span>
                  <span className="font-semibold text-white">8 mins</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                  <span>Completion rate</span>
                  <span className="font-semibold text-white">96%</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                  <span>Average rating</span>
                  <span className="font-semibold text-white">4.9/5</span>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <Clock3 size={18} className="text-cyan-200" />
                <h2 className="text-xl font-bold text-white">Today at a glance</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                You have 3 active requests, 2 confirmed visits and 1 quote waiting for approval.
              </p>
            </section>
          </motion.aside>
        </div>
      </div>
    </LiveBackground>
  );
};

export default ProviderDashboard;
