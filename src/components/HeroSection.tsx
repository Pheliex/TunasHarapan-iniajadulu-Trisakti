"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const AUTOPLAY_MS = 5000;

const slides = [
  {
    eyebrow: "01 / TUNAS HARAPAN",
    title: "Membentuk\nMasa Depan.",
    text: "Ruang belajar vokasi yang memadukan kompetensi, karakter, dan keberanian untuk melangkah lebih jauh.",
    image: "/images/school/building-main.png",
    label: "IDENTITY",
  },
  {
    eyebrow: "02 / TEKNOLOGI",
    title: "Belajar lewat\nKarya Nyata.",
    text: "Eksplorasi teknologi melalui praktik, proyek, laboratorium, dan pengalaman yang dekat dengan dunia industri.",
    image: "/images/school/building-secondary.png",
    label: "TECHNOLOGY",
  },
  {
    eyebrow: "03 / PRESTASI",
    title: "Berani untuk\nBerdampak.",
    text: "Mendorong siswa untuk berkarya, berprestasi, dan membawa kompetensi ke dunia nyata.",
    image: "/images/achievements/students-achievement.jpg",
    label: "ACHIEVEMENT",
  },
];

const titleContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const titleLine = {
  hidden: { opacity: 0, y: 44, rotateX: -35 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const slide = slides[active];
  const touchX = useRef<number | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const sy = useSpring(my, { stiffness: 55, damping: 18 });
  const imgX = useTransform(sx, [-0.5, 0.5], [-20, 20]);
  const imgY = useTransform(sy, [-0.5, 0.5], [-12, 12]);
  const bgX = useTransform(sx, [-0.5, 0.5], [14, -14]);
  const bgY = useTransform(sy, [-0.5, 0.5], [10, -10]);

  const go = (dir: number) => {
    setDirection(dir >= 0 ? 1 : -1);
    setActive((prev) => (prev + dir + slides.length) % slides.length);
  };

  const select = (index: number) => {
    setDirection(index > active ? 1 : -1);
    setActive(index);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1);
      setActive((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [active]);

  return (
    <section
      className="hero relative min-h-screen overflow-hidden bg-[#F4F9FF] text-[#021024]"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-y-0 left-0 w-[34%] bg-[#5483B3]" />
        <div className="animate-blob absolute -left-32 top-1/3 size-[30rem] rounded-full bg-white/20 blur-3xl" />
        <div
          className="animate-blob absolute bottom-[-10%] right-[20%] size-[22rem] rounded-full bg-[#5483B3]/15 blur-3xl"
          style={{ animationDelay: "-6s" }}
        />
        <div className="animate-spin-slower absolute right-[-8%] top-[12%] size-[26rem] rounded-full border border-dashed border-[#5483B3]/25" />
        <div className="absolute right-[-8%] top-[12%] size-[26rem] rounded-full border border-[#5483B3]/15" />
        <div className="animate-glow absolute right-[11%] top-[17%] size-2 rounded-full bg-[#5483B3] shadow-[0_0_25px_6px_rgba(84,131,179,.25)]" />
        <div className="absolute left-[8%] bottom-[13%] h-px w-28 bg-white/50" />
        <motion.div
          animate={{ y: [0, -12, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[30%] top-[22%] hidden items-center gap-2 rounded-full border border-[#021024]/10 bg-white/60 px-4 py-2 text-[10px] font-bold uppercase tracking-[.25em] text-[#021024]/60 backdrop-blur-md md:flex"
        >
          <Sparkles size={12} /> Live Campus
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 top-[13%] z-0 flex justify-center px-5 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 34, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -28, scale: 1.01 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="select-none text-[clamp(3.4rem,10vw,10rem)] font-black uppercase leading-[.78] tracking-[-.075em] text-[#021024]/[.11]"
          >
            SMK TELEKOMUNIKASI
            <br />
            TUNAS HARAPAN
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1500px] flex-col px-5 pb-7 pt-28 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[.3em] text-[#021024]/60"
        >
          <span>SMK / TUNAS HARAPAN</span>
          <span className="hidden sm:block">Semarang · Indonesia</span>
          <span className="rounded-full border border-[#021024]/15 bg-white/50 px-3 py-1 backdrop-blur">
            0{active + 1} / 0{slides.length}
          </span>
        </motion.div>

        <div className="relative flex flex-1 items-center justify-center py-10">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.image}
              custom={direction}
              initial={{
                opacity: 0,
                x: 140 * direction,
                scale: 0.93,
                rotate: 1.2 * direction,
              }}
              animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
              exit={{
                opacity: 0,
                x: -140 * direction,
                scale: 1.03,
                rotate: -1 * direction,
              }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.55}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70) go(1);
                else if (info.offset.x > 70) go(-1);
              }}
              style={{ x: imgX, y: imgY }}
              className={`relative flex cursor-grab items-center justify-center active:cursor-grabbing ${active === 2 ? "w-[min(78vw,760px)]" : "w-[min(76vw,900px)]"}`}
            >
              <div className="absolute bottom-[5%] left-1/2 h-20 w-[68%] -translate-x-1/2 rounded-[50%] bg-[#021024]/15 blur-2xl" />
              <motion.img
                src={slide.image}
                alt={slide.label}
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                draggable={false}
                className={`animate-float-slow relative z-10 max-h-[52vh] w-full select-none object-contain drop-shadow-[0_28px_35px_rgba(2,16,36,.22)] ${active === 2 ? "rounded-[2rem] object-cover opacity-95" : ""}`}
              />
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="animate-float-soft absolute -right-2 top-6 z-20 rounded-2xl border border-white/40 bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[.25em] text-[#021024] shadow-xl backdrop-blur-md sm:right-6"
              >
                {slide.label}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-none absolute bottom-[4%] left-1/2 z-20 w-[92%] -translate-x-1/2 text-center sm:bottom-[3%]">
            <p className="text-[clamp(2.2rem,6vw,6rem)] font-black uppercase leading-[.82] tracking-[-.06em] text-[#F4F9FF] drop-shadow-[0_3px_10px_rgba(2,16,36,.28)]">
              SMK TELEKOMUNIKASI
            </p>
            <p className="mt-1 text-[clamp(1rem,2.2vw,2rem)] font-semibold uppercase tracking-[.22em] text-[#F4F9FF]/90 drop-shadow-[0_2px_8px_rgba(2,16,36,.3)]">
              TUNAS HARAPAN
            </p>
          </div>
        </div>

        <div className="grid items-end gap-7 lg:grid-cols-[1fr_auto_1fr]">
          <div className="max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -14, transition: { duration: 0.3 } }}
                variants={titleContainer}
              >
                <motion.p
                  variants={titleLine}
                  className="eyebrow text-[#2F5F8F]"
                >
                  {slide.eyebrow}
                </motion.p>
                <motion.h1
                  variants={titleLine}
                  className="display mt-3 whitespace-pre-line text-4xl leading-[.86] sm:text-6xl"
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  variants={titleLine}
                  className="mt-4 max-w-lg text-sm leading-6 text-[#021024]/60 sm:text-base"
                >
                  {slide.text}
                </motion.p>
                <motion.div variants={titleLine}>
                  <motion.a
                    href="#profil"
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-5 inline-flex items-center gap-3 rounded-full bg-[#021024] px-5 py-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#F4F9FF] shadow-[0_12px_30px_rgba(2,16,36,.25)] transition-colors hover:bg-[#5483B3]"
                  >
                    Jelajahi profil <ArrowUpRight size={15} />
                  </motion.a>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="order-first flex items-center justify-center gap-2 lg:order-none">
            {slides.map((item, index) => (
              <button
                key={item.label}
                onClick={() => select(index)}
                aria-label={`Pilih slide ${index + 1}`}
                className="group flex items-center gap-2 p-1"
              >
                <span
                  className={`relative block h-1 overflow-hidden rounded-full transition-all duration-500 ${active === index ? "w-14 bg-[#021024]/15" : "w-5 bg-[#021024]/20 group-hover:bg-[#021024]/45"}`}
                >
                  {active === index && (
                    <motion.span
                      key={active}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: AUTOPLAY_MS / 1000,
                        ease: "linear",
                      }}
                      className="absolute inset-y-0 left-0 rounded-full bg-[#021024]"
                    />
                  )}
                </span>
                <span
                  className={`font-mono text-[10px] transition ${active === index ? "text-[#021024]" : "text-[#021024]/35"}`}
                >
                  0{index + 1}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-5 lg:justify-end">
            <div className="flex items-center gap-1">
              <motion.button
                aria-label="Previous slide"
                onClick={() => go(-1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                className="grid size-9 place-items-center rounded-full border border-[#021024]/15 text-[#021024]/45 transition hover:border-[#021024]/40 hover:bg-white/40 hover:text-[#021024]"
              >
                <ChevronLeft size={16} />
              </motion.button>
              <motion.button
                aria-label="Next slide"
                onClick={() => go(1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                className="grid size-9 place-items-center rounded-full border border-[#021024]/15 text-[#021024]/45 transition hover:border-[#021024]/40 hover:bg-white/40 hover:text-[#021024]"
              >
                <ChevronRight size={16} />
              </motion.button>
            </div>
            <a
              href="#profil"
              className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.28em] text-[#021024]/45 transition hover:text-[#021024]"
            >
              <span>Scroll</span>
              <span className="grid size-8 place-items-center overflow-hidden rounded-full border border-[#021024]/15">
                <motion.span
                  animate={{ y: [0, 4, 0] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowDown size={13} />
                </motion.span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
