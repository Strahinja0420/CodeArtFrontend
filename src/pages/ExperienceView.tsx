import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
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
import "@google/model-viewer";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          "camera-controls"?: boolean;
          "auto-rotate"?: boolean;
          "touch-action"?: string;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

const ExperienceView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { experience } = useExperience(id);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasRecordedScan = useRef(false);

  // Feedback State
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  React.useEffect(() => {
    if (id && !hasRecordedScan.current) {
      hasRecordedScan.current = true;
      experienceService.recordScan(id).catch(() => {});
    }
  }, [id]);

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
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-fg p-4 max-w-2xl mx-auto pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-3 glass rounded-full hover:bg-fg/10 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="px-4 py-2 glass rounded-full text-xs font-bold tracking-widest uppercase text-fg/40">
          {experience.category || "GALLERY 04"}
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
            <p className="font-medium italic">No 3D Visual Available</p>
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
                Audio Guide
              </p>
              <h3 className="text-xl font-bold">
                {experience.title} Narration
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
          {experience.author || "Unknown Artist"} •{" "}
          {experience.yearCreated || "Discovery"}
        </p>

        <div className="h-px bg-fg/10 w-24 mb-8" />

        <p className="text-fg/60 leading-relaxed text-lg mb-10">
          {experience.description}
        </p>

        <div className="grid grid-cols-2 gap-6">
          <div className="glass p-6 rounded-3xl">
            <p className="text-fg/30 text-xs font-bold uppercase mb-2">
              Material
            </p>
            <p className="font-bold text-lg">
              {experience.material || "Artifactual"}
            </p>
          </div>
          <div className="glass p-6 rounded-3xl">
            <p className="text-fg/30 text-xs font-bold uppercase mb-2">
              Period
            </p>
            <p className="font-bold text-lg">
              {experience.period || "Universal"}
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
            <h4 className="font-bold text-lg mb-1">Thank you!</h4>
            <p className="text-sm text-fg/40">
              Your feedback helps others discover this piece.
            </p>
          </div>
        ) : (
          <>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Star className="text-amber-400 fill-amber-400" size={20} />
              Rate this experience
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
                {["Poor", "Decent", "Good", "Great", "Incredible"][
                  userRating - 1
                ] || "Select Rating"}
              </span>
            </div>
            {userRating > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <textarea
                  placeholder="Tell us what you discovered... (Optional)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-fg/5 border border-fg/10 rounded-2xl p-4 text-sm outline-none focus:border-accent/40 transition-colors mb-4 min-h-[100px] resize-none"
                />
                <button
                  onClick={handleFeedbackSubmit}
                  disabled={isSubmittingFeedback}
                  className="w-full bg-accent text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-accent/90 transition-all disabled:opacity-50"
                >
                  {isSubmittingFeedback ? "Submitting..." : "Post Review"}
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
          <span className="text-[10px] font-medium">Showcase</span>
        </button>
        <button
          onClick={() => navigate(`/experience/${id}/settings`)}
          className="flex flex-col items-center gap-1 text-fg/40 hover:text-accent transition-colors"
        >
          <Share2 size={22} />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default ExperienceView;
