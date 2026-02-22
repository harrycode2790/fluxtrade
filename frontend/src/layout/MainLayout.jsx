import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import BottomNavbar from "../components/BottomNavbar";

export default function MainLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans">

      <Navbar />

      <main className="grow pb-12">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      <BottomNavbar />
    </div>
  );
}
