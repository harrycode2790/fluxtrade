import { motion } from "framer-motion";

export function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {label}
        </span>

        {value !== "All" && (
          <button
            onClick={() => onChange("All")}
            className="
              text-xs font-medium
              text-slate-500 hover:text-secondary
              transition
            "
          >
            Reset
          </button>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option;

          return (
            <motion.button
              key={option}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onChange(option)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium
                transition-all
                ${
                  active
                    ? "bg-secondary text-black shadow-md"
                    : "bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-700"
                }
              `}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
