import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Guru from "./pages/Guru";
import Dev from "./pages/Dev";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/guru" element={<Guru />} />
      <Route path="/dev" element={<Dev />} />
    </Routes>
  );
}
