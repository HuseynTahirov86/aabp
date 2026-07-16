import { Variants } from 'framer-motion';

export const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (custom?: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: custom ? custom * 0.1 : 0,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};
