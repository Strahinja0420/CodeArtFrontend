import type { FC } from "react";

interface AppearanceTabProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const AppearanceTab: FC<AppearanceTabProps> = ({
  darkMode,
  setDarkMode,
}) => {
  return (
    <div className="bg-card rounded-xl border border-fg/5 overflow-hidden">
      <div className="p-6 border-b border-fg/5">
        <h2 className="font-bold">Preferences</h2>
        <p className="text-xs text-fg/40 mt-0.5">
          Customize your administrative experience
        </p>
      </div>
      <div className="p-6 space-y-6">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Dark Mode</p>
            <p className="text-xs text-fg/40">
              Enable high-contrast night theme
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-10 h-6 rounded-full relative flex items-center px-1 transition-colors ${
              darkMode ? "bg-accent" : "bg-fg/20"
            }`}
          >
            <div
              className={`w-4 h-4 bg-fg rounded-full transition-transform ${
                darkMode ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
