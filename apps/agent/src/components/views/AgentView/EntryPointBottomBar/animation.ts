const floatingAnimation = {
  initial: {
    y: 0,
    opacity: 0,
  },
  animate: {
    y: [-4, 0, -4],
    opacity: 1,
    transition: {
      y: {
        repeat: Infinity,
        duration: 2,
        ease: [0.4, 0, 0.6, 1],
        times: [0, 0.5, 1],
      },
      opacity: {
        duration: 0.8,
      },
    },
  },
};

const suggestionContainerAnimation = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const suggestionItemAnimation = {
  initial: { x: -20, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

export { floatingAnimation, suggestionContainerAnimation, suggestionItemAnimation };
