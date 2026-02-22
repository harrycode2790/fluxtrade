import { useState } from "react";
import Sidebar from "../components/Sidebar";
import BottomNavbar from "../components/BottomNavbar";
import { motion } from "framer-motion";
import { PlayCircle, Youtube } from "lucide-react";
import { getYouTubeThumbnail } from "../../utils/helpers";

// External YouTube videos
const VIDEO_LIST = [
  {
    id: "v1",
    title: "How to Trade Forex for Beginners",
    url: "https://youtu.be/xHU5MHuUSKI?si=fbgE-gqC4zUVtT6Z",
  },
  {
    id: "v2",
    title: "Crypto Market Basics Explained",
    url: "https://youtu.be/aaMFEk5Zuq4?si=nNt9RJCkQ0s6IsLp",
  },
  {
    id: "v3",
    title: "How Copy Trading Works",
    url: "https://youtu.be/qpBlYAjtGdE?si=RpAK1QqAN6ybKbgh",
  },
  {
    id: "v4",
    title: "Technical Analysis 101",
    url: "https://youtu.be/eynxyoKgpng?si=_IlBA3dchTjgknH-",
  },
  {
    id: "v5",
    title: "Market Psychology & Risk Management",
    url: "https://youtu.be/Be2GCdGSZg0?si=Pge_xyx19k5EhpBP",
  },
];

export default function EducationPage() {
  const [search, setSearch] = useState("");

  const filtered = VIDEO_LIST.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  const gridVariants = { show: { transition: { staggerChildren: 0.08 } } };
  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen md:flex  text-black dark:text-white">
      <Sidebar />

      <main className="flex-1 px-4 md:px-8 py-6 max-w-5xl mx-auto mt-20">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-semibold">Education</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Learn, grow your skills & master the markets
            </p>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search videos..."
            className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-tertiary text-sm outline-none hidden sm:block"
          />
        </div>

        {/* Video Grid */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((v) => (
            <motion.a
              href={v.url}
              key={v.id}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{
                y: -6,
                scale: 1.02,
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
              className="bg-white dark:bg-primary rounded-2xl overflow-hidden shadow-sm cursor-pointer group block"
            >
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={getYouTubeThumbnail(v.url)}
                  className="w-full h-40 object-cover"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <PlayCircle className="w-14 h-14 text-white" />
                </div>
              </div>

              {/* Title */}
              <div className="p-4">
                <h2 className="font-semibold text-base line-clamp-2">
                  {v.title}
                </h2>

                <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                  <Youtube className="w-4 h-4 text-red-500" />
                  Watch on YouTube
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <div className="h-28" />
      </main>

      <BottomNavbar />
    </div>
  );
}
