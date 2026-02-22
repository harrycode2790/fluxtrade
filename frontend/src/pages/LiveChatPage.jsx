
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import BottomNavbar from "../components/BottomNavbar";
import { Send } from "lucide-react";

const SAMPLE_MESSAGES = [
  { id: 1, sender: "support", text: "Hello! How can we assist you today?" },
  { id: 2, sender: "user", text: "I have an issue with my account." },
  { id: 3, sender: "support", text: "Sure! Can you please describe the problem?" },
];

export default function LiveChatPageUI() {
  return (
    <div className="min-h-screen md:flex text-black dark:text-white">
      <Sidebar />

      <main className="flex-1 flex flex-col max-w-3xl mx-auto mt-20 md:mt-30 px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-300 dark:border-gray-700 pb-3">
          <h1 className="text-2xl font-bold">Live Chat</h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">Our support team is online</span>
        </div>

        {/* Chat container */}
        <div className="flex-1 flex flex-col p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-y-auto space-y-3">
          <AnimatePresence initial={false}>
            {SAMPLE_MESSAGES.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`max-w-[70%] px-4 py-2 rounded-2xl wrap-break-word
                  ${
                    msg.sender === "user"
                      ? "self-end bg-secondary text-black"
                      : "self-start bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                  }`}
              >
                {msg.text}
              </motion.div>
            ))}
          </AnimatePresence>
          {/* Bottom spacer for scroll */}
          <div className="h-2" />
        </div>

        {/* Input area */}
        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-full bg-gray-100 dark:bg-gray-700 focus:outline-none text-black dark:text-white placeholder-gray-400"
        
          />
          <button className="p-3 rounded-full bg-secondary text-black ">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </main>

      <BottomNavbar />
    </div>
  );
}
