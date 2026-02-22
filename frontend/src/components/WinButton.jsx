"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import trophyImage from "../assets/images/trophy.jpg";

export default function WinButton({
  amount = "NGN 1,960.00",
  source = "Sport",
  ticket = "472930",
  image,
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const trophySrc = image || trophyImage;

  // Prevent body scroll while modal open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Portal content
  const Modal = (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-start md:items-center justify-center px-3"
          aria-hidden={false}
        >
          {/* Backdrop (click to close) */}
          <motion.div
            className="absolute inset-0 bg-black/60 md:bg-black/50 md:backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onPointerDown={(e) => {
              // close only if clicking backdrop
              if (e.target === e.currentTarget) setOpen(false);
            }}
          />

          {/* Panel: full-screen on mobile, centered card on md+ */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="winTitle"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className={
              // mobile: full screen (h-screen, w-full), md+: auto height, constrained width & rounded
              "relative w-full h-screen sm:h-auto sm:max-w-lg sm:rounded-2xl bg-gradient-to-br from-primary to-primary text-white shadow-2xl overflow-auto sm:overflow-hidden"
            }
            style={{ maxHeight: "95vh" }}
          >
            {/* Close button */}
            <div className="flex justify-end p-3 sm:p-4">
              <button
                onClick={() => setOpen(false)}
                aria-label="Close winnings"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/6 hover:bg-white/10 focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center text-center px-6 pt-2 pb-8 sm:pt-6 sm:pb-8">
              <h2 id="winTitle" className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                YOU WON
              </h2>

              <p className="mt-2 text-2xl sm:text-3xl font-bold">{amount}</p>

              {/* Trophy image */}
              <div className="md:mt-6 mt-20  w-full flex justify-center">
                <img
                  src={trophySrc}
                  alt="Trophy"
                  className="w-44 h-44 object-contain rounded-xl drop-shadow-[0_18px_40px_rgba(245,158,11,0.18)]"
                  loading="lazy"
                />
              </div>

              <p className="mt-6 text-sm text-white/80">
                From {source} / Ticket ID {ticket}
              </p>

              {/* Actions */}
              <div className="md:mt-6 mt-40  w-full sm:w-auto grid grid-cols-2 gap-3 px-2 sm:px-6">
                <button
                  onClick={() => {
                    // replace with real handler
                    window.alert("Show details — replace with your handler");
                  }}
                  className="rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/5 transition"
                >
                  Details
                </button>

                <button
                  onClick={() => {
                    // replace with real handler
                    window.alert("Share/Show off — replace with your handler");
                  }}
                  className="rounded-lg bg-amber-400 px-4 py-3 text-sm font-semibold text-black shadow hover:brightness-95 transition"
                >
                  Show Off
                </button>
              </div>

              <p className="mt-5 text-xs italic text-white/70">All Win Na Win 📍</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-tr from-yellow-400 to-amber-500 px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm font-semibold text-black shadow-lg hover:brightness-95 active:scale-95 transition transform max-w-[160px]"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="truncate">Show winnings</span>
      </button>

      {/* Portal render */}
      {typeof document !== "undefined" ? createPortal(Modal, document.body) : null}
    </>
  );
}
