import type { FC } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Star, Eye } from "lucide-react";
import type { Experience } from "../../types/experience";

interface Props {
  experiences: Experience[];
  loading: boolean;
}

export const RecentExperiencesTable: FC<Props> = ({
  experiences,
  loading,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="bg-card rounded-xl border border-fg/5 overflow-hidden"
    >
      <div className="p-6 border-b border-fg/5 flex items-center justify-between">
        <h4 className="text-lg font-bold">Recent Experiences</h4>
        <button
          onClick={() => navigate("/collections")}
          className="text-accent text-sm font-semibold hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-fg/2 text-fg/40 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-3">Artifact</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Scans</th>
              <th className="px-6 py-3">Engagement</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-fg/30">
                  Loading...
                </td>
              </tr>
            ) : experiences.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-fg/30">
                  No experiences found
                </td>
              </tr>
            ) : (
              experiences.map((exp: Experience) => (
                <tr
                  key={exp.id}
                  onClick={() => navigate(`/welcome/${exp.id}`)}
                  className="hover:bg-fg/3 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {exp.thumbnailURL ? (
                        <img
                          src={exp.thumbnailURL}
                          alt={exp.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-fg/5 flex items-center justify-center text-fg/20 text-xs">
                          ?
                        </div>
                      )}
                      <span className="text-sm font-semibold">{exp.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-fg/50">
                    {exp.category || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
                      <TrendingUp size={12} />
                      {exp.scanCount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star
                        size={14}
                        className={
                          exp.averageRating && exp.averageRating > 0
                            ? "text-amber-400 fill-amber-400"
                            : "text-fg/10"
                        }
                      />
                      <span className="text-sm font-bold text-fg/70">
                        {exp.averageRating && exp.averageRating > 0
                          ? exp.averageRating
                          : "—"}
                      </span>
                      {exp.feedbackCount && exp.feedbackCount > 0 && (
                        <span className="text-[10px] text-fg/30 font-medium ml-1">
                          ({exp.feedbackCount})
                        </span>
                      )}
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => navigate(`/welcome/${exp.id}`)}
                      title="View Experience"
                      className="p-2 text-fg/30 hover:text-accent transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
