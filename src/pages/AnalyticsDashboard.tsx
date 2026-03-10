import React from "react";
import { motion } from "framer-motion";
import { QrCode, Timer, Globe, TrendingUp, Download, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/AdminSidebar";
import type { Experience } from "../types/experience";

import { useDashboardStats } from "../hooks/useDashboardStats";
import { StatCard } from "../components/dashboard/StatCard";
import { RecentExperiencesTable } from "../components/dashboard/RecentExperiencesTable";

const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    loading,
    totalScans,
    topExperiences,
    maxScans,
    recentExperiences,
    categories,
    experiences,
    handleExport,
  } = useDashboardStats();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-fg/5 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-sm text-fg/40">
            <span>Analytics</span>
            <span className="text-fg/20">›</span>
            <span className="font-semibold text-fg">Overview</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-fg/40 hover:text-fg hover:bg-fg/5 rounded-lg transition-colors">
              <Bell size={20} />
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <Download size={16} />
              Export Report
            </button>
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent border border-accent/30">
              <span className="text-xs font-bold">{initials}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Scans"
              value={loading ? "—" : totalScans.toLocaleString()}
              icon={QrCode}
              subtitle="Live"
              subtitleIcon={TrendingUp}
              subtitleColor="text-emerald-400"
              delay={0}
            />
            <StatCard
              title="Active Experiences"
              value={loading ? "—" : experiences.length.toString()}
              icon={Timer}
              subtitle="Published"
              delay={0.05}
            />
            <StatCard
              title="Categories"
              value={loading ? "—" : categories.length}
              icon={Globe}
              subtitle="Active"
              delay={0.1}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Most Scanned Bar Chart */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-2 bg-card p-6 rounded-xl border border-fg/5"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-lg font-bold">Most Scanned Artifacts</h4>
                  <p className="text-sm text-fg/40">
                    Cumulative data for all experiences
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-6 h-6 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                </div>
              ) : topExperiences.length === 0 ? (
                <p className="text-fg/30 text-sm text-center py-8">
                  No experiences yet
                </p>
              ) : (
                <div className="space-y-5">
                  {topExperiences.map((exp: Experience) => (
                    <div key={exp.id}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-fg/80 truncate mr-4">
                          {exp.title}
                        </span>
                        <span className="font-bold shrink-0">
                          {(exp.scanCount || 0).toLocaleString()} scans
                        </span>
                      </div>
                      <div className="w-full bg-fg/5 rounded-full h-2.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${((exp.scanCount || 0) / maxScans) * 100}%`,
                          }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="bg-accent h-2.5 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-card p-6 rounded-xl border border-fg/5 flex flex-col"
            >
              <h4 className="text-lg font-bold mb-1">Categories</h4>
              <p className="text-sm text-fg/40 mb-6">Collection breakdown</p>
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                </div>
              ) : categories.length === 0 ? (
                <p className="text-fg/30 text-sm">No categories yet</p>
              ) : (
                <div className="space-y-3">
                  {categories.map((cat) => {
                    const count = experiences.filter(
                      (e: Experience) => e.category === cat,
                    ).length;
                    return (
                      <div
                        key={cat}
                        className="flex items-center justify-between py-2 border-b border-fg/5"
                      >
                        <span className="text-sm text-fg/70">{cat}</span>
                        <span className="text-xs font-bold bg-accent/10 text-accent px-2 py-1 rounded">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>

          {/* Recent Experiences Table */}
          <RecentExperiencesTable
            experiences={recentExperiences}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
