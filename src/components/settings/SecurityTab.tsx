import { useState } from "react";
import type { FC } from "react";

interface SecurityTabProps {
  passwordUpdating: boolean;
  onPasswordUpdate: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<boolean>;
}

export const SecurityTab: FC<SecurityTabProps> = ({
  passwordUpdating,
  onPasswordUpdate,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdate = async () => {
    const success = await onPasswordUpdate(currentPassword, newPassword);
    if (success) {
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  return (
    <div className="bg-card rounded-xl border border-fg/5 overflow-hidden">
      <div className="p-6 border-b border-fg/5">
        <h2 className="font-bold">Security & Access</h2>
        <p className="text-xs text-fg/40 mt-0.5">
          Manage your account security settings
        </p>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-xs font-bold text-fg/40 uppercase mb-1.5">
            Current Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-background border border-fg/10 focus:border-accent/50 outline-none text-sm transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-fg/40 uppercase mb-1.5">
            New Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-background border border-fg/10 focus:border-accent/50 outline-none text-sm transition-all"
          />
        </div>
        <button
          onClick={handleUpdate}
          disabled={passwordUpdating || !currentPassword || !newPassword}
          className="px-4 py-2 bg-accent/10 text-accent rounded-lg text-sm font-medium hover:bg-accent/20 transition-colors disabled:opacity-50"
        >
          {passwordUpdating ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
};
