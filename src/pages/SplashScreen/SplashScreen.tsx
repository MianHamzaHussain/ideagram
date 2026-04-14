import { motion } from 'framer-motion';
import logo from '@/assets/logo.png';

const SplashScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center bg-splash-bg z-[5000]"
    >
      <motion.img
        src={logo}
        alt="Ideagram Logo"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2
        }}
        className="w-[230px] h-auto object-contain"
      />
    </motion.div>
  );
};

export default SplashScreen;
