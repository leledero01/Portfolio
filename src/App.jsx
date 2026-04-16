import { Routes, Route } from "react-router-dom";
import HomeEN from "./HomeEN";
import HomeIT from "./HomeIT";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeEN />} />
      <Route path="/it" element={<HomeIT />} />
    </Routes>
  );
}