import { motion } from 'framer-motion';
import SingleFeatureInDemoFlow from './SingleFeatureInDemoFlow';
import { FeatureSelectionDTOType } from '@meaku/core/types/agent';

const featureVariants = {
  hidden: (index: number) => ({
    x: 100 - index * 60,
    opacity: 0,
  }),
  visible: (index: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
      duration: 6,
      delay: index * 1.5,
    },
  }),
};

type IProps = {
  selectedFeatures: FeatureSelectionDTOType[];
};

const AnimatedSelectedFeaturesList = ({ selectedFeatures }: IProps) => {
  if (!selectedFeatures.length) return;

  return (
    <motion.div
      className="flex w-[80%] flex-wrap items-center justify-center gap-6"
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {selectedFeatures.map((item: FeatureSelectionDTOType, index: number) => (
        <motion.div
          key={item.id}
          variants={featureVariants}
          custom={index} // Pass index for dynamic animation
        >
          <SingleFeatureInDemoFlow key={item.id} featureName={item.name} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AnimatedSelectedFeaturesList;
