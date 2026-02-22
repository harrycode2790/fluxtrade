import { motion } from "framer-motion";

export default function UserHeader({ user }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        flex flex-col sm:flex-row sm:items-center gap-5
        rounded-2xl
        border border-slate-200/60 dark:border-white/10
        bg-white/70 dark:bg-gray-900/50
        backdrop-blur
        px-6 py-5
      "
    >
      {/* ───────── Avatar ───────── */}
      <div className="relative">
        <div
          className="
            h-16 w-16 rounded-full
            bg-linear-to-br from-secondary to-primary
            text-black
            flex items-center justify-center
            font-semibold text-lg
            ring-2 ring-secondary/30
          "
        >
          {user?.firstName?.[0] || user?.name?.[0]}
          {user?.lastName?.[0]}
        </div>
      </div>

      {/* ───────── User Info ───────── */}
      <div className="flex-1 min-w-0">
        <h2
          className="
            text-lg font-semibold
            text-slate-900 dark:text-slate-100
            truncate
          "
        >
          {user?.firstName || " "} {user?.lastName || " "} {user?.name}
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
          {user?.email} {user?.handle}
        </p>
      </div>

      {/* ───────── Role Badge ───────── */}
      <div className="flex items-center gap-2">
        <span
          className="
            inline-flex items-center
            px-3 py-1 rounded-full
            text-xs font-medium
            bg-secondary/10 text-secondary
            border border-secondary/20
          "
        >
          {user?.role} {user?.type}
        </span>
      </div>
    </motion.div>
  );
}
