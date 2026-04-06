import { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userService } from "../api/user.service";


export const useAdminSettings = () => {
  const { user, login, logout, isDarkMode, setDarkMode } = useAuth();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  const handleSaveProfile = async (name: string, darkMode: boolean) => {
    if (!user) return;
    setSaving(true);
    try {
      await userService.update(user.id, { name, dark: darkMode });

      // Update user context directly with the new values
      login(localStorage.getItem("token") || "", {
        ...user,
        name,
        dark: darkMode,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return false;

    setAvatarUploading(true);
    try {
      const res: any = await userService.uploadAvatar(file);
      const newAvatarURL = res.data?.url || res.url;

      if (user && newAvatarURL) {
        login(localStorage.getItem("token") || "", {
          ...user,
          avatarURL: newAvatarURL,
          dark: isDarkMode,
        });
      }
    } catch (err) {
      alert("Failed to upload avatar");
    } finally {
      setAvatarUploading(false);
      // Let the component handle clearing the input
      return true;
    }
    return false;
  };

  const handlePasswordUpdate = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    if (!user || !currentPassword || !newPassword) return false;

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return false;
    }

    setPasswordUpdating(true);
    try {
      await userService.updatePassword(user.id, {
        currentPassword,
        newPassword,
      });
      alert("Password updated successfully! Please log in again.");
      logout();
      navigate("/login");
      return true;
    } catch (err: any) {
      alert("Failed to update password. Check your current password.");
      return false;
    } finally {
      setPasswordUpdating(false);
    }
  };

  return {
    user,
    saving,
    saved,
    avatarUploading,
    passwordUpdating,
    isDarkMode: isDarkMode,
    setDarkMode: setDarkMode,
    handleSaveProfile,
    handleAvatarUpload,
    handlePasswordUpdate,
  };
};
