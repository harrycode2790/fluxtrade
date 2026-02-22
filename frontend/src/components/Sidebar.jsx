/** @format */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BarChart2,
  ArrowDownCircle,
  ArrowUpCircle,
  CreditCard,
  MessageSquare,
  User,
  ChevronDown,
  ChevronRight,
  Activity,
  Settings,
  Zap,
  Users,
  BookOpen,
  Package,
} from "lucide-react";

// SidebarAnimated: modern sidebar with richer motion and the same width/height as your original (w-64, h-screen)
export default function SidebarAnimated() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [openTrade, setOpenTrade] = useState(false);
  const [openTools, setOpenTools] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.06 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 6 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 22 },
    },
    hover: { x: 6 },
  };

  const chevronVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 },
  };

  const navItemClass = (active) =>
    `flex items-center gap-4 px-3 py-2 rounded-lg transition-colors duration-150 ${
      active
        ? "bg-gray-100 dark:bg-black/20 text-secondary"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-black/10"
    }`;

  return (
    <aside className="hidden md:flex flex-col justify-start dark:bg-primary bg-white text-black dark:text-white py-6 px-4 pt-17 w-64 sticky top-5 h-screen overflow-hidden">
      {/* subtle animated decorative blob at the top-right */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.06 }}
        transition={{ duration: 1.2, yoyo: Infinity }}
        className="pointer-events-none absolute right-4 top-6 w-32 h-32 rounded-full bg-linear-to-tr from-secondary to-purple-500 blur-3xl"
      />

      <motion.nav
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-3 mt-6 text-sm font-medium z-10"
      >
        <motion.div variants={item} whileHover="hover">
          <Link to="/" className={navItemClass(currentPath === "/")}>
            <div className="w-8 h-8 grid place-items-center rounded-md bg-white/90 dark:bg-black/20 shadow-sm">
              <Home className="w-4 h-4" />
            </div>
            <span>Home</span>
            <motion.span className="ml-auto text-xs text-gray-400" layout>
              {currentPath === "/" ? "active" : ""}
            </motion.span>
          </Link>
        </motion.div>

        {/* Trade dropdown */}
        <motion.div variants={item} whileHover="hover">
          <div
            className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors ${
              currentPath.startsWith("/trade") || openTrade
                ? "bg-gray-100 dark:bg-black/20 text-secondary"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-black/10"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 grid place-items-center rounded-md bg-white/90 dark:bg-black/20 shadow-sm">
                <CreditCard className="w-4 h-4" />
              </div>
              <span>Trade</span>
            </div>

            <motion.button
              onClick={() => setOpenTrade((s) => !s)}
              aria-expanded={openTrade}
              initial="closed"
              animate={openTrade ? "open" : "closed"}
              variants={chevronVariants}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-black/20"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.button>
          </div>

          <AnimatePresence initial={false}>
            {openTrade && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="mt-2 ml-6 border-l border-gray-100 dark:border-gray-800 pl-3 flex flex-col gap-2"
              >
                <motion.div whileHover={{ x: 6 }}>
                  <Link
                    to="/trade/crypto?pair=BTC%2FUSDT"
                    className={navItemClass(
                      currentPath === "/chart?pair=BTC%2FUSDT"
                    )}
                  >
                    <Activity className="w-4 h-4" />
                    <span className="text-sm">Crypto trading</span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ x: 6 }}>
                  <Link
                    to="/trade/stocks"
                    className={navItemClass(currentPath === "/stock")}
                  >
                    <BarChart2 className="w-4 h-4" />
                    <span className="text-sm">Stocks trading</span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ x: 6 }}>
                  <Link
                    to="/trade/commodities"
                    className={navItemClass(
                      currentPath === "/trade/commodities"
                    )}
                  >
                    <Zap className="w-4 h-4" />
                    <span className="text-sm">Commodity trading</span>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Trading tools dropdown */}
        <motion.div variants={item} whileHover="hover">
          <div
            className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors ${
              openTools
                ? "bg-gray-100 dark:bg-black/20 text-secondary"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-black/10"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 grid place-items-center rounded-md bg-white/90 dark:bg-black/20 shadow-sm">
                <Settings className="w-4 h-4" />
              </div>
              <span>Trading tools</span>
            </div>

            <motion.button
              onClick={() => setOpenTools((s) => !s)}
              aria-expanded={openTools}
              initial="closed"
              animate={openTools ? "open" : "closed"}
              variants={chevronVariants}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-black/20"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.button>
          </div>

          <AnimatePresence initial={false}>
            {openTools && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="mt-2 ml-6 border-l border-gray-100 dark:border-gray-800 pl-3 flex flex-col gap-2"
              >
                <motion.div whileHover={{ x: 6 }}>
                  <Link
                    to="/copy-trading"
                    className={navItemClass(currentPath === "/copy-trading")}
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Copy trading</span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ x: 6 }}>
                  <Link
                    to="/tools/bots"
                    className={navItemClass(currentPath === "/bots")}
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-sm">Trading bots</span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ x: 6 }}>
                  <Link
                    to="/tools/signals"
                    className={navItemClass(currentPath === "/signals")}
                  >
                    <Activity className="w-4 h-4" />
                    <span className="text-sm">Trading signals</span>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={item} whileHover="hover">
          <Link
            to="/market"
            className={navItemClass(currentPath === "/market")}
          >
            <div className="w-8 h-8 grid place-items-center rounded-md bg-white/90 dark:bg-black/20 shadow-sm">
              <BarChart2 className="w-4 h-4" />
            </div>
            <span>Market</span>
          </Link>
        </motion.div>

        <motion.div variants={item} whileHover="hover">
          <Link
            to="/deposit"
            className={navItemClass(currentPath === "/deposit")}
          >
            <div className="w-8 h-8 grid place-items-center rounded-md bg-white/90 dark:bg-black/20 shadow-sm">
              <ArrowDownCircle className="w-4 h-4" />
            </div>
            <span>Deposit</span>
          </Link>
        </motion.div>

        <motion.div variants={item} whileHover="hover">
          <Link
            to="/withdraw"
            className={navItemClass(currentPath === "/withdraw")}
          >
            <div className="w-8 h-8 grid place-items-center rounded-md bg-white/90 dark:bg-black/20 shadow-sm">
              <ArrowUpCircle className="w-4 h-4" />
            </div>
            <span>Withdrawal</span>
          </Link>
        </motion.div>

        <motion.div variants={item} whileHover="hover">
          <Link
            to="/education"
            className={navItemClass(currentPath === "/education")}
          >
            <div className="w-8 h-8 grid place-items-center rounded-md bg-white/90 dark:bg-black/20 shadow-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <span>Education</span>
          </Link>
        </motion.div>

        <motion.div variants={item} whileHover="hover">
          <Link
            to="/trading-package"
            className={navItemClass(currentPath === "/trading-packages")}
          >
            <div className="w-8 h-8 grid place-items-center rounded-md bg-white/90 dark:bg-black/20 shadow-sm">
              <Package className="w-4 h-4" />
            </div>
            <span>Trading Packages</span>
          </Link>
        </motion.div>

        {/* Chat & Account */}
        <motion.div variants={item} whileHover="hover">
          <Link
            to="/message"
            className={navItemClass(currentPath === "/message")}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Message</span>
          </Link>
        </motion.div>
      </motion.nav>

      {/* optional footer */}
      <div className="mt-auto pt-6 z-10">
        <div className="text-xs text-gray-400">Need help?</div>
        <Link to="/livechat" className="text-sm font-medium hover:underline">
          Contact support
        </Link>
      </div>
    </aside>
  );
}
