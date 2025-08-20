import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.warn('Unhandled promise rejection:', event.reason);
  // Prevent the error from appearing in browser console as uncaught
  event.preventDefault();
});

createRoot(document.getElementById("root")!).render(<App />);
