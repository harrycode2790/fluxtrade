/** @format */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Headphones,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import walletIcon from "../assets/images/favicon/wallet-filled-money-tool.png";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

/**
 * NavbarAlt — modern theme-aware navbar (no mobile hamburger)
 */
export default function NavbarAlt() {
  // State for profile dropdown
  const [profileOpen, setProfileOpen] = useState(false);
  // State for search overlay (xs screens)
  const [searchOpen, setSearchOpen] = useState(false);
  // Ref for profile dropdown to detect outside clicks
  const profileRef = useRef(null);

  const { signOut, authUser } = useAuthStore();

  // Effect: close profile/search on outside click or ESC key
  useEffect(() => {
    function onDoc(e) {
      // Close profile if click is outside profile dropdown
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    }
    function onKey(e) {
      // Close profile/search on Escape key
      if (e.key === "Escape") {
        setProfileOpen(false);
        setSearchOpen(false);
      }
    }
    document.addEventListener("pointerdown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <>
      {/* Navbar header */}
      <header
        className="
          fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 md:px-8
          backdrop-blur-md bg-white/40 dark:bg-(--color-primary)/85 shadow-sm
        "
        role="banner"
      >
        {/* LEFT: Brand logo and name */}
        <div className="flex items-center gap-3">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-10 h-10 rounded-xl grid place-items-center bg-secondary shadow-md text-black font-bold"
            aria-hidden
          >
            TW
          </motion.div>
          {/* Brand text (hidden on xs) */}
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-semibold text-secondary">
              Trade W
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Exchange dashboard
            </span>
          </div>
        </div>

        {/* CENTER: Search bar (full on md+, icon on xs) */}
        <div className="flex-1 flex justify-center px-4">
          <div className="w-full max-w-xl">
            {/* Search bar for sm+ screens */}
            <div className="hidden xs:flex sm:flex md:flex lg:flex">
              <div
                className="
                  hidden sm:flex items-center gap-3 px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-800
                  bg-lightbg dark:bg-primary
                "
                role="search"
                aria-label="Search markets"
              >
                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <input
                  type="search"
                  placeholder="Search markets, pairs or tickers..."
                  className="w-full bg-transparent outline-none text-sm text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>

              {/* XS-only: search icon that opens a tiny overlay input */}
              <button
                onClick={() => setSearchOpen(true)}
                className="sm:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition"
                aria-label="Open search"
              >
                <Search className="w-5 h-5 text-icon" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: actions */}
        <div className="flex items-center gap-3">
          {/* Compact wallet on md+ */}
          <motion.div
            whileHover={{ y: -2 }}
            className="hidden md:flex items-center gap-3 px-3 py-2 rounded-lg bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-800 shadow-sm"
            aria-hidden
          >
            <img src={walletIcon} alt="wallet" className="w-5 h-5" />
            <div className="text-sm">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Balance
              </div>
              <div className="font-medium text-[14px]">{`$${Number(authUser?.balance?.$numberDecimal).toFixed(2)}`} </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-icon" />
            </button>
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold rounded-full bg-secondary text-black">
              3
            </span>
          </div>

          {/* Support (hidden on smallest screens to keep layout tidy) */}
          <Link to={"/livechat"}>
            <button
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition"
              aria-label="Support"
            >
              <Headphones className="w-4 h-4 text-icon" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Support
              </span>
            </button>
          </Link>

          {/* Theme toggle (always visible) */}
          <ThemeToggle />

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((s) => !s)}
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 grid place-items-center text-black dark:text-white font-medium">
                {authUser?.firstName?.charAt(0).toUpperCase() || "U"}
              </div>
              <ChevronDown className="w-4 h-4 text-icon" />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  className="absolute right-0 mt-2 w-44 rounded-xl bg-white dark:bg-primary shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden"
                >
                  <Link
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-black/20"
                    to="/account"
                    role="menuitem"
                  >
                    <User className="w-4 h-4 inline-block mr-2" /> Account
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-black/20"
                    role="menuitem"
                    onClick={signOut}
                  >
                    <LogOut className="w-4 h-4 inline-block mr-2" /> Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* SMALL SEARCH OVERLAY (for xs devices) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-start pt-16 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md mx-auto"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-primary">
                <Search className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <input
                  className="w-full bg-transparent outline-none text-black dark:text-white"
                  placeholder="Search markets..."
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="px-2 text-sm text-gray-500"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
