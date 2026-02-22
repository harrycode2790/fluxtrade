import { motion } from "framer-motion";
import ThemeToggle from "../../components/ThemeToggle";
import { Bell } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";



export default function DashboardHeader() {
  const {authUser} = useAuthStore()
  // compute greeting based on local time
  const hours = new Date().getHours();
  const greeting =
    hours < 12
      ? "Good morning"
      : hours < 18
      ? "Good afternoon"
      : "Good evening";

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        sticky top-0 z-30
        flex items-center justify-between
        px-6 py-4
        bg-linear-to-b from-slate-50 to-slate-100
        dark:from-[#0f172a] dark:to-[#020617]
        backdrop-blur-md
      "
    >
      {/* ───────── Left: Page Identity + Greeting ───────── */}
      <div className="flex flex-col gap-1">
        <motion.h1
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
        >
          Admin Dashboard
        </motion.h1>

        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-slate-500 dark:text-slate-400 hidden md:block"
        >
          {`${greeting}, ${authUser?.firstName} ${authUser?.lastName}!`} Overview of platform activity.
        </motion.p>
      </div>

      {/* ───────── Right: Controls ───────── */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
            relative h-9 w-9 rounded-lg flex items-center justify-center
            bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10
            transition
          "
        >
          <Bell size={18} className="text-slate-600 dark:text-slate-300" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500" />
        </motion.button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Admin Avatar */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="
            h-9 w-9 rounded-full
            bg-linear-to-br from-indigo-500 to-secondary
            flex items-center justify-center
            text-white text-sm font-medium
            cursor-pointer
          "
        >
          {authUser?.lastName.charAt(0).toUpperCase()}
        </motion.div>
      </div>
    </motion.header>
  );
}
