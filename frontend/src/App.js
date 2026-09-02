import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import { LangProvider } from "@/i18n";
import Landing from "@/pages/Landing";
import Admin from "@/pages/Admin";

function App() {
  useEffect(() => {
    document.title = "Taberna Ti Maria — Petiscos, Vinhos e Cerveja · Lagos";
    const lenis = new Lenis({ lerp: 0.09 });
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="App">
      <LangProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </BrowserRouter>
      </LangProvider>
    </div>
  );
}

export default App;
