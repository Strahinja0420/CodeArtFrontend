import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, Palette, Shield } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";

import { useAdminSettings } from "../hooks/useAdminSettings";
import { ProfileTab } from "../components/settings/ProfileTab";
import { AppearanceTab } from "../components/settings/AppearanceTab";
import { SecurityTab } from "../components/settings/SecurityTab";
import { NotificationsTab } from "../components/settings/NotificationsTab";

type TabKey = "profile" | "appearance" | "security" | "notifications";

const TAB_ITEMS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "profile", label: "Institution Profile", icon: <User size={16} /> },
  { key: "appearance", label: "Appearance", icon: <Palette size={16} /> },
  { key: "security", label: "Security & Access", icon: <Shield size={16} /> },
  {
    key: "notifications",
    label: "Notifications",
    icon: <Bell size={16} />,
  },
];

const AdminSettings: React.FC = () => {
  const {
    user,
    avatarUploading,
    passwordUpdating,
    isDarkMode,
    setDarkMode,
    handleSaveProfile,
    handleAvatarUpload,
    handlePasswordUpdate,
  } = useAdminSettings();

  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [name, setName] = useState(user?.name || "");

  // Auto-save name changes
  React.useEffect(() => {
    if (name && name !== user?.name) {
      const timer = setTimeout(() => {
        handleSaveProfile(name, isDarkMode);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [name, isDarkMode, handleSaveProfile, user?.name]);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-fg/5 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-sm text-fg/40">
            <span>Admin</span>
            <span className="text-fg/20">›</span>
            <span className="font-semibold text-fg">Settings</span>
          </div>
        </header>

        {/* Settings Body */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl font-bold">Institution Settings</h1>
              <p className="text-fg/40 text-sm mt-1">
                Manage your museum profile, dashboard preferences, and security.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Tab Nav */}
              <nav className="space-y-1">
                {TAB_ITEMS.map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                      activeTab === key
                        ? "bg-card text-accent shadow-sm border border-accent/10"
                        : "text-fg/50 hover:text-fg hover:bg-fg/5"
                    }`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </nav>

              {/* Content Area */}
              <div className="md:col-span-2 space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    {activeTab === "profile" && (
                      <ProfileTab
                        user={user}
                        name={name}
                        setName={setName}
                        email={user?.email || ""}
                        avatarUploading={avatarUploading}
                        onAvatarUpload={handleAvatarUpload}
                      />
                    )}

                    {activeTab === "appearance" && (
                      <AppearanceTab
                        darkMode={isDarkMode}
                        setDarkMode={setDarkMode}
                      />
                    )}

                    {activeTab === "security" && (
                      <SecurityTab
                        passwordUpdating={passwordUpdating}
                        onPasswordUpdate={handlePasswordUpdate}
                      />
                    )}

                    {activeTab === "notifications" && <NotificationsTab />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
