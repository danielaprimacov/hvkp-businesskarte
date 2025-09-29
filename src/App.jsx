import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import ContactPage from "./pages/ContactPage";
import DeMontagePage from "./pages/DeMontagePage";
import HomePage from "./pages/HomePage";
import ReparaturPage from "./pages/ReparaturPage";
import TransportPage from "./pages/TransportPage";
import PruefungPage from "./pages/PruefungPage";
import AdminPage from "./pages/AdminPage";
import AdminLogin from "./pages/AdminLogin";
import ImpressumPage from "./pages/ImpressumPage";

import { ProtectedRoute } from "./content/auth";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/transport" element={<TransportPage />} />
        <Route path="/de-montage" element={<DeMontagePage />} />
        <Route path="/reparatur" element={<ReparaturPage />} />
        <Route path="/wiederkehrende-pruefung" element={<PruefungPage />} />
        <Route path="/kontakt" element={<ContactPage />} />
        <Route path="/impressum" element={<ImpressumPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
