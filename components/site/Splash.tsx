"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const LETTERS = "Enamel".split("");

/** Premium opening animation. Shows once per browser session. */
export function Splash({ tagline }: { tagline: string }) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("enamel-splash")) return;
    setShow(true);
    sessionStorage.setItem("enamel-splash", "1");
    const t = setTimeout(() => setShow(false), reduce ? 400 : 2600);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] grid place-items-center bg-brand-gradient"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 overflow-hidden">
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  className="font-display text-6xl font-semibold text-white sm:text-8xl"
                  initial={reduce ? false : { y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 + i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
            <motion.p
              className="mt-4 text-sm uppercase tracking-[0.4em] text-white/80"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {tagline}
            </motion.p>
            <motion.div
              className="mx-auto mt-8 h-px w-40 origin-left bg-white/50"
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 1.2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
