import type { Variants } from 'framer-motion';

export const pageAnim: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.14 } },
};

export const cardAnim: Variants = {
  initial: { opacity: 0, scale: 0.96, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
};

export const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export const xpPopAnim: Variants = {
  initial: { opacity: 0, y: 0, scale: 0.8 },
  animate: { opacity: [1, 1, 0], y: -40, scale: 1.2, transition: { duration: 0.9 } },
};

export const cardSwipeLeft = {
  x: -300,
  opacity: 0,
  rotate: -12,
  transition: { duration: 0.3 },
};

export const cardSwipeRight = {
  x: 300,
  opacity: 0,
  rotate: 12,
  transition: { duration: 0.3 },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
};