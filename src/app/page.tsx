"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import Reveal from "@/components/Reveal";
import { Counter, ScrollProgress } from "@/components/Effects";
import Chatbot from "@/components/Chatbot";

const nav = [
  ["Profil", "#profil"],
  ["Jurusan", "#jurusan"],
  ["Fasilitas", "#fasilitas"],
  ["Prestasi", "#prestasi"],
  ["Partner", "#partner"],
];

function PageNav() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      setAtTop(current < 24);
      if (current < 24 || current < last - 4) setVisible(true);
      else if (current > last + 8) {
        setVisible(false);
        setOpen(false);
      }
      last = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: visible ? 0 : -110, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6"
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-4 py-3 transition-all duration-300 sm:px-6 ${atTop ? "border-[#021024]/10 bg-[#F4F9FF]/45 text-[#021024]" : "border-white/20 bg-[#021024]/85 text-[#F4F9FF] shadow-xl backdrop-blur-xl"}`}
      >
        <a href="#top" className="flex items-center gap-3">
          <span className="grid size-9 overflow-hidden rounded-full bg-white/90 p-1">
            <img
              src="/images/school/logo-transparent.png"
              alt="Logo SMK Telekomunikasi Tunas Harapan"
              className="h-full w-full object-contain"
            />
          </span>
          <span className="hidden text-sm font-semibold tracking-wide sm:block">
            TUNAS HARAPAN
          </span>
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm opacity-70 transition hover:bg-white/10 hover:opacity-100"
            >
              {label}
            </a>
          ))}
        </nav>
        <span className="hidden rounded-full border border-current/15 px-4 py-2 text-[10px] font-bold uppercase tracking-[.16em] opacity-45 md:block">
          R1ELS AI
        </span>
        <button
          aria-label="Buka menu"
          onClick={() => setOpen(!open)}
          className="grid size-10 place-items-center rounded-full bg-black/5 md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto mt-2 max-w-7xl rounded-3xl border border-[#021024]/10 bg-[#F4F9FF]/95 p-3 text-[#021024] shadow-2xl backdrop-blur-xl md:hidden"
          >
            {nav.map(([label, href]) => (
              <a
                onClick={() => setOpen(false)}
                key={href}
                href={href}
                className="block rounded-2xl px-4 py-3 text-sm opacity-70 hover:bg-white/40 hover:opacity-100"
              >
                {label}
              </a>
            ))}
            <span className="mt-2 block rounded-2xl bg-[#021024]/5 px-4 py-3 text-center text-sm font-semibold opacity-55">
              R1ELS AI tersedia di kanan bawah
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function AboutSection() {
  const stats = [
    { value: 4, suffix: "", label: "Program Keahlian" },
    { value: 12, suffix: "+", label: "Lab & Studio" },
    { value: 30, suffix: "+", label: "Mitra Industri" },
  ];
  return (
    <motion.section
      id="profil"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="section-grid-animated relative overflow-hidden bg-[#F4F9FF] px-6 py-24 text-[#021024] sm:py-32"
    >
      <div className="animate-blob pointer-events-none absolute -left-24 top-10 size-[24rem] rounded-full bg-[#5483B3]/15 blur-3xl" />
      <div
        className="animate-blob pointer-events-none absolute -right-20 bottom-0 size-[20rem] rounded-full bg-[#C1E8FF]/40 blur-3xl"
        style={{ animationDelay: "-7s" }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
        <motion.div
          initial={{ x: -35, opacity: 0, filter: "blur(6px)" }}
          whileInView={{ x: 0, opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow text-[#2F5F8F]">01 / PROFIL</p>
          <h2 className="display mt-5 text-5xl sm:text-7xl">
            Sekolah yang bergerak bersama masa depan.
          </h2>
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="animate-gradient-pan mt-6 block h-1 w-24 origin-left rounded-full bg-gradient-to-r from-[#5483B3] via-[#C1E8FF] to-[#5483B3]"
          />
          <div className="mt-8 flex gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
              >
                <p className="text-3xl font-black tracking-tight sm:text-4xl">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[.2em] text-[#021024]/45">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ x: 35, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="grid gap-8 sm:grid-cols-2"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-[.18em] text-[#021024]/40">
              Tentang kami
            </p>
            <p className="mt-4 text-lg leading-8 text-[#021024]/65">
              SMK Telekomunikasi Tunas Harapan membangun lingkungan belajar
              vokasi yang dekat dengan teknologi, karakter, dan kebutuhan
              industri.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[.18em] text-[#021024]/40">
              Arah
            </p>
            <p className="mt-4 text-lg leading-8 text-[#021024]/65">
              Belajar bukan sekadar mengejar nilai, tetapi menyiapkan karya,
              kompetensi, dan keberanian untuk masuk ke dunia nyata.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function NextGeneration() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const orbY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const stars = [
    [8, 18],
    [16, 66],
    [24, 30],
    [33, 78],
    [44, 14],
    [55, 58],
    [64, 24],
    [72, 70],
    [82, 38],
    [90, 62],
    [12, 44],
    [48, 84],
  ];
  return (
    <section
      ref={ref}
      className="relative min-h-[650px] overflow-hidden bg-[#021024] px-6 py-24 text-[#F4F9FF] sm:py-32"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="animate-gradient-pan absolute inset-0 bg-[radial-gradient(circle_at_72%_44%,rgba(84,131,179,.32),transparent_32%),radial-gradient(circle_at_15%_85%,rgba(193,232,255,.12),transparent_30%)]"
      />
      <motion.div
        style={{ y: orbY }}
        className="absolute left-[-3%] top-[10%] size-48 rounded-full border border-[#F4F9FF]/10 bg-[#5483B3]/10 shadow-[0_0_100px_rgba(84,131,179,.18)]"
      >
        <span className="animate-ring absolute inset-0 rounded-full border border-[#C1E8FF]/40" />
      </motion.div>
      <div className="animate-orbit absolute left-[-3%] top-[10%] size-48 rounded-full border border-dashed border-[#F4F9FF]/15" />
      <div className="animate-blob absolute right-[10%] top-[6%] size-64 rounded-full bg-[#5483B3]/20 blur-3xl" />
      {stars.map(([left, top], i) => (
        <span
          key={i}
          className="animate-twinkle absolute size-1.5 rounded-full bg-white"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${(i % 6) * 0.55}s`,
          }}
        />
      ))}
      <motion.div
        style={{ y: imgY }}
        className="absolute right-[-3%] bottom-[-3%] w-[66%] max-w-5xl opacity-95"
      >
        <motion.img
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 0.92, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.15 }}
          src="/images/school/building-secondary.png"
          alt="Gedung sekolah"
          className="animate-kenburns w-full object-contain brightness-[.78] grayscale contrast-125 drop-shadow-[0_-20px_50px_rgba(84,131,179,.12)]"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#021024] via-[#021024]/45 to-transparent" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: -12 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="absolute right-[6%] top-[8%] z-20 flex flex-col items-center"
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[clamp(130px,18vw,240px)] rounded-[2rem] border border-white/45 bg-[#F4F9FF]/95 p-3 shadow-[0_24px_80px_rgba(0,0,0,.28)] backdrop-blur-md sm:p-5"
        >
          <img
            src="/images/school/logo-transparent.png"
            alt="Logo SMK Telekomunikasi Tunas Harapan"
            className="h-auto w-full object-contain"
          />
        </motion.div>
        <p className="mt-3 text-[9px] font-bold uppercase tracking-[.35em] text-[#C1E8FF]/60">
          SCHOOL IDENTITY
        </p>
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[470px] max-w-7xl items-end">
        <motion.div style={{ y: textY }}>
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="eyebrow text-[#5483B3]">THE NEXT GENERATION</p>
            <h2 className="display mt-5 max-w-3xl text-6xl sm:text-8xl">
              Sekolah yang{" "}
              <span className="shimmer-text text-[#F4F9FF]/35">
                terus bergerak.
              </span>
            </h2>
            <p className="mt-7 max-w-xl text-base leading-8 text-[#F4F9FF]/55">
              Teknologi berubah. Dunia berubah. Cara belajar pun ikut berkembang
              — tanpa kehilangan karakter dan identitas.
            </p>
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {["Vokasi", "Teknologi", "Karakter"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[.22em] text-white/70 backdrop-blur"
                >
                  {chip}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Programs() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const items = [
    [
      "01",
      "PPLG",
      "Pengembangan Perangkat Lunak dan Gim",
      "/images/majors/01.jpg",
    ],
    [
      "02",
      "TJKT",
      "Teknik Jaringan Komputer dan Telekomunikasi",
      "/images/majors/tjkt.jpg",
    ],
    ["03", "DKV", "Desain Komunikasi Visual", "/images/majors/03.jpg"],
    ["04", "TKR", "Teknik Kendaraan Ringan", "/images/majors/04.jpg"],
  ];
  return (
    <section
      ref={ref}
      id="jurusan"
      className="relative overflow-hidden bg-[#021024] px-6 py-24 text-[#F4F9FF] sm:py-32"
    >
      <div className="animate-gradient-pan absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_70%_30%,rgba(84,131,179,.22),transparent_38%)]" />
      <motion.div
        style={{ y: glowY }}
        className="animate-blob pointer-events-none absolute -left-28 top-1/3 size-[26rem] rounded-full bg-[#5483B3]/20 blur-3xl"
      />
      <div className="animate-orbit pointer-events-none absolute right-[8%] top-[10%] size-56 rounded-full border border-dashed border-white/10" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="eyebrow text-[#5483B3]">02 / PROGRAM KEAHLIAN</p>
            <h2 className="display mt-5 text-5xl sm:text-7xl">
              Belajar yang{" "}
              <span className="text-[#F4F9FF]/35">punya arah.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-[#F4F9FF]/45">
            Empat bidang untuk mengeksplorasi software, jaringan, desain, dan
            otomotif.
          </p>
        </motion.div>
        <div className="mt-16 divide-y divide-[#F4F9FF]/10 border-y border-[#F4F9FF]/10">
          {items.map(([num, title, desc, image], i) => (
            <motion.a
              initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.55,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ x: 10 }}
              href="#fasilitas"
              key={title}
              className="shine group relative grid grid-cols-[48px_1fr_auto] items-center gap-5 overflow-hidden py-8 sm:grid-cols-[80px_1fr_1.2fr_auto]"
            >
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.08 }}
                className="absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-[#5483B3] via-[#C1E8FF] to-transparent opacity-60"
              />
              <div className="pointer-events-none absolute inset-y-0 right-12 w-72 opacity-0 transition duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-l from-[#5483B3]/25 to-transparent" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 24,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="major-photo-slot absolute right-0 top-1/2 size-40 -translate-y-1/2 rounded-full border border-[#F4F9FF]/15 bg-[#F4F9FF]/[.03]"
                >
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full scale-110 object-cover opacity-0 grayscale transition duration-500 group-hover:opacity-60"
                  />
                  <span className="absolute">PHOTO</span>
                </motion.div>
              </div>
              <span className="relative z-10 font-mono text-xs text-[#5483B3]/80 transition group-hover:text-[#C1E8FF]">
                {num}
              </span>
              <div className="relative z-10">
                <h3 className="text-3xl font-semibold tracking-tight transition duration-300 group-hover:translate-x-1 group-hover:text-white sm:text-5xl">
                  {title}
                  <span className="ml-3 inline-block rounded-full border border-[#C1E8FF]/25 bg-[#C1E8FF]/10 px-3 py-1 align-middle text-[9px] font-bold tracking-[.2em] text-[#C1E8FF]/80 opacity-0 transition duration-300 group-hover:opacity-100">
                    <Counter to={(i + 1) * 12} suffix="+" />
                  </span>
                </h3>
                <p className="mt-2 text-xs text-[#F4F9FF]/35 sm:hidden">
                  {desc}
                </p>
              </div>
              <p className="relative z-10 hidden text-sm leading-6 text-[#F4F9FF]/40 transition group-hover:text-[#F4F9FF]/70 sm:block">
                {desc}
              </p>
              <motion.span
                whileHover={{ scale: 1.15, rotate: 8 }}
                className="relative z-10 grid size-11 place-items-center rounded-full border border-white/10 transition group-hover:border-[#C1E8FF]/50 group-hover:bg-[#C1E8FF]/10"
              >
                <ArrowUpRight className="text-[#F4F9FF]/25 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#C1E8FF]" />
              </motion.span>
            </motion.a>
          ))}
        </div>
        <p className="mt-5 text-[10px] uppercase tracking-[.2em] text-[#F4F9FF]/20">
          Photo slots ready — tambahkan foto jurusan nanti ke
          public/images/majors/
        </p>
      </div>
    </section>
  );
}

function Facilities() {
  const cards = [
    {
      span: "md:col-span-7 md:row-span-2",
      art: "facility-photo-main",
      big: "LAB",
      bigCls: "text-7xl font-black tracking-[-.08em]",
      label: "Computer & Creative Lab",
    },
    {
      span: "md:col-span-5",
      art: "facility-photo-secondary",
      big: "NET",
      bigCls: "text-5xl font-black",
      label: "Network Lab",
    },
    {
      span: "md:col-span-5",
      art: "facility-photo-tertiary",
      big: "MEDIA",
      bigCls: "text-5xl font-black",
      label: "Multimedia Studio",
    },
  ];
  return (
    <section
      id="fasilitas"
      className="relative overflow-hidden bg-[#F4F9FF] px-6 py-24 text-[#021024] sm:py-32"
    >
      <div className="animate-blob pointer-events-none absolute -right-28 top-10 size-[26rem] rounded-full bg-[#5483B3]/15 blur-3xl" />
      <div
        className="animate-blob pointer-events-none absolute -left-24 bottom-0 size-[22rem] rounded-full bg-[#C1E8FF]/50 blur-3xl"
        style={{ animationDelay: "-6s" }}
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-5 md:grid-cols-[1fr_1.7fr] md:items-end">
          <Reveal>
            <p className="eyebrow text-[#2F5F8F]">03 / FASILITAS</p>
            <h2 className="display mt-5 text-5xl sm:text-7xl">
              Ruang untuk <span className="text-black/35">mencoba.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-xl text-base leading-8 text-[#021024]/55">
              Visual fasilitas sudah disiapkan sebagai slot foto. Nanti foto
              asli dapat dimasukkan ke folder public/images/facilities/ tanpa
              mengubah layout.
            </p>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-12 md:grid-rows-2">
          {cards.map((card, i) => (
            <Reveal key={card.big} className={card.span} delay={i * 0.08}>
              <div className="facility-card card-lift img-zoom shadow-[0_18px_50px_rgba(2,16,36,.08)] hover:shadow-[0_28px_70px_rgba(84,131,179,.28)]">
                <motion.div
                  whileHover={{ scale: 1.015, rotateX: 3, rotateY: -3 }}
                  transition={{ type: "spring", stiffness: 220, damping: 22 }}
                  className={`facility-art shine ${card.art}`}
                  style={{ transformPerspective: 900 }}
                >
                  <motion.span
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 5 + i,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.6,
                    }}
                    className={`relative z-10 text-white/90 ${card.bigCls}`}
                  >
                    {card.big}
                  </motion.span>
                  <span className="absolute bottom-6 left-6 z-10 text-sm uppercase tracking-[.2em] text-white/60">
                    {card.label}
                  </span>
                  <span className="absolute right-6 top-6 z-10 grid size-10 place-items-center rounded-full border border-white/25 bg-white/10 text-[10px] font-bold text-white/80 backdrop-blur transition group-hover:bg-white/20">
                    0{i + 1}
                  </span>
                </motion.div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Partners() {
  const slots = ["01", "02", "03", "04", "05", "06"];
  const row = [...slots, ...slots];
  return (
    <section
      id="partner"
      className="relative overflow-hidden bg-[#052659] py-20 text-[#F4F9FF] sm:py-24"
    >
      <div className="animate-gradient-pan pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(84,131,179,.25),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(193,232,255,.1),transparent_30%)]" />
      <div className="animate-blob pointer-events-none absolute -left-24 top-0 size-[22rem] rounded-full bg-[#5483B3]/25 blur-3xl" />
      <div
        className="animate-blob pointer-events-none absolute -right-20 bottom-0 size-[20rem] rounded-full bg-[#C1E8FF]/10 blur-3xl"
        style={{ animationDelay: "-8s" }}
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="eyebrow text-[#C1E8FF]">06 / INDUSTRY CONNECTIONS</p>
          <h2 className="display mt-4 text-4xl sm:text-6xl">
            Industry{" "}
            <span className="shimmer-text text-[#C1E8FF]/45">Partners.</span>
          </h2>
        </Reveal>
      </div>
      <div className="relative mt-6 border-b border-white/10 py-8">
        <div className="partner-marquee flex w-max items-center gap-5">
          {row.map((slot, i) => (
            <motion.div
              key={`${slot}-${i}`}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: (i % 6) * 0.4,
              }}
              className="flex h-24 w-[220px] shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-white/[.03] px-8 backdrop-blur-sm transition-colors duration-500 hover:border-[#C1E8FF]/30 hover:bg-white/[.07]"
            >
              <img
                src={`/images/partners/${slot}.png`}
                alt=""
                className="max-h-14 max-w-[175px] object-contain opacity-90 transition duration-500 hover:scale-110 hover:opacity-100 hover:drop-shadow-[0_10px_25px_rgba(193,232,255,.35)]"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </motion.div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#052659] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#052659] to-transparent" />
      </div>
      <div className="relative mx-auto mt-5 flex max-w-7xl items-center justify-between px-6 text-[9px] uppercase tracking-[.18em] text-white/20">
        <span>public/images/partners/01.png — 06.png</span>
        <span className="animate-glow">Auto scroll · hover to pause</span>
      </div>
    </section>
  );
}

function Achievements() {
  const cards = [
    { num: "01", label: "Project showcase", value: 85 },
    { num: "02", label: "Competition", value: 70 },
    { num: "03", label: "Certification", value: 90 },
    { num: "04", label: "Industry", value: 75 },
  ];
  return (
    <section
      id="prestasi"
      className="relative overflow-hidden bg-[#F4F9FF] px-6 py-24 text-[#021024] sm:py-32"
    >
      <div className="animate-blob pointer-events-none absolute -left-28 top-8 size-[24rem] rounded-full bg-[#5483B3]/12 blur-3xl" />
      <div
        className="animate-blob pointer-events-none absolute -right-24 bottom-0 size-[22rem] rounded-full bg-[#C1E8FF]/45 blur-3xl"
        style={{ animationDelay: "-6s" }}
      />
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <p className="eyebrow text-[#2F5F8F]">04 / PRESTASI</p>
        </Reveal>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
          <Reveal delay={0.05}>
            <p className="display max-w-4xl text-5xl sm:text-7xl">
              Bukan hanya belajar.{" "}
              <span className="text-black/35">Bikin sesuatu.</span>
            </p>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#021024]/55">
              Section ini siap diisi data prestasi, proyek siswa, sertifikasi,
              atau pencapaian sekolah yang benar-benar dimiliki tim.
            </p>
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#021024]/10 bg-white/70 px-5 py-3 text-[10px] font-bold uppercase tracking-[.22em] text-[#021024]/60 shadow-lg backdrop-blur"
            >
              <span className="animate-glow size-2 rounded-full bg-[#5483B3]" />
              Updated tiap semester
            </motion.div>
          </Reveal>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-black/10 bg-black/10 shadow-[0_20px_60px_rgba(2,16,36,.08)]">
            {cards.map((card, i) => (
              <motion.div
                key={card.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ scale: 1.04, backgroundColor: "#EAF4FF" }}
                className="shine group bg-[#F4F9FF] p-7"
              >
                <p className="text-5xl font-semibold tracking-tight transition group-hover:text-[#2F5F8F]">
                  <Counter to={parseInt(card.num, 10)} />
                </p>
                <p className="mt-3 text-xs uppercase tracking-[.18em] text-black/45">
                  {card.label}
                </p>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-black/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${card.value}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.2,
                      delay: 0.3 + i * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="animate-gradient-pan h-full rounded-full bg-gradient-to-r from-[#5483B3] via-[#C1E8FF] to-[#5483B3]"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div id="top" className="overflow-x-hidden bg-[#F4F9FF]">
      <AnimatePresence>
        {loading && (
          <LoadingScreen schoolName="SMK TELEKOMUNIKASI TUNAS HARAPAN" />
        )}
      </AnimatePresence>
      {!loading && (
        <>
          <PageNav />
          <ScrollProgress />
          <HeroSection />
          <AboutSection />
          <NextGeneration />
          <Programs />
          <Facilities />
          <StatsSection />
          <Partners />
          <Achievements />
          <footer className="relative overflow-hidden bg-[#021024] px-6 pb-8 pt-16 text-[#F4F9FF]">
            <div className="animate-gradient-pan pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(84,131,179,.2),transparent_35%),radial-gradient(circle_at_90%_100%,rgba(193,232,255,.08),transparent_30%)]" />
            <div className="relative mx-auto max-w-7xl">
              <div className="grid gap-10 border-b border-[#F4F9FF]/10 pb-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
                <div>
                  <p className="text-lg font-semibold">
                    SMK TELEKOMUNIKASI
                    <br />
                    TUNAS HARAPAN
                  </p>
                  <p className="mt-4 max-w-sm text-sm leading-7 text-[#F4F9FF]/45">
                    Membangun kompetensi, karakter, dan karya untuk generasi
                    yang siap menghadapi masa depan.
                  </p>
                </div>
                <div>
                  <p className="eyebrow text-[#5483B3]">EXPLORE</p>
                  <div className="mt-4 space-y-3 text-sm text-[#F4F9FF]/50">
                    <a className="block hover:text-[#F4F9FF]" href="#profil">
                      Profil
                    </a>
                    <a className="block hover:text-[#F4F9FF]" href="#jurusan">
                      Jurusan
                    </a>
                    <a className="block hover:text-[#F4F9FF]" href="#fasilitas">
                      Fasilitas
                    </a>
                  </div>
                </div>
                <div>
                  <p className="eyebrow text-[#5483B3]">CONNECT</p>
                  <div className="mt-4 space-y-3 text-sm text-[#F4F9FF]/50">
                    <span className="block">Sekolah · Semarang</span>
                    <span className="block">Informasi & pendaftaran</span>
                    <span className="block text-white/45">
                      R1ELS AI · kanan bawah
                    </span>
                  </div>
                </div>
                <div>
                  <p className="eyebrow text-[#5483B3]">BACK TO TOP</p>
                  <a
                    href="#top"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-[#F4F9FF]/55 hover:text-[#F4F9FF]"
                  >
                    Kembali ke atas{" "}
                    <ChevronDown className="rotate-180" size={16} />
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-7 text-[10px] uppercase tracking-[.18em] text-[#F4F9FF]/30 sm:flex-row sm:items-center sm:justify-between">
                <span>© 2026 SMK Telekomunikasi Tunas Harapan</span>
                <span>Frontend concept · Next.js · Tailwind CSS</span>
              </div>
            </div>
          </footer>
          <Chatbot />
        </>
      )}
    </div>
  );
}
