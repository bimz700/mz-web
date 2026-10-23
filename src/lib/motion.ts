/**
 * Central motion system. Durations and easing are consistent across the app.
 * transform/opacity only — no layout-affecting animation properties.
 */

export const EASE = [0.22, 1, 0.36, 1] as const
export const DUR = { fast: 0.25, base: 0.45, slow: 0.7 } as const

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay?: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE, delay: typeof delay === 'number' ? delay : 0 },
  }),
}

export const motionStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: DUR.base, ease: EASE } },
}

export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: DUR.fast, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
}
