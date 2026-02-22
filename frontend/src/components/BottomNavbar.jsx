
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BarChart2,
  CreditCard,
  MessageSquare,
  Activity,
  Zap,
  Users,
  ChevronRight,
  MoreVertical,
  MoreHorizontal,
  Wallet,
  ArrowUpCircle,
  BookOpen,
  GaugeCircle,
} from "lucide-react";

/**
 * BottomNavbar with TWO drop-ups:
 * - Center FAB (existing trading tools)
 * - Right FAB (profile replacement) -> opens Copy Trading / Trading Signals / Trading Bots
 *
 * Mobile-only (md:hidden)
 */

export default function BottomNavbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  // center panel state (keeps your existing center menu)
  const [centerOpen, setCenterOpen] = useState(false);
  const centerRef = useRef(null);

  // right panel state (new requirement)
  const [rightOpen, setRightOpen] = useState(false);
  const rightRef = useRef(null);

  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const activitiesRef = useRef(null);

  // close when clicking outside either panel
  useEffect(() => {
    function onDoc(e) {
      if (centerRef.current && centerRef.current.contains(e.target)) {
        // clicked inside center panel -> do nothing
      } else {
        // if click is outside center's button/panel, close center
        if (centerOpen && !e.target.closest("#center-fab"))
          setCenterOpen(false);
      }

      if (rightRef.current && rightRef.current.contains(e.target)) {
        // clicked inside right panel -> do nothing
      } else {
        if (rightOpen && !e.target.closest("#right-fab")) setRightOpen(false);
      }

      if (activitiesRef.current && activitiesRef.current.contains(e.target)) {
        // inside activities -> do nothing
      } else {
        if (activitiesOpen && !e.target.closest("#activities-fab")) {
          setActivitiesOpen(false);
        }
      }
    }
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [centerOpen, rightOpen, activitiesOpen]);

  // close panels when route changes
  useEffect(() => {
    setCenterOpen(false);
    setRightOpen(false);
    setActivitiesOpen(false);
  }, [currentPath]);

  const navBtn = (icon, label, active) => (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        active ? "text-secondary" : "text-icon"
      }`}
    >
      {icon}
      <span className="text-(--font-size-nav-size) mt-1">{label}</span>
    </div>
  );

  const itemVariants = {
    hidden: { y: 18, opacity: 0, scale: 0.98 },
    show: (i = 0) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.06,
        type: "spring",
        stiffness: 420,
        damping: 32,
      },
    }),
    exit: { y: 12, opacity: 0, scale: 0.98, transition: { duration: 0.14 } },
  };

  return (
    <nav className="fixed bottom-0 w-full bg-lightbg dark:bg-primary border-t border-[#2C2E33] flex justify-around items-center text-xs py-2 md:hidden z-40">
      {/* Home */}
      <Link
        to="/"
        className="flex flex-col items-center"
        onClick={() => {
          setCenterOpen(false);
          setRightOpen(false);
        }}
      >
        {navBtn(<Home className="w-5 h-5" />, "Home", currentPath === "/")}
      </Link>

      {/* Market */}
      <Link
        to="/market"
        className="flex flex-col items-center"
        onClick={() => {
          setCenterOpen(false);
          setRightOpen(false);
        }}
      >
        {navBtn(
          <BarChart2 className="w-5 h-5" />,
          "Market",
          currentPath === "/market"
        )}
      </Link>

      {/* Center FAB (existing trading tools) */}
      <div className="relative flex items-center justify-center -mt-6">
        <button
          id="center-fab"
          onClick={() => {
            setCenterOpen((s) => !s);
            // close other panel
            setRightOpen(false);
          }}
          aria-expanded={centerOpen}
          aria-controls="center-trade-panel"
          className="group relative z-10 p-3 rounded-full shadow-2xl bg-secondary flex items-center justify-center focus:outline-none"
          title="Trading tools"
        >
          <motion.div whileTap={{ scale: 0.94 }} whileHover={{ rotate: -6 }}>
            <Activity className="w-5 h-5 text-black" />
          </motion.div>

          <motion.span
            aria-hidden
            initial={{ scale: 0.9, opacity: 0.12 }}
            animate={{
              scale: centerOpen ? 1.15 : 0.9,
              opacity: centerOpen ? 0.14 : 0.06,
            }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-full bg-secondary/40 blur-sm"
          />
        </button>

        <AnimatePresence>
          {centerOpen && (
            <motion.div
              id="center-trade-panel"
              ref={centerRef}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 18, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center space-y-3"
              style={{ pointerEvents: centerOpen ? "auto" : "none" }}
            >
              {/* Crypto Trading */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                custom={0}
                className="w-56 max-w-[86vw]"
              >
                <Link
                  to="/trade/crypto?pair=BTC%2FUSDT"
                  onClick={() => setCenterOpen(false)}
                >
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-navbar shadow-lg border border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-lg grid place-items-center bg-secondary">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Crypto trading</div>
                      <div className="text-xs text-gray-400">
                        Spot & limit orders
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              </motion.div>

              {/* Stocks Trading */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                custom={1}
                className="w-56 max-w-[86vw]"
              >
                <Link to="/trade/stocks" onClick={() => setCenterOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-navbar shadow-lg border border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-lg grid place-items-center bg-secondary">
                      <BarChart2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Stocks trading</div>
                      <div className="text-xs text-gray-400">
                        Equities & ETFs
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              </motion.div>

              {/* Commodities */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                custom={2}
                className="w-56 max-w-[86vw]"
              >
                <Link
                  to="/trade/commodities"
                  onClick={() => setCenterOpen(false)}
                >
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-navbar shadow-lg border border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-lg grid place-items-center bg-secondary">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Commodity trading</div>
                      <div className="text-xs text-gray-400">
                        Gold, oil & more
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              </motion.div>

              {/* Trading Signals */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                custom={3}
                className="w-56 max-w-[86vw]"
              >
                <Link
                  to="/trading-signals"
                  onClick={() => setCenterOpen(false)}
                >
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-navbar shadow-lg border border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-lg grid place-items-center bg-secondary">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Trading Signals</div>
                      <div className="text-xs text-gray-400">
                        Buy/sell alerts
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              </motion.div>

              {/* Trading Bots */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                custom={4}
                className="w-56 max-w-[86vw]"
              >
                <Link to="/trading-bots" onClick={() => setCenterOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-navbar shadow-lg border border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-lg grid place-items-center bg-secondary">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Trading Bots</div>
                      <div className="text-xs text-gray-400">
                        Automated strategies
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ACTIVITIES FAB */}
      <div className="relative flex items-center justify-center -mt-3">
        <button
          id="activities-fab"
          onClick={() => {
            setActivitiesOpen((s) => !s);
            // close others
            setCenterOpen(false);
            setRightOpen(false);
          }}
          aria-expanded={activitiesOpen}
          aria-controls="activities-panel"
          className="group relative p-3  flex items-center justify-center focus:outline-none"
          title="Activities"
        >
          <motion.div whileTap={{ scale: 0.94 }} whileHover={{ rotate: -6 }}>
            {navBtn(<GaugeCircle className="w-5 h-5 mt-2" />, "activity", currentPath === '/account-trading' || currentPath === '/withdraw' || currentPath === '/history')}
          </motion.div>
        </button>

        <AnimatePresence>
          {activitiesOpen && (
            <motion.div
              id="activities-panel"
              ref={activitiesRef}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 18, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="absolute bottom-20 right-1/2 translate-x-1/2 z-50 flex flex-col items-center space-y-3"
              style={{ pointerEvents: activitiesOpen ? "auto" : "none" }}
            >
              {/* Account Trading */}
              <motion.div
                variants={itemVariants}
                custom={0}
                initial="hidden"
                animate="show"
                exit="exit"
                className="w-56 max-w-[86vw]"
              >
                <Link
                  to="/account-trading"
                  onClick={() => setActivitiesOpen(false)}
                >
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-navbar shadow-lg border border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-lg grid place-items-center bg-secondary">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Account Trading</div>
                      <div className="text-xs text-gray-400">Manage trades</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              </motion.div>

              {/* Withdraw */}
              <motion.div
                variants={itemVariants}
                custom={1}
                initial="hidden"
                animate="show"
                exit="exit"
                className="w-56 max-w-[86vw]"
              >
                <Link to="/withdraw" onClick={() => setActivitiesOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-navbar shadow-lg border border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-lg grid place-items-center bg-secondary">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Withdraw</div>
                      <div className="text-xs text-gray-400">
                        Funds transfer
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              </motion.div>

              {/* History */}
              <motion.div
                variants={itemVariants}
                custom={2}
                initial="hidden"
                animate="show"
                exit="exit"
                className="w-56 max-w-[86vw]"
              >
                <Link to="/history" onClick={() => setActivitiesOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-navbar shadow-lg border border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-lg grid place-items-center bg-secondary">
                      <BarChart2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">History</div>
                      <div className="text-xs text-gray-400">
                        Past transactions
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT FAB — replaces profile link and opens Copy Trading / Signals / Bots */}
      <div className="relative flex items-center justify-center -mt-3">
        <button
          id="right-fab"
          onClick={() => {
            setRightOpen((s) => !s);
            // ensure center panel closed when opening right panel
            setCenterOpen(false);
          }}
          aria-expanded={rightOpen}
          aria-controls="right-trade-panel"
          className="group relative  p-3 rounded-full flex items-center justify-center focus:outline-none"
          title="More tools"
        >
          <motion.div whileTap={{ scale: 0.94 }} whileHover={{ rotate: 6 }}>
            {/* Three-dot "More" icon instead of User */}
            {navBtn(<MoreHorizontal className="w-5 h-5 mt-2"/>, 'More', currentPath === '/deposit' || currentPath === '/upgrade' || currentPath === '/education')}
          </motion.div>
        </button>

        <AnimatePresence>
          {rightOpen && (
            <motion.div
              id="right-trade-panel"
              ref={rightRef}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 18, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="absolute bottom-20 right-4 z-50 flex flex-col items-end space-y-3"
              style={{ pointerEvents: rightOpen ? "auto" : "none" }}
            >
              {/* Buy Crypto */}
              <motion.div
                variants={itemVariants}
                custom={0}
                initial="hidden"
                animate="show"
                exit="exit"
                className="w-56 max-w-[86vw]"
              >
                <Link to="/deposit" onClick={() => setRightOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-navbar shadow-lg border border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-lg grid place-items-center bg-secondary">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Buy Crypto</div>
                      <div className="text-xs text-gray-400">
                        Purchase instantly
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              </motion.div>

              {/* Upgrade */}
              <motion.div
                variants={itemVariants}
                custom={1}
                initial="hidden"
                animate="show"
                exit="exit"
                className="w-56 max-w-[86vw]"
              >
                <Link to="/upgrade" onClick={() => setRightOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-navbar shadow-lg border border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-lg grid place-items-center bg-secondary">
                      <ArrowUpCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Upgrade</div>
                      <div className="text-xs text-gray-400">
                        Unlock features
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              </motion.div>

              {/* Education */}
              <motion.div
                variants={itemVariants}
                custom={2}
                initial="hidden"
                animate="show"
                exit="exit"
                className="w-56 max-w-[86vw]"
              >
                <Link to="/education" onClick={() => setRightOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-navbar shadow-lg border border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-lg grid place-items-center bg-secondary">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Education</div>
                      <div className="text-xs text-gray-400">
                        Learn & explore
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
