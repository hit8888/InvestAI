import { motion } from 'framer-motion';

const SideBarFooter = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div className="flex flex-1 flex-col items-start gap-4 self-stretch border border-[rgb(var(--primary-foreground)/0.32)] bg-primary/2.5 pb-2">
      <div className="flex flex-1 flex-col items-center justify-end gap-2 self-stretch">{children}</div>
    </motion.div>
  );
};

export default SideBarFooter;
