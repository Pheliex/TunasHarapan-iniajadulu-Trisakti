'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Counter } from '@/components/Effects';

const stats = [
  { n: '01', value: 98, suffix: '%', title: 'AKREDITASI', desc: 'Mutu pembelajaran dan pengelolaan sekolah' },
  { n: '02', value: 12, suffix: '+', title: 'LABORATORIUM', desc: 'Ruang praktik untuk teknologi dan kreativitas' },
  { n: '03', value: 30, suffix: '+', title: 'INDUSTRI', desc: 'Kolaborasi untuk pengalaman dunia kerja' },
  { n: '04', value: 250, suffix: '+', title: 'PRESTASI', desc: 'Karya dan capaian siswa yang terus tumbuh' },
];

export default function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const blobY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const lineScale = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#5483B3] px-6 py-24 text-[#021024] sm:py-32">
      <div className="animate-gradient-pan absolute inset-0 bg-[linear-gradient(120deg,rgba(244,249,255,.14),transparent_40%,rgba(2,16,36,.12))]" />
      <motion.div style={{ y: blobY }} className="animate-blob pointer-events-none absolute -right-24 -top-24 size-[26rem] rounded-full bg-white/15 blur-3xl" />
      <div className="animate-blob pointer-events-none absolute -left-24 bottom-[-6rem] size-[22rem] rounded-full bg-[#021024]/15 blur-3xl" style={{ animationDelay: '-7s' }} />
      <motion.div style={{ scaleX: lineScale }} className="absolute inset-x-0 top-0 h-[3px] origin-center bg-gradient-to-r from-transparent via-white/60 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 26, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <p className="eyebrow text-[#F4F9FF]">05 / AT A GLANCE</p>
          <p className="animate-glow rounded-full border border-white/30 bg-white/10 px-4 py-1 text-[10px] font-bold uppercase tracking-[.25em] text-white backdrop-blur">
            Live numbers
          </p>
        </motion.div>

        <div className="mt-12 divide-y divide-[#021024]/15 border-y border-[#021024]/15">
          {stats.map((item, i) => (
            <motion.div
              key={item.n}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ x: 10, backgroundColor: 'rgba(244,249,255,.14)' }}
              className="group grid cursor-default gap-5 rounded-xl px-4 py-8 transition-colors sm:grid-cols-[90px_1fr_1.3fr_auto] sm:items-center"
            >
              <span className="font-mono text-sm text-[#F4F9FF]/60 transition group-hover:text-[#F4F9FF]">{item.n}</span>
              <h3 className="text-2xl font-semibold tracking-tight transition duration-300 group-hover:translate-x-1 sm:text-3xl">{item.title}</h3>
              <p className="max-w-md text-sm leading-7 text-[#021024]/55">{item.desc}</p>
              <p className="text-4xl font-black tracking-tight text-[#F4F9FF] drop-shadow-[0_2px_12px_rgba(2,16,36,.25)] sm:text-5xl">
                <Counter to={item.value} suffix={item.suffix} />
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
