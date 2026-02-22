import { useState } from "react";
import { motion } from "framer-motion";
import UserCard from "./UserCard";
import { ChevronRight, Search } from "lucide-react";
import { useAdminUserStore } from "../store/useAdminUserStore";
import { useEffect } from "react";

// Filter options
const verificationOptions = ["All", "Verified", "Unverified"];
const statusOptions = ["All", "basic", "Pro"];
const countryOptions = [
  "All",
  "Nigeria",
  "United States",
  "Pakistan",
  "Spain",
  "Canada",
  "Germany",
];

export default function UserManagementPage() {
  const { users, fetchUsers } = useAdminUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filtered users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVerification =
      verificationFilter === "All" ||
      (verificationFilter === "Verified" && user?.verificationStatus) ||
      (verificationFilter === "Unverified" && !user?.verificationStatus);

    const matchesStatus =
      statusFilter === "All" ||
      statusFilter.toLowerCase() === user?.accountStatus.toLowerCase();

    const matchesCountry =
      countryFilter === "All" || user?.country === countryFilter;

    return (
      matchesSearch && matchesVerification && matchesStatus && matchesCountry
    );
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-6 p-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {/* ───────── Page Header ───────── */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
          User Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          List of all registered users with filters and search
        </p>
      </motion.div>

      {/* ───────── Search + Filters ───────── */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
      >
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-full
              py-2.5 pl-10 pr-4
              rounded-xl
              border border-slate-300 dark:border-gray-600
              bg-white dark:bg-gray-800
              text-sm text-slate-900 dark:text-slate-100
              placeholder-slate-400 dark:placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-secondary
              transition
            "
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-400" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-secondary transition"
          >
            {verificationOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-secondary transition"
          >
            {statusOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-secondary transition"
          >
            {countryOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* ───────── Users Grid ───────── */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <motion.div
              key={user._id}
              variants={fadeInUp}
              whileInView="visible"
              initial="hidden"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
            >
              <UserCard user={user} />
            </motion.div>
          ))
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 col-span-full">
            No users found.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
