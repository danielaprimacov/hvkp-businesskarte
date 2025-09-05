import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

import { AuthProvider } from "./content/auth";
import { ContentProvider } from "./content/content";

createRoot(document.getElementById("root")).render(
  <Router>
    <AuthProvider>
      <ContentProvider>
        <App />
      </ContentProvider>
    </AuthProvider>
  </Router>
);
