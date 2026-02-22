import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PersonalInfoModal from "../components/PersonalInfoModal";
import AccountSecurityModal from "../components/AccountSecurityModal";
import { useAuthStore } from "../store/useAuthStore";

export default function SettingsModal({ onClose }) {
  const { authUser } = useAuthStore();
  const [confirmOpen, setConfirmOpen] = useState(true);
  const [vibration, setVibration] = useState(true);
  const userVerificationStatus = authUser?.verificationStatus ? "verified" : "unverified";

  // Sub-modals
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [accountSecurityOpen, setAccountSecurityOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Main Settings Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="
          relative flex flex-col bg-gray-200 dark:bg-gray-900 
          text-black dark:text-white w-full h-full
          md:w-[80%] md:h-[80%] md:max-w-4xl md:max-h-[80vh] 
          md:rounded-2xl md:shadow-xl md:p-6
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between md:dark:bg-gray-900 md:bg-gray-200 bg-lightbg dark:bg-primary p-4 md:p-0 border-b md:border-0 border-gray-300 dark:border-gray-700">
          <button onClick={onClose}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg md:text-xl font-semibold">Settings</h2>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto mt-2 md:mt-4 space-y-2 md:space-y-4">
          {/* Account Section */}
          <div className="bg-lightbg dark:bg-primary md:rounded-lg overflow-hidden divide-y dark:divide-gray-800 divide-gray-300">
            <div
              onClick={() => setPersonalInfoOpen(true)}
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span>Personal Information</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>

            <div className="flex justify-between items-center p-4">
              <span>Verification</span>
              <span className="text-red-500 text-sm">{userVerificationStatus}</span>
            </div>

            <div
              onClick={() => setAccountSecurityOpen(true)}
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span>Account and Security</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Language */}
          <div className="bg-lightbg dark:bg-primary md:rounded-lg p-4 flex justify-between items-center">
            <span>Language</span>
            <span className="text-gray-400">English</span>
          </div>

          {/* Toggles (Mobile only) */}
          <div className="bg-lightbg dark:bg-primary divide-y divide-gray-300 dark:divide-gray-800 md:hidden">
            <div className="flex justify-between items-center p-4">
              <div>
                <div className="font-medium">Confirm Open/Close Position</div>
                <div className="text-sm text-gray-400">
                  User needs to confirm when opening and closing position
                </div>
              </div>
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmOpen}
                  onChange={() => setConfirmOpen(!confirmOpen)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 dark:bg-tertiary rounded-full peer peer-checked:bg-secondary transition-all" />
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5" />
              </label>
            </div>
            <div className="flex justify-between items-center p-4">
              <div>
                <div className="font-medium">Vibration feedback</div>
                <div className="text-sm text-gray-400">
                  Turn on or off vibration
                </div>
              </div>
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={vibration}
                  onChange={() => setVibration(!vibration)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 dark:bg-tertiary rounded-full peer peer-checked:bg-secondary transition-all" />
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5" />
              </label>
            </div>
          </div>

          {/* Legal Section */}
          <div className="bg-lightbg dark:bg-primary md:rounded-lg overflow-hidden divide-y dark:divide-gray-800 divide-gray-300">
            <div className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
              <span>Privacy Agreement</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
              <span>About Us</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
              <span>AML Policy</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-lightbg dark:bg-primary md:rounded-lg p-4 flex justify-between items-center">
            <span>Network Check</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="bg-lightbg dark:bg-primary md:rounded-lg p-4 flex justify-between items-center">
            <span>Version 1.5.9(92)</span>
          </div>

          <button className="md:dark:bg-gray-900 md:bg-gray-200 bg-lightbg dark:bg-primary text-white w-full py-3 rounded-lg mt-4 hover:bg-red-600">
            Logout
          </button>
        </div>
      </motion.div>

      {/* Sub-Modals (Personal Info + Security) */}
      <AnimatePresence>
        {personalInfoOpen && (
          <motion.div
            key="personalInfo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <PersonalInfoModal onClose={() => setPersonalInfoOpen(false)} />
          </motion.div>
        )}

        {accountSecurityOpen && (
          <motion.div
            key="accountSecurity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <AccountSecurityModal
              onClose={() => setAccountSecurityOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
