import { Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import HomeEN from "./HomeEN";
import HomeIT from "./HomeIT";

export default function App() {
  return (
    <>
      <SpeedInsights />
      <Analytics />

      <Routes>
        <Route path="/" element={<HomeEN />} />
        <Route path="/it" element={<HomeIT />} />
      </Routes>
    </>
  );
}