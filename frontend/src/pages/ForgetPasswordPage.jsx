/** @format */

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const { forgetPassword } = useAuthStore();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const success = await forgetPassword({ email });

    if (success) {
      navigate("/reset-password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-lightbg dark:bg-gray-900 transition-colors duration-300">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.img
          alt="bg"
          className="w-full h-full object-cover opacity-40 dark:opacity-20"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1.08 }}
          transition={{ duration: 12, yoyo: Infinity }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/40 to-white/70 dark:via-black/40 dark:to-black/70 mix-blend-multiply" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-xl mx-4 md:mx-8 rounded-3xl shadow-2xl overflow-hidden bg-white dark:bg-primary p-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:space-x-10">
          <div>
            <h3 className="text-2xl font-bold text-primary dark:text-white">
              Forgot Password
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 max-w-xs hidden md:block">
              Enter your email and we’ll send you a reset code.
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.07 }}
            className="sm:flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 dark:bg-black/20"
          >
            <ThemeToggle />
          </motion.div>
        </div>

        {/* Centered Form Wrapper */}
        <div className="w-full flex justify-center">
          {/* Form */}
          <form className="space-y-6 max-w-sm w-full" onSubmit={handleSubmit}>
            {/* Email */}
            <motion.label
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="block"
            >
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </span>

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                type="email"
                required
                className="mt-2 w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary bg-white dark:bg-transparent text-primary dark:text-white"
              />
            </motion.label>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-secondary text-black font-semibold shadow-md hover:brightness-95 disabled:opacity-60"
            >
              <motion.span
                initial={{ x: -6, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
                Send Reset Code
              </motion.span>
            </motion.button>

            {/* Back to login */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              Remembered your password?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary dark:text-white underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
