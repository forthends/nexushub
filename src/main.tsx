import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@/lib/i18n";
import "./index.css";

// Restore saved language preference
const savedLang = localStorage.getItem("toolbox-language");
if (savedLang) {
  import("@/lib/i18n").then((i18n) => {
    i18n.default.changeLanguage(savedLang);
  });
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);