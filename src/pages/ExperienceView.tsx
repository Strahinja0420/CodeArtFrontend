import { useState, useRef, useEffect } from "react";
import type { FC, DetailedHTMLProps, HTMLAttributes, CSSProperties } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Share2,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Headphones,
  Box,
  Info,
  Star,
  Check,
} from "lucide-react";
import { useExperience } from "../hooks/useExperience";
import { experienceService } from "../api/experience.service";
import { useAuth } from "../context/AuthContext";
import { getTranslations, langBcp47, type LangCode } from "../i18n/translations";
import { translateFields } from "../i18n/translate";
import "@google/model-viewer";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          "camera-controls"?: boolean;
          "auto-rotate"?: boolean;
          "touch-action"?: string;
          style?: CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

const ExperienceView: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { experience } = useExperience(id);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasRecordedScan = useRef(false);

  const t = getTranslations();
  const lang = (localStorage.getItem("artnode_language") || "en") as LangCode;

  // Translated dynamic content
  const [translated, setTranslated] = useState<{
    description?: string;
    material?: string;
    period?: string;
    category?: string;
  } | null>(null);

  // Feedback State
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    if (id && !hasRecordedScan.current) {
      hasRecordedScan.current = true;
      experienceService.recordScan(id).catch(() => {});
    }
  }, [id]);

  // Apply persisted accessibility settings
  useEffect(() => {
    const hc = localStorage.getItem("artnode_highcontrast") === "true";
    document.documentElement.classList.toggle("high-contrast", hc);
    const fs = Number(localStorage.getItem("artnode_fontsize") || "16");
    document.documentElement.style.fontSize = `${fs}px`;
  }, []);

  // Translate dynamic content when experience loads
  useEffect(() => {
    if (!experience || lang === "en") return;
    translateFields(
      {
        description: experience.description ?? "",
        material: experience.material ?? "",
        period: experience.period ?? "",
        category: experience.category ?? "",
      },
      lang,
    ).then(setTranslated);
  }, [experience, lang]);

  // TTS: read artifact content when experience loads
  useEffect(() => {
    if (!experience) return;
    const ttsEnabled = localStorage.getItem("artnode_tts") === "true";
    if (!ttsEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const text = [
      experience.title,
      experience.author ? `${t.by} ${experience.author}` : "",
      experience.yearCreated ? `${t.from} ${experience.yearCreated}` : "",
      experience.description ?? "",
    ]
      .filter(Boolean)
      .join(". ");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langBcp47[lang] ?? "en-US";
    window.speechSynthesis.speak(utterance);
    return () => { window.speechSynthesis.cancel(); };
  }, [experience]);

  const handleFeedbackSubmit = async () => {
    if (userRating === 0 || !id) return;
    setIsSubmittingFeedback(true);
    try {
      await experienceService.addFeedback(id, {
        rating: userRating,
        comment,
      });
      setFeedbackSubmitted(true);
    } catch {
      alert("Failed to submit feedback");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!experience)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-bold">
        {t.loading}
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-fg p-4 max-w-2xl mx-auto pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        {user ? (
          <button
            onClick={() => navigate("/")}
            className="p-3 glass rounded-full hover:bg-fg/10 transition-all"
          >
            <Home size={24} />
          </button>
        ) : (
          <div className="w-12" />
        )}
        <div className="px-4 py-2 glass rounded-full text-xs font-bold tracking-widest uppercase text-fg/40">
          {translated?.category || experience.category || t.gallery}
        </div>
        <button
          onClick={() => {
            const url = window.location.href;
            if (navigator.share) {
              navigator.share({ title: experience.title, url });
            } else {
              navigator.clipboard
                .writeText(url)
                .then(() => alert("Link copied!"));
            }
          }}
          className="p-3 glass rounded-full hover:bg-fg/10 transition-all"
        >
          <Share2 size={24} />
        </button>
      </div>

      {/* 3D Viewer Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative h-[450px] glass rounded-[3rem] overflow-hidden mb-8"
      >
        {experience.storageLocation ? (
          <model-viewer
            src={experience.storageLocation}
            camera-controls
            auto-rotate
            touch-action="pan-y"
            alt={experience.title}
            style={{ width: "100%", height: "100%", background: "transparent" }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-fg/20 gap-4">
            <Box size={64} strokeWidth={1} />
            <p className="font-medium italic">{t.no3DModel}</p>
          </div>
        )}

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-full flex gap-6 text-fg/40">
          <RotateCcw
            size={20}
            className="cursor-pointer hover:text-fg transition-colors"
          />
          <RotateCw
            size={20}
            className="cursor-pointer hover:text-fg transition-colors"
          />
        </div>
      </motion.div>

      {/* Audio Guide Section */}
      {experience.audioLocation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-[2.5rem] mb-8"
        >
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 bg-accent rounded-3xl flex items-center justify-center shadow-lg shadow-accent/20">
              <Headphones size={28} />
            </div>
            <div>
              <p className="text-fg/40 text-sm font-bold uppercase tracking-widest mb-1">
                {t.audioGuide}
              </p>
              <h3 className="text-xl font-bold">
                {experience.title} {t.narration}
              </h3>
            </div>
          </div>

          <audio
            ref={audioRef}
            src={experience.audioLocation}
            onEnded={() => setIsPlaying(false)}
          />

          <div className="flex items-center justify-center gap-10">
            <RotateCcw
              size={24}
              className="text-fg/40 hover:text-fg cursor-pointer transition-colors"
              onClick={() =>
                audioRef.current && (audioRef.current.currentTime -= 10)
              }
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleAudio}
              className="w-20 h-20 bg-accent rounded-full flex items-center justify-center shadow-xl shadow-accent/30"
            >
              {isPlaying ? (
                <Pause size={32} />
              ) : (
                <Play size={32} fill="white" />
              )}
            </motion.button>
            <RotateCw
              size={24}
              className="text-fg/40 hover:text-fg cursor-pointer transition-colors"
              onClick={() =>
                audioRef.current && (audioRef.current.currentTime += 30)
              }
            />
          </div>
        </motion.div>
      )}

      {/* Description Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-2 mb-12"
      >
        <h1 className="text-5xl font-bold mb-3">{experience.title}</h1>
        <p className="text-accent font-bold uppercase tracking-widest text-sm mb-8">
          {experience.author || t.unknownArtist} •{" "}
          {experience.yearCreated || t.discovery}
        </p>

        <div className="h-px bg-fg/10 w-24 mb-8" />

        <p className="text-fg/60 leading-relaxed text-lg mb-10">
          {translated?.description || experience.description}
        </p>

        <div className="grid grid-cols-2 gap-6">
          <div className="glass p-6 rounded-3xl">
            <p className="text-fg/30 text-xs font-bold uppercase mb-2">
              {t.material}
            </p>
            <p className="font-bold text-lg">
              {translated?.material || experience.material || t.artifactual}
            </p>
          </div>
          <div className="glass p-6 rounded-3xl">
            <p className="text-fg/30 text-xs font-bold uppercase mb-2">
              {t.period}
            </p>
            <p className="font-bold text-lg">
              {translated?.period || experience.period || t.universal}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Feedback Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass p-8 rounded-[2.5rem] shadow-inner mb-4"
      >
        {feedbackSubmitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full mx-auto flex items-center justify-center mb-3">
              <Check size={24} />
            </div>
            <h4 className="font-bold text-lg mb-1">{t.thankYou}</h4>
            <p className="text-sm text-fg/40">{t.feedbackThanks}</p>
          </div>
        ) : (
          <>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Star className="text-amber-400 fill-amber-400" size={20} />
              {t.rateExperience}
            </h4>
            <div className="flex gap-3 mb-6 items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setUserRating(star)}
                  className={`transition-all duration-200 ${
                    userRating >= star
                      ? "text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                      : "text-fg/10 hover:text-fg/20"
                  }`}
                >
                  <Star
                    size={32}
                    fill={userRating >= star ? "currentColor" : "none"}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-fg/30 uppercase ml-2">
                {t.ratings[userRating - 1] || t.selectRating}
              </span>
            </div>
            {userRating > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <textarea
                  placeholder={t.feedbackPlaceholder}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-fg/5 border border-fg/10 rounded-2xl p-4 text-sm outline-none focus:border-accent/40 transition-colors mb-4 min-h-[100px] resize-none"
                />
                <button
                  onClick={handleFeedbackSubmit}
                  disabled={isSubmittingFeedback}
                  className="w-full bg-accent text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-accent/90 transition-all disabled:opacity-50"
                >
                  {isSubmittingFeedback ? t.submitting : t.postReview}
                </button>
              </motion.div>
            )}
          </>
        )}
      </motion.div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 h-20 glass border-t border-fg/5 flex items-center justify-around px-8 pb-2">
        <button className="flex flex-col items-center gap-1 text-accent">
          <Info size={22} />
          <span className="text-[10px] font-medium">{t.showcase}</span>
        </button>
        <button
          onClick={() => navigate(`/experience/${id}/settings`)}
          className="flex flex-col items-center gap-1 text-fg/40 hover:text-accent transition-colors"
        >
          <Share2 size={22} />
          <span className="text-[10px] font-medium">{t.settings}</span>
        </button>
      </div>
    </div>
  );
};

export default ExperienceView;
