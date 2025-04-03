import { EntryPointAlignment, EntryPointAlignmentType } from '../types/entryPoint';

const floatingAnimation = {
  initial: {
    x: 0,
    y: 0,
    opacity: 0,
  },
  animate: {
    y: [-4, 0, -4],
    x: [0, 0, 0],
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

const getSuggestionItemAnimation = (questionAlignment: EntryPointAlignmentType) => {
  const isQuestionAlignmentRight = questionAlignment === EntryPointAlignment.RIGHT;
  const isQuestionAlignmentCenter = questionAlignment === EntryPointAlignment.CENTER;
  const gapDistance = 16;

  return {
    initial: {
      x: isQuestionAlignmentRight ? 40 : 0,
      opacity: 0,
      scale: 0.8,
      transformOrigin: isQuestionAlignmentRight ? '100%' : '0%',
    },
    animate: {
      x: isQuestionAlignmentRight ? -gapDistance + 16 : isQuestionAlignmentCenter ? 0 : gapDistance + 16,
      opacity: 1,
      scale: 1,
      transition: {
        x: {
          type: 'spring',
          stiffness: 40,
          damping: 15,
          duration: 2,
          ease: [0.4, 0, 0.2, 1],
        },
        opacity: {
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
        },
        scale: {
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
        },
      },
    },
    exit: {
      x: isQuestionAlignmentRight ? 40 : -40,
      opacity: 0.6,
      scale: 0.8,
      transition: {
        duration: 1,
        ease: [0.1, 0.4, 0.2, 0.3],
      },
    },
  };
};

export { floatingAnimation, suggestionContainerAnimation, getSuggestionItemAnimation };
