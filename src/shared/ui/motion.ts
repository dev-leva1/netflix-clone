import type { Transition, Variants } from 'framer-motion'

const defaultEase: Transition['ease'] = 'easeOut'

export const createPageVariants = (reduced: boolean): Variants => {
  const transition: Transition = reduced
    ? { duration: 0.2 }
    : { duration: 0.6, staggerChildren: 0.2 }
  return {
    initial: { opacity: 0, y: reduced ? 0 : 20 },
    animate: { opacity: 1, y: 0, transition },
  }
}

export const createHeroVariants = (reduced: boolean): Variants => {
  const transition: Transition = reduced
    ? { duration: 0.2 }
    : { duration: 0.8, ease: defaultEase }
  return {
    initial: { opacity: 0, scale: reduced ? 1 : 0.9 },
    animate: { opacity: 1, scale: 1, transition },
  }
}

export const createSectionVariants = (reduced: boolean): Variants => {
  const transition: Transition = reduced
    ? { duration: 0.2 }
    : { duration: 0.6, ease: defaultEase }
  return {
    initial: { opacity: 0, y: reduced ? 0 : 30 },
    animate: { opacity: 1, y: 0, transition },
  }
}

export const createGridVariants = (reduced: boolean): Variants => {
  const transition: Transition = reduced
    ? { duration: 0.2 }
    : { staggerChildren: 0.1, delayChildren: 0.1 }
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition },
  }
}

export const createCardVariants = (reduced: boolean): Variants => {
  const hoverTransition: Transition = { type: 'spring', stiffness: 300, damping: 20 }
  return {
    initial: { scale: 1, y: 0 },
    hover: reduced ? { scale: 1 } : { scale: 1.05, y: -8, transition: hoverTransition },
    tap: { scale: reduced ? 1 : 0.95 },
  }
}

export const createAppearCardVariants = (reduced: boolean): Variants => {
  const transition: Transition = reduced
    ? { duration: 0.2 }
    : { type: 'spring', stiffness: 300, damping: 24 }
  return {
    hidden: { opacity: 0, y: reduced ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition },
  }
}

export const createOverlayVariants = (): Variants => ({
  initial: { opacity: 0 },
  hover: { opacity: 1 },
})

export const skeletonVariants: Variants = {
  loading: {
    backgroundPosition: '200% 0',
    transition: { duration: 1.5, ease: 'linear', repeat: Infinity } as Transition,
  },
}


