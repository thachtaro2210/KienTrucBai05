import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const Skeleton = ({ className, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1,
      }}
      className={cn("bg-slate-200 rounded-xl overflow-hidden", className)}
      {...props}
    />
  );
};

export default Skeleton;
