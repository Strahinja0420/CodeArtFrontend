import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Contrast,
  Volume2,
  Type,
  Vibrate,
  Globe,
  Box,
  Settings,
  ChevronRight,
} from "lucide-react";

const AccessibilitySettings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [highContrast, setHighContrast] = useState(
    () => localStorage.getItem("artnode_highcontrast") === "true",
  );
  const [tts, setTts] = useState(
    () => localStorage.getItem("artnode_tts") === "true",
  );
  const [fontSize, setFontSize] = useState(
    () => Number(localStorage.getItem("artnode_fontsize") || "16"),
  );
  const [haptics, setHaptics] = useState(true);

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    localStorage.setItem("artnode_highcontrast", String(next));
  };

  const toggleTts = () => {
    const next = !tts;
    setTts(next);
    localStorage.setItem("artnode_tts", String(next));
    if (next && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        "Text to speech is now enabled.",
      );
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFontSize = (val: number) => {
    setFontSize(val);
    localStorage.setItem("artnode_fontsize", String(val));
  };

  return (
    <div
      className="min-h-screen text-fg"
      style={{ background: highContrast ? "#000000" : "#0a0f16" }}
    >
      {/* Status bar spacer */}
      <div className="h-12 w-full" />

      {/* Navigation Header */}
      <header
        className="px-6 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md border-b border-fg/5"
        style={{
          background: highContrast
            ? "rgba(0,0,0,0.9)"
            : "rgba(10,15,22,0.85)",
        }}
      >
        <button
          onClick={() => navigate(id ? `/experience/${id}` : -1 as any)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-bold text-lg">Settings & Accessibility</h1>
        <div className="w-10" />
      </header>

      <main className="px-4 py-6 max-w-md mx-auto">
        <div className="space-y-4">
          {/* Language Tile */}
          <Link to={id ? `/welcome/${id}` : "/welcome"}>
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="rounded-xl p-5 flex items-center justify-between"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                  <Globe size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    Change Language
                  </h3>
                  <p className="text-sm text-fg/50">
                    {(() => {
                      const lang = localStorage.getItem("artnode_language");
                      const map: Record<string, string> = {
                        en: "English",
                        sl: "Slovenian",
                        de: "German",
                        it: "Italian",
                        fr: "French",
                        es: "Spanish",
                      };
                      return map[lang || "en"] || "English";
                    })()}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-fg/40" />
            </motion.div>
          </Link>

          {/* High Contrast Tile */}
          <motion.div
            className="rounded-xl p-5 flex flex-col justify-between min-h-[140px]"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                <Contrast size={20} />
              </div>
              {/* Toggle */}
              <button
                onClick={toggleHighContrast}
                className={`w-11 h-6 rounded-full relative transition-colors ${
                  highContrast ? "bg-accent" : "bg-fg/20"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-fg rounded-full transition-transform ${
                    highContrast ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-lg">High Contrast</h3>
              <p className="text-xs text-fg/50 mt-1">
                Enhances visual clarity and legibility
              </p>
            </div>
          </motion.div>

          {/* Text-to-Speech Tile */}
          <motion.div
            className="rounded-xl p-5 flex flex-col justify-between min-h-[140px]"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                <Volume2 size={20} />
              </div>
              <button
                onClick={toggleTts}
                className={`w-11 h-6 rounded-full relative transition-colors ${
                  tts ? "bg-accent" : "bg-fg/20"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-fg rounded-full transition-transform ${
                    tts ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-lg">Text-to-Speech</h3>
              <p className="text-xs text-fg/50 mt-1">
                Audio descriptions for gallery exhibits
              </p>
            </div>
          </motion.div>

          {/* Font Size Tile */}
          <motion.div
            className="rounded-xl p-5"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                <Type size={20} />
              </div>
              <h3 className="font-bold text-lg">Font Size</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-fg/40">A</span>
              <input
                type="range"
                min={14}
                max={22}
                value={fontSize}
                onChange={(e) => handleFontSize(Number(e.target.value))}
                className="flex-1 accent-accent"
              />
              <span className="text-lg text-fg/70">A</span>
            </div>
            <p className="text-xs text-fg/40 mt-2 text-center">
              {fontSize}px
            </p>
          </motion.div>

          {/* Haptics Tile */}
          <motion.div
            className="rounded-xl p-5 flex flex-col justify-between min-h-[120px]"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                <Vibrate size={20} />
              </div>
              <button
                onClick={() => setHaptics(!haptics)}
                className={`w-11 h-6 rounded-full relative transition-colors ${
                  haptics ? "bg-accent" : "bg-fg/20"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-fg rounded-full transition-transform ${
                    haptics ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-lg">Haptics</h3>
              <p className="text-xs text-fg/50 mt-1">
                Vibration feedback on interactions
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-12 mb-24 text-center space-y-4">
          <div className="flex justify-center gap-6 text-sm text-fg/30">
            <a className="hover:text-accent transition-colors" href="#">
              Privacy Policy
            </a>
            <span>•</span>
            <a className="hover:text-accent transition-colors" href="#">
              Terms of Use
            </a>
          </div>
          <p className="text-xs text-fg/20">ArtNode v1.0</p>
        </footer>
      </main>

      {/* Bottom Navigation (iOS style) */}
      <nav
        className="fixed bottom-0 left-0 right-0 border-t border-fg/5 pt-3 pb-8 px-8 flex items-center justify-around z-40 backdrop-blur-md"
        style={{ background: "rgba(10,15,22,0.9)" }}
      >
        <button
          onClick={() => id && navigate(`/experience/${id}`)}
          className="flex flex-col items-center gap-1 text-fg/40 hover:text-accent transition-colors"
        >
          <Box size={22} />
          <span className="text-[10px] font-medium">Showcase</span>
        </button>
        <div className="flex flex-col items-center gap-1 text-accent">
          <Settings size={22} />
          <span className="text-[10px] font-medium">Settings</span>
        </div>
      </nav>

      {/* iOS Home Indicator */}
      <div className="fixed bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-fg/20 rounded-full z-50" />
    </div>
  );
};

export default AccessibilitySettings;
