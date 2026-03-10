import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  MoreVertical,
  QrCode,
  Bell,
  Trash2,
  Pencil,
  RefreshCw,
  Eye,
  Copy,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useExperiences } from "../hooks/useExperiences";
import { experienceService } from "../api/experience.service";
import AdminSidebar from "../components/AdminSidebar";
import CreateExperienceForm from "./CreateExperienceForm";
import EditExperienceModal from "../components/EditExperienceModal";
import type { Experience } from "../types/experience";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { experiences, loading, refresh } = useExperiences();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const categories = [
    "All",
    ...Array.from(
      new Set(experiences.map((e: Experience) => e.category).filter(Boolean)),
    ),
  ] as string[];

  const filteredExperiences = experiences.filter((exp: Experience) => {
    const matchesSearch = exp.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || exp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Delete this experience? This cannot be undone.")) return;
    try {
      await experienceService.delete(id);
      refresh();
    } catch {
      alert("Failed to delete experience");
    }
  };

  const handleRegenerateQR = async (id: string) => {
    setOpenMenuId(null);
    try {
      await experienceService.regenerateQR(id);
      refresh();
      alert("QR code regenerated successfully");
    } catch {
      alert("Failed to regenerate QR code");
    }
  };

  const handleCopyQR = (url: string) => {
    setOpenMenuId(null);
    navigator.clipboard.writeText(url).then(() => alert("QR URL copied!"));
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-fg/5 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-sm text-fg/40">
            <span>Admin</span>
            <span className="text-fg/20">›</span>
            <span className="font-semibold text-fg">Collections</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-fg/40 hover:text-fg hover:bg-fg/5 rounded-lg transition-colors">
              <Bell size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent border border-accent/30">
              <span className="text-xs font-bold">{initials}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Page Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">Collections Library</h1>
              <p className="text-fg/40 text-sm">
                Manage and organize {experiences.length} artifact experience
                {experiences.length !== 1 ? "s" : ""}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-lg shadow-accent/20 transition-all"
            >
              <Plus size={16} />
              Add New Artifact
            </motion.button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-fg/30"
              />
              <input
                type="text"
                placeholder="Search by name or artist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-card border border-fg/10 focus:border-accent/50 outline-none transition-all text-sm"
              />
            </div>
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-fg/10 hover:bg-fg/5 hover:border-fg/20 transition-colors text-sm cursor-pointer">
                {categoryFilter}
                <ChevronDown size={14} className="text-fg/40 transition-transform duration-200 rotate-90 group-hover:rotate-0" />
              </button>
              <div className="absolute left-0 top-full mt-1 z-50 w-40 bg-card border border-fg/10 rounded-xl shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-fg/5 transition-colors ${categoryFilter === cat ? "text-accent" : "text-fg/70"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-xl border border-fg/5 overflow-visible">
            <table className="w-full text-left" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
              <thead>
                <tr className="bg-fg/[0.03] border-b border-fg/5">

                  <th className="px-6 py-4 font-semibold text-sm text-fg/40 rounded-tl-xl">Thumbnail</th>
                  <th className="px-6 py-4 font-semibold text-sm text-fg/40">Artifact Name</th>
                  <th className="px-6 py-4 font-semibold text-sm text-fg/40">Category</th>
                  <th className="px-6 py-4 font-semibold text-sm text-fg/40">Scans</th>
                  <th className="px-6 py-4 font-semibold text-sm text-fg/40">Date Added</th>
                  <th className="px-6 py-4 font-semibold text-sm text-fg/40 text-right rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                      </div>
                    </td>
                  </tr>
                ) : filteredExperiences.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-fg/30">
                      No experiences found
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {filteredExperiences.map((exp: Experience, idx: number) => (
                      <motion.tr
                        key={exp.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.04 }}
                        className="hover:bg-fg/[0.02] transition-colors cursor-pointer"
                        onClick={() => navigate(`/experience/${exp.id}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="w-12 h-12 rounded-lg bg-fg/5 overflow-hidden border border-fg/10 shrink-0">
                            {exp.thumbnailURL ? (
                              <img src={exp.thumbnailURL} alt={exp.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-fg/20 text-xs">?</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-sm">{exp.title}</div>
                          <div className="text-xs text-fg/30 mt-0.5">{exp.author || "Unknown Author"}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                            {exp.category || "General"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-fg/60">{exp.scanCount || 0}</td>
                        <td className="px-6 py-4 text-sm text-fg/40">
                          {new Date(exp.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>

                        {/* Actions Cell */}
                        <td
                          className="px-6 py-4 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1">
                            {/* QR Code – open in new tab */}
                            {exp.QRcodeUrl && (
                              <button
                                onClick={() => window.open(exp.QRcodeUrl!, "_blank")}
                                title="View QR Code"
                                className="p-1.5 text-fg/30 hover:text-accent transition-colors rounded"
                              >
                                <QrCode size={17} />
                              </button>
                            )}

                            {/* Edit – open edit modal */}
                            <button
                              onClick={() => setEditingExp(exp)}
                              title="Edit"
                              className="p-1.5 text-fg/30 hover:text-fg transition-colors rounded"
                            >
                              <Pencil size={17} />
                            </button>

                            {/* More dropdown */}
                            <div
                              className="relative"
                              ref={openMenuId === exp.id ? menuRef : undefined}
                            >
                              <button
                                onClick={() =>
                                  setOpenMenuId(openMenuId === exp.id ? null : exp.id)
                                }
                                title="More options"
                                className="p-1.5 text-fg/30 hover:text-fg transition-colors rounded"
                              >
                                <MoreVertical size={17} />
                              </button>

                              <AnimatePresence>
                                {openMenuId === exp.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                    className="absolute right-0 top-8 z-50 w-48 bg-card border border-fg/10 rounded-xl shadow-2xl overflow-hidden"
                                  >
                                    <button
                                      onClick={() => {
                                        setOpenMenuId(null);
                                        navigate(`/experience/${exp.id}`);
                                      }}
                                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-fg/5 transition-colors text-left"
                                    >
                                      <Eye size={15} className="text-fg/40" />
                                      View Experience
                                    </button>
                                    <button
                                      onClick={() => handleRegenerateQR(exp.id)}
                                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-fg/5 transition-colors text-left"
                                    >
                                      <RefreshCw size={15} className="text-fg/40" />
                                      Regenerate QR
                                    </button>
                                    {exp.QRcodeUrl && (
                                      <button
                                        onClick={() => handleCopyQR(exp.QRcodeUrl!)}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-fg/5 transition-colors text-left"
                                      >
                                        <Copy size={15} className="text-fg/40" />
                                        Copy QR URL
                                      </button>
                                    )}
                                    <div className="border-t border-fg/5" />
                                    <button
                                      onClick={(e) => handleDelete(e as any, exp.id)}
                                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-red-500/10 text-red-400 transition-colors text-left"
                                    >
                                      <Trash2 size={15} />
                                      Delete
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <CreateExperienceForm
              onCancel={() => setShowCreateModal(false)}
              onSuccess={() => {
                setShowCreateModal(false);
                refresh();
              }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingExp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingExp(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <EditExperienceModal
              experience={editingExp}
              onCancel={() => setEditingExp(null)}
              onSuccess={() => {
                setEditingExp(null);
                refresh();
              }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
