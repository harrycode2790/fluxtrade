// tailwind.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  content:[
     // 👇 ADD THIS
    "./node_modules/@heroui/react/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [tailwindcss()],
  css: {
    darkMode: 'class', // This makes your .dark toggle work
  }
})
