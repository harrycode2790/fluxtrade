import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function AccountSecurityModal({ onClose }) {
  const { authUser } = useAuthStore();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [setPinOpen, setSetPinOpen] = useState(false);

  // If sub-modals are open, render them
  if (changePasswordOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setChangePasswordOpen(false)}
        />

        {/* Modal */}
        <div
          className="
            relative flex flex-col bg-gray-200 dark:bg-gray-900
            text-black dark:text-white w-full h-full
            md:w-[80%] md:h-[80%] md:max-w-md md:max-h-[85vh]
            md:rounded-2xl md:shadow-xl md:p-6
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-lightbg dark:bg-primary md:bg-transparent md:dark:bg-transparent p-4 md:p-0 border-b md:border-0 border-gray-300 dark:border-gray-700">
            <button onClick={() => setChangePasswordOpen(false)}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-lg md:text-xl font-semibold">
              Change Password
            </h2>
            <div className="w-6" />
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 pt-6 space-y-6">
            <input
              type="password"
              placeholder="Old password"
              className="w-full dark:bg-primary bg-lightbg placeholder-gray-400 px-4 py-4 focus:outline-none rounded-lg"
            />
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full dark:bg-primary bg-lightbg placeholder-gray-400 px-4 py-4 focus:outline-none rounded-lg"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full dark:bg-primary bg-lightbg placeholder-gray-400 px-4 py-4 focus:outline-none rounded-lg"
            />

            <button className="w-full bg-secondary text-white py-3 rounded-lg font-semibold">
              Confirm
            </button>

            <div className="text-center">
              <button className="text-blue-500 text-md">Forgot Password</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (setPinOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setSetPinOpen(false)}
        />

        {/* Modal */}
        <div
          className="
            relative flex flex-col md:bg-gray-200 md:dark:bg-gray-900 bg-lightbg dark:bg-primary
            text-black dark:text-white w-full h-full
            md:w-[80%] md:h-[80%] md:max-w-md md:max-h-[85vh]
            md:rounded-2xl md:shadow-xl md:p-6
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-lightbg dark:bg-primary md:bg-transparent md:dark:bg-transparent p-4 md:p-0 border-b md:border-0 border-gray-300 dark:border-gray-700">
            <button onClick={() => setSetPinOpen(false)}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-md md:text-lg font-semibold">Passcode</h2>
            <div className="w-6" />
          </div>

          {/* Body */}
          <div className="flex-1 px-6 pt-10 py-12">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">Set security pin</h1>
              <p className="text-gray-400 text-lg mt-1">
                Set a 6 digit passcode
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <input
                type="password"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-1/2 text-center tracking-widest text-2xl rounded-md dark:bg-primary bg-lightbg py-3 focus:outline-none"
                placeholder="••••••"
              />
            </div>

            <div className="flex justify-center">
              <button className="bg-secondary text-white px-10 py-3 rounded-full text-lg w-full max-w-xs opacity-70 hover:opacity-100 transition-opacity duration-300">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: Account Security main modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          relative flex flex-col bg-gray-200 dark:bg-gray-900
          text-black dark:text-white w-full h-full
          md:w-[80%] md:h-[80%] md:max-w-2xl md:max-h-[85vh]
          md:rounded-2xl md:shadow-xl md:p-6
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-lightbg dark:bg-primary md:bg-transparent md:dark:bg-transparent p-4 md:p-0 border-b md:border-0 border-gray-300 dark:border-gray-700 sticky top-0">
          <button onClick={onClose}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg md:text-xl font-semibold">
            Account and Security
          </h2>
          <div className="w-6" />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto divide-y dark:divide-gray-800 divide-gray-400 mt-2 md:mt-4">
          <div className="bg-lightbg dark:bg-primary p-4 flex justify-between items-center">
            <span>Email</span>
            <span className="text-gray-400 text-sm">{authUser?.email || "Not set"}</span>
          </div>

          <div className="bg-lightbg dark:bg-primary p-4 flex justify-between items-center">
            <span>Phone Number</span>
            <span className="text-secondary text-sm">{authUser?.phone || "Not set"}</span>
          </div>

          

          <div
            onClick={() => setChangePasswordOpen(true)}
            className="bg-lightbg dark:bg-primary p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span>Change Password</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div
            onClick={() => setSetPinOpen(true)}
            className="bg-lightbg dark:bg-primary p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span>Set Security Pin</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div className="bg-lightbg dark:bg-primary p-4 flex justify-between items-center">
            <span>Delete Account</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
