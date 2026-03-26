import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, ShieldCheck, Zap, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

const Home = () => {
  const [index, setIndex] = useState(0);

  const slides = [
    {
      title: "Premium AC Repair",
      desc: "Stay cool with expert servicing.",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1600&auto=format&fit=crop",
      color: "from-blue-500",
    },
    {
      title: "Electrical Experts",
      desc: "Safe and smart installations.",
      image:
        "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1600&auto=format&fit=crop",
      color: "from-yellow-500",
    },
    {
      title: "Deep Home Cleaning",
      desc: "A spotless, healthy home.",
      image:
        "https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?q=80&w=1600&auto=format&fit=crop",
      color: "from-green-500",
    },
    {
      title: "Plumbing Services",
      desc: "Fix leaks instantly & reliably.",
      image:
        "https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=1600&auto=format&fit=crop",
      color: "from-cyan-500",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="h-screen w-full overflow-hidden 
    bg-white dark:bg-slate-950 
    text-slate-900 dark:text-white 
    flex flex-col justify-between px-8 lg:px-20"
    >
      {/* NAVBAR */}
      <header className="flex justify-between items-center py-6">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-white">
            S
          </div>
          <span className="text-2xl font-black">ServiceMate</span>
        </div>

        {/* NAV */}
        <div className="flex gap-4 items-center">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Login */}
          <Link
            to="/login"
            className="px-5 py-2 rounded-full border border-slate-300 dark:border-white/20 
            text-slate-700 dark:text-white 
            hover:bg-slate-100 dark:hover:bg-white/10 transition"
          >
            Login
          </Link>

          {/* Signup */}
          <Link
            to="/signup"
            className="px-5 py-2 bg-cyan-400 text-black rounded-full font-bold hover:bg-cyan-300 transition"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <div className="grid lg:grid-cols-2 items-center gap-12 flex-1">
        {/* LEFT */}
        <div>
          <div className="flex items-center gap-2 text-cyan-500 mb-4">
            <Zap size={18} />
            <span className="text-sm uppercase tracking-widest">
              Trusted Professionals
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black leading-tight">
            Home Services <br />
            <span className="text-slate-500 dark:text-slate-400">
              Done Right.
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-lg">
            Book trusted experts for AC, electrical, plumbing, and cleaning services.
          </p>

          {/* ✅ Get Started → Login */}
          <div className="flex items-center gap-6 mt-10">
            <Link
              to="/login"
              className="flex items-center gap-3 
              bg-black text-white 
              dark:bg-white dark:text-black 
              px-6 py-3 rounded-xl font-bold hover:bg-cyan-400 transition"
            >
              Get Started <ArrowRight />
            </Link>

            <div className="flex items-center gap-2">
              <Star className="text-orange-400" fill="currentColor" />
              <span className="font-bold">4.9</span>
            </div>
          </div>

          <div className="flex gap-6 mt-10 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-cyan-500" />
              Verified Experts
            </div>
            <div className="flex items-center gap-2">
              <Heart className="text-pink-500" />
              Insured Work
            </div>
          </div>
        </div>

        {/* RIGHT SLIDER */}
        <div className="flex justify-center">
          <div className="relative w-[500px] h-[300px] rounded-2xl overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <img
                  src={slides[index].image}
                  className="w-full h-full object-cover scale-105 hover:scale-110 transition duration-700"
                  alt="service"
                />

                {/* overlays */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${slides[index].color} opacity-30`}
                />
                <div
                  className="absolute inset-0 
                bg-gradient-to-t 
                from-white/80 dark:from-black 
                via-transparent"
                />

                {/* text */}
                <div className="absolute bottom-5 left-5 right-5">
                  <h2 className="text-lg font-bold text-black dark:text-white">
                    {slides[index].title}
                  </h2>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {slides[index].desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer
        className="flex justify-between text-xs 
      text-slate-500 
      py-4 border-t border-black/10 dark:border-white/5"
      >
        <span>ISO Certified</span>
        <span>24/7 Support</span>
        <span>Flat Pricing</span>
        <span>Premium Quality</span>
      </footer>
    </div>
  );
};

export default Home;