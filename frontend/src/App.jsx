import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import { HeroUIProvider } from "@heroui/react";

export default function App() {
  return (
    <BrowserRouter>
      <HeroUIProvider>
        <AppRoutes />
        <Toaster />
      </HeroUIProvider>
    </BrowserRouter>
  );
}
