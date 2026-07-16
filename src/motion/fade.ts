import { Variants } from 'framer-motion';

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (custom?: number) => ({
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: custom ? custom * 0.1 : 0,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};
