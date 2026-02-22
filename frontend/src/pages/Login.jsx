/** @format */

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { Link, } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

// If you use Next.js and want to use next/image or next/link replace the
// <img> and <a> tags accordingly.

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function validate() {
    if (!email.includes("@")) return "Please enter a valid email.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  }

  const { login, isLoggingIn } = useAuthStore();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const validationErr = validate();
    if (validationErr) return setError(validationErr);

    try {
      await login({ email, password });
      // No navigate() needed — your routes redirect automatically
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-lightbg dark:bg-gray-900 transition-colors duration-300">
      {/* Background layers */}
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
        className="relative z-10 w-full max-w-4xl mx-4 md:mx-8 rounded-3xl shadow-2xl overflow-hidden bg-white dark:bg-primary"
      >
        <div className="md:flex">
          {/* Left visual panel */}
          <div className="md:flex md:w-1/2 items-center justify-center p-10 bg-linear-to-tr from-slate-50 to-white dark:from-primary dark:to-tertiary">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6 px-6"
            >
              <h2 className="text-3xl font-extrabold text-primary dark:text-white">
                Welcome back
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                Sign in to continue to your dashboard. We keep your data safe
                and provide neat tools to manage your workflow.
              </p>

              <div className=" items-center gap-3 mt-4 hidden md:block">
                <div className="h-12 w-12 rounded-xl bg-white/60 dark:bg-white/5 grid place-items-center shadow-sm">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 3v6l4-4"
                      stroke="#10B981"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="8"
                      stroke="#10B981"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="  text-xs text-gray-500 dark:text-gray-300">
                    Quick tips
                  </p>
                  <p className="  text-sm font-medium text-primary dark:text-white">
                    Use your work email to get best experience
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right form panel */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-primary dark:text-white">
                    Sign in
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nice to see you again — please enter your details.
                  </p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.07 }}
                  className="sm:flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 dark:bg-black/20"
                >
                  <span className="text-xs text-gray-500 dark:text-gray-300">
                    <ThemeToggle />
                  </span>
                </motion.div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
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

                {/* Password */}
                <motion.label
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="block relative"
                >
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Password
                  </span>

                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="mt-2 w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary bg-white dark:bg-transparent text-primary dark:text-white pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-11 text-gray-500 dark:text-gray-300"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </motion.label>

                {/* Remember / Forgot */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded text-green-500 focus:ring-green-400"
                    />
                    <span>Remember me</span>
                  </label>

                  <Link to={"/forget-password"} className="hover:underline">
                    Forgot password?
                  </Link>
                </div>

                {/* Error */}
                {error && <p className="text-xs text-red-500">{error}</p>}

                {/* Submit */}
                <motion.button
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-secondary text-black font-semibold shadow-md hover:brightness-95 disabled:opacity-60"
                  disabled={isLoggingIn}
                >
                  <motion.span
                    initial={{ x: -6, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 }}
                  >
                    {isLoggingIn ? "Signing in..." : "Sign in"}
                  </motion.span>

                </motion.button>

                {/* Register CTA */}
                <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                  Don't have an account yet?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-primary dark:text-white underline"
                  >
                    Register
                  </Link>
                </p>
              </form>

              {/* Tiny footer */}
              <div className="mt-6 text-xs text-gray-500 text-center">
                By continuing you agree to our{" "}
                <a href="#" className="underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="underline">
                  Privacy
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
