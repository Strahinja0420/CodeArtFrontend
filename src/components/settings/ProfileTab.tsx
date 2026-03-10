import React, { useRef } from "react";
import { Upload } from "lucide-react";

interface ProfileTabProps {
  user: any;
  name: string;
  setName: (name: string) => void;
  email: string;
  avatarUploading: boolean;
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<boolean>;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  name,
  setName,
  email,
  avatarUploading,
  onAvatarUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarError, setAvatarError] = React.useState(false);

  React.useEffect(() => {
    setAvatarError(false);
  }, [user?.avatarURL]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const success = await onAvatarUpload(e);
    if (success && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-card rounded-xl border border-fg/5 overflow-hidden">
      <div className="p-6 border-b border-fg/5">
        <h2 className="font-bold">Institution Profile</h2>
        <p className="text-xs text-fg/40 mt-0.5">
          Public information about your museum
        </p>
      </div>
      <div className="p-6 space-y-4">
        {/* Avatar */}
        <div className="flex items-center gap-6 mb-2">
          <div className="relative group">
            <div className="w-20 h-20 rounded-xl bg-accent/20 flex items-center justify-center border-2 border-dashed border-accent/30 group-hover:border-accent transition-colors overflow-hidden">
              {user?.avatarURL && !avatarError ? (
                <img
                  src={user.avatarURL}
                  alt="Avatar"
                  onError={() => setAvatarError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-accent">
                  {initials}
                </span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleUpload}
              disabled={avatarUploading}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="absolute -bottom-2 -right-2 bg-card border border-fg/10 p-1.5 rounded-full shadow-lg text-accent hover:text-fg transition-colors disabled:opacity-50"
            >
              <Upload
                size={12}
                className={avatarUploading ? "animate-pulse" : ""}
              />
            </button>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Profile Avatar</h3>
            <p className="text-xs text-fg/40 mt-1">
              Shown in QR code frames and the visitor app.
            </p>
          </div>
        </div>

        {/* Fields */}
        <div>
          <label className="block text-xs font-bold text-fg/40 uppercase mb-1.5">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-background border border-fg/10 focus:border-accent/50 outline-none text-sm transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-fg/40 uppercase mb-1.5">
            Institutional Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-2.5 rounded-lg bg-background border border-fg/5 outline-none text-sm text-fg/40 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};
