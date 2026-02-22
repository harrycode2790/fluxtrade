import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="
        group
        relative
        rounded-2xl
        p-5
        bg-white/80 dark:bg-white/5
        backdrop-blur-md
        border border-black/5 dark:border-white/10
        shadow-sm
        hover:shadow-md
        transition
      "
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <h2
            className="
              text-2xl
              font-semibold
              tracking-tight
              text-slate-900 dark:text-slate-100
            "
          >
            {typeof value === "number" ? value.toLocaleString() : value}
          </h2>
        </div>

        {/* Icon */}
        {Icon && (
          <div
            className="
              h-11 w-11
              rounded-xl
              flex items-center justify-center
              bg-secondary/10
              text-secondary
              group-hover:bg-secondary/20
              transition
            "
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div
        className="
          absolute inset-x-0 bottom-0 h-px
          bg-linear-to-r
          from-transparent via-secondary/30 to-transparent
          opacity-0 group-hover:opacity-100
          transition
        "
      />
    </motion.div>
  );
}
