'use client';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
export default function LoadingScreen({ schoolName='SMK TELEKOMUNIKASI TUNAS HARAPAN' }: { schoolName?: string }) {
  return <motion.div initial={{opacity:1}} animate={{opacity:1}} exit={{opacity:0,y:-40}} transition={{duration:.55}} className="fixed inset-0 z-[100] grid place-items-center bg-[#021024] text-white"><div className="text-center"><motion.div initial={{scale:.7,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:.7}} className="mx-auto grid size-20 place-items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 shadow-[0_0_80px_rgba(34,211,238,.2)]"><Sparkles size={28}/></motion.div><motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.25}} className="mt-6 text-[10px] font-bold tracking-[.35em] text-white/50">{schoolName}</motion.p><div className="mx-auto mt-7 h-px w-36 overflow-hidden bg-white/10"><motion.div initial={{x:'-100%'}} animate={{x:'0%'}} transition={{duration:1.2,ease:'easeInOut'}} className="h-full bg-cyan-300"/></div></div></motion.div>;
}
