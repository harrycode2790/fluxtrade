import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function UserCard({ user }) {
  const navigate = useNavigate();
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/admin/users/${user._id}`)}
      className="
        cursor-pointer
        bg-white dark:bg-gray-800
        border border-slate-200/50 dark:border-white/10
        rounded-2xl
        p-5
        flex flex-col justify-between
        shadow-sm hover:shadow-md
        transition
      "
    >
      {/* Top: Avatar + Name */}
      <div className="flex items-center gap-4 mb-4">
        {/* Avatar */}
        <div
          className="
            w-12 h-12 rounded-full
            bg-linear-to-br from-primary to-secondary
            flex items-center justify-center
            text-white font-semibold text-lg
          "
        >
          {initials}
        </div>

        {/* User Info */}
        <div className="flex flex-col">
          <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {user.country}
          </p>
        </div>
      </div>

      {/* Bottom: Email */}
      <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
        {user.email}
      </p>
    </motion.div>
  );
}
