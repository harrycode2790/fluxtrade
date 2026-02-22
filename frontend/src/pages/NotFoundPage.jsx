import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import BottomNavbar from "../components/BottomNavbar";


export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 md:flex md:pt-20 pt-11">

      <main className="flex-1 mx-auto max-w-5xl px-4 md:px-8 py-6 flex flex-col items-center justify-center text-center">
        {/* Floating animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="text-7xl font-extrabold text-gray-300 dark:text-gray-700"
          >
            404
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold mb-2"
        >
          Page not found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-gray-500 dark:text-gray-400 max-w-md mb-6"
        >
          The page you are trying to access does not exist or has been moved.
        </motion.p>

        {/* Go Home */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-xl bg-secondary text-black font-semibold shadow-lg"
        >
          Go Home
        </motion.button>

        <BottomNavbar />
      </main>
    </div>
  );
}
