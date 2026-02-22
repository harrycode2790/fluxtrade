import { motion } from "framer-motion";



export default function ChartCard({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="
        relative
        flex flex-col
        gap-3
        rounded-2xl
        p-5
        bg-white/80 dark:bg-white/5
        backdrop-blur-md
        border border-black/5 dark:border-white/10
        shadow-sm hover:shadow-md
        transition
      "
    >
      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>

      {/* Content */}
      <div className="flex-1 min-h-50">{children}</div>

      {/* Optional subtle gradient overlay on hover */}
      <div className="
        pointer-events-none
        absolute inset-0
        rounded-2xl
        bg-linear-to-br from-indigo-500/5 to-transparent
        opacity-0
        group-hover:opacity-100
        transition
      " />
    </motion.div>
  );
}
