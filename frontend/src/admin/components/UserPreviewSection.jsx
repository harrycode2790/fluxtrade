import { motion } from "framer-motion";
import UserCard from "./UserCard";
import { ChevronRight } from "lucide-react";
import { useAdminUserStore } from "../store/useAdminUserStore";
import { useEffect } from "react";

/**
 * NOTE:
 * - queryString maps directly to backend query params
 * - Example: ?verificationStatus=false
 * - Dummy data is used for now
 */



export default function UserPreviewSection({
  title = "Users",
  limit = 4,
  queryString = "",
  showMorePath = "/admin/users",
}) {

  const{fetchVerificationUsers,pendingVerificationUsers } = useAdminUserStore()
  useEffect(() => {
    fetchVerificationUsers()
  },[fetchVerificationUsers])
 
  const usersToShow = pendingVerificationUsers.slice(0, limit);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        rounded-2xl
        border border-slate-200/60 dark:border-white/10
        px-6 py-5
        shadow-sm
      "
    >
      {/* ───────── Header ───────── */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Recently registered users
          </p>
        </div>

        <a
          href={showMorePath}
          className="
            inline-flex items-center gap-1
            text-sm font-medium
            text-secondary
            hover:underline
          "
        >
          View all
          <ChevronRight size={16} />
        </a>
      </div>

      {/* ───────── Content Grid ───────── */}
      <div
        className="
          grid gap-4
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        {usersToShow.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
    </motion.section>
  );
}
