import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Repeat,
  CreditCard,
  PanelLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Transactions", icon: Wallet, path: "/admin/transactions" },
  { label: "Subscriptions", icon: Repeat, path: "/admin/subscriptions" },
  {
    label: "Payment Methods",
    icon: CreditCard,
    path: "/admin/payment-methods",
  },
];

export default function AdminSidebar() {
  // desktop-only collapse logic (UNCHANGED)
  const [collapsed, setCollapsed] = useState(
    window.innerWidth < 768 ? true : false
  );

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="
    sticky
    top-0
    h-screen
    overflow-y-auto

    bg-linear-to-b
    from-slate-50 to-slate-100
    dark:from-[#0f172a] dark:to-[#020617]

    flex
    flex-col
    px-3
    py-4
    border-r border-white/5
    shadow-xl
  "
    >
      {/* ───────── Header ───────── */}
      <div className="flex items-center justify-between mb-10 px-1">
        <div className="flex items-center gap-3">
          {/* Logo / Dot */}
          <div className="h-9 w-9 rounded-xl bg-indigo-600/20 flex items-center justify-center">
            <span className="text-secondary font-bold">A</span>
          </div>

          {/* Title */}
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-semibold text-lg tracking-wide hidden md:block"
              >
                Admin Panel
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop toggle only */}
        {/* <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <PanelLeft size={18} />
          </motion.div>
        </button> */}
      </div>

      {/* ───────── Navigation ───────── */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link key={item.label} to={item.path} >
            <motion.div
              key={item.label}
              whileHover="hover"
              initial="rest"
              animate="rest"
              variants={{
                rest: { backgroundColor: "rgba(255,255,255,0)" },
                hover: { backgroundColor: "rgba(255,255,255,0.06)" },
              }}
              className="
              group
              relative
              flex
              items-center
              gap-4
              px-3
              py-3
              rounded-xl
              cursor-pointer
              transition-colors
            "
            >
              {/* Active glow (future-ready) */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition bg-indigo-500/5" />

              {/* Icon */}
              <motion.div
                variants={{
                  rest: { x: 0 },
                  hover: { x: 2 },
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className="
                flex
                items-center
                justify-center
                h-10 w-10
                rounded-lg
                bg-white/5
                text-secondary
              "
              >
                <item.icon size={18} />
              </motion.div>

              {/* Label */}
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    className="
                    text-sm
                    font-medium
                    hidden md:inline
                    whitespace-nowrap
                  "
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        ))}
      </nav>

      {/* ───────── Footer spacer (future use) ───────── */}
      <div className="mt-auto pt-6 opacity-50 text-xs text-center hidden md:block">
        {!collapsed && "© Admin System"}
      </div>
    </motion.aside>
  );
}
