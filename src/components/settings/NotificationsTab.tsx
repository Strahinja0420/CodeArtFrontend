import React, { useState } from "react";

export const NotificationsTab: React.FC = () => {
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    () => {
      const saved = localStorage.getItem("artnode_notifications");
      return saved
        ? JSON.parse(saved)
        : {
            "New QR Code scans": true,
            "Weekly analytics report": true,
            "New visitor feedback": true,
            "System updates": true,
          };
    },
  );

  const toggleNotification = (item: string) => {
    const nextState = { ...notifications, [item]: !notifications[item] };
    setNotifications(nextState);
    localStorage.setItem("artnode_notifications", JSON.stringify(nextState));
  };

  return (
    <div className="bg-card rounded-xl border border-fg/5 overflow-hidden">
      <div className="p-6 border-b border-fg/5">
        <h2 className="font-bold">Notification Preferences</h2>
        <p className="text-xs text-fg/40 mt-0.5">
          Choose what you want to be notified about
        </p>
      </div>
      <div className="p-6 space-y-4">
        {[
          "New QR Code scans",
          "Weekly analytics report",
          "New visitor feedback",
          "System updates",
        ].map((item) => (
          <div key={item} className="flex items-center justify-between">
            <p className="text-sm">{item}</p>
            <input
              type="checkbox"
              checked={notifications[item] ?? false}
              onChange={() => toggleNotification(item)}
              className="w-4 h-4 accent-accent cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
