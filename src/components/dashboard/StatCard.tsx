import React from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  subtitle: string;
  subtitleIcon?: React.ElementType;
  subtitleColor?: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  subtitleIcon: SubtitleIcon,
  subtitleColor = "text-fg/30",
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card p-6 rounded-xl border border-fg/5 relative overflow-hidden group"
    >
      <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform">
        <Icon size={96} className="text-accent" />
      </div>
      <p className="text-xs font-semibold text-fg/40 uppercase tracking-wider mb-1">
        {title}
      </p>
      <div className="flex items-end gap-3">
        <h3 className="text-3xl font-bold">{value}</h3>
        <span
          className={`${subtitleColor} text-sm font-semibold flex items-center mb-1`}
        >
          {SubtitleIcon && <SubtitleIcon size={14} className="mr-1" />}
          {subtitle}
        </span>
      </div>
    </motion.div>
  );
};
