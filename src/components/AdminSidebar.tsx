import { useState, useEffect } from "react";
import type { FC } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Landmark,
  LayoutDashboard,
  Package,
  QrCode,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/collections", label: "Collections", icon: Package, end: false },
  { to: "/qr-studio", label: "QR Studio", icon: QrCode, end: false },
  { to: "/settings", label: "Settings", icon: Settings, end: false },
];

const AdminSidebar: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    setAvatarError(false);
  }, [user?.avatarURL]);

  const handleLogout = () => {
    logout();
    navigate("/login");
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
    <aside className="w-64 bg-card text-fg flex-shrink-0 flex flex-col border-r border-fg/5 h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-fg/5">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
          <Landmark size={18} className="text-fg" />
        </div>
        <span className="text-xl font-bold tracking-tight">
          Art<span className="text-accent">Node</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? "bg-accent text-white shadow-lg shadow-accent/20"
                  : "text-fg/50 hover:text-fg hover:bg-fg/5"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-fg/5">
        <div className="flex items-center gap-3 px-2">
          {user?.avatarURL && !avatarError ? (
            <img
              src={user.avatarURL}
              alt={user.name}
              onError={() => setAvatarError(true)}
              className="w-9 h-9 rounded-full object-cover border border-accent/30 flex-shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent border border-accent/30 flex-shrink-0">
              <span className="text-xs font-bold">{initials}</span>
            </div>
          )}
          <div className="flex-1 overflow-hidden min-w-0">
            <p className="text-sm font-semibold truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-fg/40 truncate">
              {user?.email || "Administrator"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-fg/30 hover:text-fg transition-colors flex-shrink-0"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
