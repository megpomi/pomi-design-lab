import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { ShowcaseHeader } from "./components/ShowcaseHeader";
import Landing from "./pages/Landing";
import DirectionPage from "./pages/DirectionPage";
import Compare from "./pages/Compare";

const ScrollTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

function App() {
  return (
    <div className="App min-h-screen">
      <BrowserRouter>
        <ScrollTop />
        <ShowcaseHeader />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/direction/:id" element={<DirectionPage />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-center" />
    </div>
  );
}

export default App;
