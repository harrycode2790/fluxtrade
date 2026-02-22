
import  { useState } from "react";
import { ChevronRight, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import FeedbackModal from "../components/FeedbackModal";
import SettingsModal from "../components/SettingsModal";
import VerificationModal from "../components/VerificationModal";
import BottomNavbar from "../components/BottomNavbar";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import CoinSlider from "../components/CoinSlider";
 // <-- keep CoinSlider separate



// icons/images kept small — swap with your assets as needed
import coupon from "../assets/images/favicon/coupon.png";
import suspect from "../assets/images/favicon/suspect.png";
import levelUp from "../assets/images/favicon/level-up.png";
import referral from "../assets/images/favicon/referral.png";
import flag from "../assets/images/favicon/flag.png";
import fileIcon from "../assets/images/favicon/file.png";
import feedbackIcon from "../assets/images/favicon/feedback.png";
import settingIcon from "../assets/images/favicon/setting.png";
import { useAuthStore } from "../store/useAuthStore";



export default function HomePage() {

  const {authUser} = useAuthStore()
  const [activeModal, setActiveModal] = useState(null);

  const userVerificationStatus = authUser?.verificationStatus ? "verified" : "unverified";
  const [verificationStatus, setVerificationStatus] = useState(userVerificationStatus);
  // "unverified" | "pending" | "verified"

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 160, damping: 20 },
    },
  };
  const float = {
    hover: { y: -6, boxShadow: "0px 10px 30px rgba(0,0,0,0.08)" },
  };

  // verification UI object
  const verificationUI = {
    unverified: {
      note: "Not Verified",
      color: "text-red-500",
      disabled: false,
    },
    pending: {
      note: "Pending",
      color: "text-yellow-500",
      disabled: true,
    },
    verified: {
      note: "Verified",
      color: "text-green-500",
      disabled: true,
    },
  };

  // handle verifcation success

  const handleVerificationSuccess = () => {
    setVerificationStatus("pending"); // update verification status
    setActiveModal(null);
  };

  return (
    <div
      className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 md:flex md:pt-20 pt-11"
    >
      {/* Left sidebar preserved */}
      <Sidebar />

      <main className="flex-1 mx-auto max-w-7xl px-4 md:px-8 py-6">
        {/* top bar */}
        <div className="top-4 z-40">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="backdrop-blur-sm bg-white/60 dark:bg-black/40 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-linear-to-tr from-secondary  flex items-center justify-center text-white text-lg font-bold">
                {authUser.firstName.charAt(0).toUpperCase()} {authUser?.lastName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-lg">{authUser?.firstName} {authUser?.lastName}</div>
                <div className="text-xs text-gray-500 dark:text-gray-300">
                  Referral: <span className="font-medium">13420828</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                aria-label="Give feedback"
                onClick={() => setActiveModal("feedback")}
                className="px-3 py-2 rounded-xl bg-secondary/80   text-black text-sm"
              >
                Feedback
              </button>
              <Link to={"/market"}>
                <button className="px-3 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black text-sm">
                  Market
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* balance + quick actions */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={container}
          className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <motion.div
            variants={fadeUp}
            whileHover={float.hover}
            className="lg:col-span-2 p-6 rounded-2xl bg-linear-to-r dark:from-secondary from-secondary to-secondary dark:to-primary text-gray-700 dark:text-white  shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm opacity-90">Trading Account</div>
                <motion.h2
                  layoutId="balance"
                  className="text-3xl font-extrabold mt-2"
                >
                  {`$${Number(authUser?.balance?.$numberDecimal).toFixed(2)}`} 
                </motion.h2>
                <div className="text-xs opacity-80">≈0.00 NGN</div>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  to="/deposit"
                  className="px-4 py-2 rounded-full bg-white text-black font-medium text-sm"
                >
                  Deposit
                </Link>
                <Link
                  to="/market"
                  className="px-4 py-2 rounded-full bg-white/10  font-medium text-sm"
                >
                  Trade
                </Link>
              </div>
            </div>

            <motion.div className="mt-6 grid grid-cols-3 gap-3 bg-white/10 p-3 rounded-xl">
              <div className="text-center">
                <div className="text-xs opacity-80">Equity</div>
                <div className="font-semibold">$0.00</div>
              </div>
              <div className="text-center">
                <div className="text-xs opacity-80">Free Margin</div>
                <div className="font-semibold">$0.00</div>
              </div>
              <div className="text-center">
                <div className="text-xs opacity-80">Leverage</div>
                <div className="font-semibold">1:100</div>
              </div>
            </motion.div>
          </motion.div>

          {/* small card */}
          <motion.div
            variants={fadeUp}
            whileHover={float.hover}
            className="p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  Member since
                </div>
                <div className="text-md text-gray-500 dark:text-gray-300">
                  {new Date(authUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div></div>
              <div className="text-sm text-secondary font-medium">Premium</div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 md:gap-4">
              <button className="py-2 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm">
                Transactions
              </button>
              <button className="py-2 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm">
                Account
              </button>
              <button className="py-2 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm hidden md:block">
                Account
              </button>
              <button className="py-2 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm hidden md:block">
                Account
              </button>
            </div>
          </motion.div>
        </motion.section>

        {/* === CoinSlider moved HERE (under account card) === */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="mt-6"
        >
          <CoinSlider />
        </motion.div>

        {/* actions grid */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={container}
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[
            {
              img: coupon,
              title: "Coupon",
              note: "1 Coupon",
              color: "text-gray-500",
            },

            {
              img: suspect,
              title: "Identity Verification",
              note: verificationUI[verificationStatus].note,
              color: verificationUI[verificationStatus].color,
              onClick: () =>
                verificationStatus === "unverified" && setActiveModal("verify"),
              disabled: verificationUI[verificationStatus].disabled, // disable button
            },

            {
              img: levelUp,
              title: "My Level",
              note: "Lv. 1",
              color: "text-gray-500",
            },
            {
              img: referral,
              title: "Referral Bonus",
              note: "Invite friends",
              color: "text-gray-500",
            },
            {
              img: flag,
              title: "Rewards Hub",
              note: "Redeem",
              color: "text-gray-500",
            },
            {
              img: fileIcon,
              title: "MT4/MT5 Trading",
              note: "Connect",
              color: "text-gray-500",
            },
          ].map((it, idx) => (
            <motion.button
              key={idx}
              variants={fadeUp}
              whileHover={!it.disabled ? { scale: 1.02 } : {}}
              onClick={!it.disabled ? it.onClick : undefined}
              disabled={it.disabled}
              className={`
                flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm text-left
                ${
                  it.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
              `}
            >
              <img src={it.img} alt={it.title} className="w-8 h-8" />
              <div className="flex-1">
                <div className="font-medium">{it.title}</div>
                <div className={`text-xs ${it.color}`}>{it.note}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </motion.button>
          ))}

          {/* feedback + settings */}
          <motion.div
            variants={fadeUp}
            className="col-span-1 sm:col-span-2 lg:col-span-1"
          >
            <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm space-y-3">
              <button
                onClick={() => setActiveModal("feedback")}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <div className="flex items-center gap-3">
                  <img src={feedbackIcon} alt="feedback" className="w-6 h-6" />
                  <div>
                    <div className="font-medium">Feedback</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Help us improve
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => setActiveModal("settings")}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <div className="flex items-center gap-3">
                  <img src={settingIcon} alt="setting" className="w-6 h-6" />
                  <div>
                    <div className="font-medium">Settings</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Privacy & preferences
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-red-500">Logout</div>
                  <LogOut className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            </div>
          </motion.div>
        </motion.section>

        {/* Modals */}
        <AnimatePresence>
          {activeModal === "feedback" && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FeedbackModal onClose={() => setActiveModal(null)} />
            </motion.div>
          )}

          {activeModal === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SettingsModal onClose={() => setActiveModal(null)} />
            </motion.div>
          )}

          {activeModal === "verify" && (
            <motion.div
              key="verify"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <VerificationModal
                onClose={() => setActiveModal(null)}
                onSuccess={handleVerificationSuccess}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <BottomNavbar />
      </main>
    </div>
  );
}
