import { useEffect, useState } from "react";
import sunIcon from "../assets/images/favicon/sun.png";
import moonIcon from "../assets/images/favicon/moon.png";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  // Load theme from localStorage or default to dark
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div className="flex space-x-4 items-center">
      <button onClick={toggleTheme}>
        <img
          src={theme === "dark" ? sunIcon : moonIcon}
          alt="Theme Toggle"
          className="w-6 h-6"
        />
      </button>
    </div>
  );
}
