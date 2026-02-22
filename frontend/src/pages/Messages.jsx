"use client";

import React, { useState } from "react";
import { Mail, MailCheck, MessageCircle, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import BottomNavbar from "../components/BottomNavbar";

const sampleConversations = [
  {
    id: "c1",
    name: "System",
    avatar: "S",
    preview: "You have received a special coupon",
    time: "Jul 22",
    unread: 1,
    messages: [
      { id: 1, from: "them", text: "Congrats — here's a coupon for you!", time: "12:04" },
    ],
  },
  {
    id: "c2",
    name: "Support",
    avatar: "SP",
    preview: "Your ticket was updated",
    time: "Jul 15",
    unread: 0,
    messages: [
      { id: 1, from: "them", text: "We received your request.", time: "08:11" },
    ],
  },
];

export default function MessagesModern() {
  const [activeTab, setActiveTab] = useState("messages"); // messages | inbox
  const [conversations] = useState(sampleConversations);
  const [selected, setSelected] = useState(sampleConversations[0]);
  const [query, setQuery] = useState("");

  const filtered = conversations.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.preview.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen md:flex bg-lightbg dark:bg-primary">
      <Sidebar />

      <main className="flex-1 flex flex-col md:flex-row mx-auto max-w-6xl w-full md:pt-30 pt-14">
        {/* Left Panel */}
        <aside className="w-full md:w-80 border-r border-gray-200 dark:border-tertiary bg-white dark:bg-primary">
          <div className="p-4 sticky top-0 bg-white dark:bg-primary z-20">
            {/* Tabs */}
            <div className="flex items-center space-x-6 mb-4">
              <button
                onClick={() => setActiveTab("messages")}
                className={`font-semibold transition-all pb-1 ${
                  activeTab === "messages"
                    ? "text-secondary border-b-2 border-secondary"
                    : "text-gray-500 hover:text-secondary"
                }`}
              >
                Messages
              </button>
              <button
                onClick={() => setActiveTab("inbox")}
                className={`font-semibold transition-all pb-1 ${
                  activeTab === "inbox"
                    ? "text-secondary border-b-2 border-secondary"
                    : "text-gray-500 hover:text-secondary"
                }`}
              >
                Inbox
              </button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-tertiary rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="bg-transparent outline-none text-sm w-full text-gray-700 dark:text-gray-200"
              />
            </div>
          </div>

          {/* Conversations */}
          {activeTab === "messages" && (
            <div className="p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
              <AnimatePresence>
                {filtered.map((c) => (
                  <motion.button
                    key={c.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    onClick={() => setSelected(c)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition ${
                      selected.id === c.id
                        ? "bg-secondary/10 text-secondary"
                        : "hover:bg-gray-100 dark:hover:bg-tertiary"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary text-black flex items-center justify-center font-semibold text-sm">
                      {c.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-gray-400">{c.time}</div>
                      </div>
                      <div className="text-xs text-gray-500 truncate">{c.preview}</div>
                    </div>
                  </motion.button>
                ))}
                {filtered.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 text-sm text-gray-500">
                    No conversations
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {activeTab === "inbox" && (
            <div className="p-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-secondary" />
                <span>System: You have received a special coupon</span>
              </div>
            </div>
          )}
        </aside>

        {/* Thread */}
        <section className="flex-1 flex flex-col bg-white dark:bg-primary">
          <div className="p-4 border-b border-gray-100 dark:border-tertiary flex items-center justify-between sticky top-0 bg-white dark:bg-primary z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary text-black flex items-center justify-center font-semibold">
                {selected.avatar}
              </div>
              <div>
                <div className="font-semibold">{selected.name}</div>
                <div className="text-xs text-gray-500">Last message • {selected.time}</div>
              </div>
            </div>
            <MailCheck className="w-5 h-5 text-secondary" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence initial={false}>
              {selected.messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  className={`max-w-[75%] p-3 rounded-xl ${
                    m.from === "you"
                      ? "ml-auto bg-secondary text-black"
                      : "bg-gray-100 dark:bg-tertiary text-gray-800 dark:text-gray-100"
                  }`}
                >
                  <div className="text-sm">{m.text}</div>
                  <div className="text-xs mt-1 text-gray-500">{m.time}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <BottomNavbar />
    </div>
  );
}