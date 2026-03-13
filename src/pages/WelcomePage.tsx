import { useState } from "react";
import type { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Landmark } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English", emoji: "🇬🇧" },
  { code: "sl", label: "Slovenian", emoji: "🇸🇮" },
  { code: "de", label: "German", emoji: "🇩🇪" },
  { code: "it", label: "Italian", emoji: "🇮🇹" },
  { code: "fr", label: "French", emoji: "🇫🇷" },
  { code: "es", label: "Spanish", emoji: "🇪🇸" },
];

const WelcomePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState("en");

  const handleEnter = () => {
    localStorage.setItem("artnode_language", selectedLang);
    navigate(`/experience/${id}`);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-between px-6 pt-16 pb-12 overflow-hidden">
      {/* Background gradient */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, #0a0f16 0%, #0d1520 60%, #0a0f16 100%)",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12px 12px, #2575fc 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col min-h-screen py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 bg-accent flex items-center justify-center rounded-2xl shadow-lg shadow-accent/30">
              <Landmark size={28} className="text-fg" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-1">ArtNode</h1>
          <p className="text-accent/80 font-medium tracking-widest uppercase text-xs">
            Cultural Navigation
          </p>
          <div className="mt-8">
            <h2 className="text-3xl font-light italic text-fg/90">
              Welcome
            </h2>
            <div className="h-0.5 w-12 bg-accent mx-auto mt-4 rounded-full opacity-50" />
          </div>
        </motion.header>

        {/* Language Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-grow grid grid-cols-2 gap-4 mb-10 content-start"
        >
          {LANGUAGES.map(({ code, label, emoji }, i) => {
            const isSelected = selectedLang === code;
            return (
              <motion.button
                key={code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                onClick={() => setSelectedLang(code)}
                className={`rounded-xl p-5 flex flex-col items-center justify-center transition-all active:scale-95 ${
                  isSelected
                    ? "border border-accent/50 shadow-lg shadow-accent/20"
                    : "border border-fg/10 hover:border-fg/20"
                }`}
                style={{
                  background: isSelected
                    ? "rgba(37, 117, 252, 0.12)"
                    : "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className={`w-12 h-12 mb-3 overflow-hidden rounded-full border-2 flex items-center justify-center text-2xl ${
                    isSelected ? "border-accent/40" : "border-fg/10"
                  }`}
                >
                  {emoji}
                </div>
                <span className="text-sm font-medium">{label}</span>
              </motion.button>
            );
          })}
        </motion.section>

        {/* CTA */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-auto"
        >
          <button
            onClick={handleEnter}
            className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-5 rounded-xl text-lg shadow-xl shadow-accent/30 transition-all flex items-center justify-center gap-3 group"
          >
            Enter Experience
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
          <p className="text-center text-fg/30 text-[10px] uppercase tracking-widest mt-6">
            © 2025 ArtNode Gallery Systems
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default WelcomePage;
