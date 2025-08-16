import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import DeMontagePage from "./pages/DeMontagePage";
import HomePage from "./pages/HomePage";
import ReparaturPage from "./pages/ReparaturPage";
import TransportPage from "./pages/TransportPage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/transport" element={<TransportPage />} />
          <Route path="/de-montage" element={<DeMontagePage />} />
          <Route path="/reparatur" element={<ReparaturPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
