import { Variants } from 'framer-motion';

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom?: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: custom ? custom * 0.1 : 0,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: (custom?: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay: custom ? custom * 0.1 : 0,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};
