import { useState, useRef, useEffect } from "react";
import type { FC, ChangeEvent } from "react";
import { QRCode } from "react-qrcode-logo";
import { motion } from "framer-motion";
import { Upload, Check, Palette } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../context/AuthContext";
import { userService } from "../api/user.service";

const FRAME_STYLES = [
  { key: "classic", label: "Classic", icon: "crop_square" },
  { key: "modern", label: "Modern", icon: "rounded_corner" },
  { key: "minimal", label: "Minimal", icon: "check_box_outline_blank" },
];

const QRStudio: FC = () => {
  const { user } = useAuth();

  // Customization State
  const [fgColor, setFgColor] = useState("#2575fc");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [eyeColor, setEyeColor] = useState("#2575fc");
  const [frameText, setFrameText] = useState("SCAN FOR INFO");
  const [frameStyle, setFrameStyle] = useState("classic");
  const [qrStyleData, setQrStyleData] = useState<"squares" | "dots" | "fluid">(
    "squares",
  );
  const [logoSize, setLogoSize] = useState(50);
  const [logoPaddingStyle, setLogoPaddingStyle] = useState<"circle" | "square">(
    "circle",
  );

  // Logo State
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load user's existing QR style config on mount
  useEffect(() => {
    if (user?.qrStyle?.config) {
      const config = user.qrStyle.config as any;
      if (config.fgColor) setFgColor(config.fgColor);
      if (config.bgColor) setBgColor(config.bgColor);
      if (config.eyeColor) setEyeColor(config.eyeColor);
      if (config.frameText !== undefined) setFrameText(config.frameText);
      if (config.frameStyle) setFrameStyle(config.frameStyle);
      if (config.qrStyleData) setQrStyleData(config.qrStyleData);
      if (config.logoSize) setLogoSize(config.logoSize);
      if (config.logoPaddingStyle) setLogoPaddingStyle(config.logoPaddingStyle);
    }
    if (user?.qrStyle?.logoURL) {
      setLogoPreview(user.qrStyle.logoURL);
    }
  }, [user]);

  const handleLogoSelection = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      let finalLogoUrl = logoPreview;

      if (logoFile) {
        // Upload new logo file to the server
        const uploadRes: any = await userService.uploadQrLogo(logoFile);
        if (uploadRes?.data?.url || uploadRes?.url) {
          finalLogoUrl = uploadRes.data?.url || uploadRes.url;
        }
      }

      await userService.update(user.id, {
        qrStyle: {
          config: {
            fgColor,
            bgColor,
            eyeColor,
            frameText,
            frameStyle,
            qrStyleData,
            logoSize,
            logoPaddingStyle,
            eyeRadius:
              frameStyle === "modern" ? 10 : frameStyle === "minimal" ? 0 : 5,
          },
          logoURL: finalLogoUrl,
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Failed to save QR style");
    } finally {
      setSaving(false);
    }
  };

  const currentEyeRadius =
    frameStyle === "modern" ? 10 : frameStyle === "minimal" ? 0 : 5;

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-fg/5 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-sm text-fg/40">
            <span>Admin</span>
            <span className="text-fg/20">›</span>
            <span className="font-semibold text-fg">QR Studio</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-accent/90 transition-all">
              <Upload size={16} />
              Generate Batch
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Left: Customization Panel */}
          <aside className="w-96 border-r border-fg/5 bg-card flex flex-col overflow-y-auto">
            <div className="p-6 border-b border-fg/5">
              <h2 className="font-bold text-fg">Customization Tools</h2>
              <p className="text-xs text-fg/40 mt-1">
                Configure your artifact identification tags
              </p>
            </div>

            <div className="flex-1 p-6 space-y-8">
              {/* Logo Upload */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-fg/70">
                    Center Logo
                  </label>
                  {logoPreview && (
                    <button
                      onClick={() => setLogoPreview("")}
                      className="text-[10px] text-red-500 hover:text-red-400 uppercase font-bold"
                    >
                      Clear Logo
                    </button>
                  )}
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-fg/10 rounded-xl p-4 flex flex-col items-center justify-center bg-fg/2 hover:border-accent/40 transition-colors cursor-pointer group"
                >
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleLogoSelection}
                  />
                  {logoPreview ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm flex items-center justify-center border border-fg/10">
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-lg bg-card flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <Upload size={20} className="text-accent" />
                      </div>
                      <p className="text-xs font-medium mt-3 text-fg/50">
                        Drag & Drop Logo
                      </p>
                      <p className="text-[10px] text-fg/30 mt-1">
                        PNG, SVG or WEBP (Max 2MB)
                      </p>
                    </>
                  )}
                </div>

                {/* Logo Advanced Settings */}
                {logoPreview && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-[11px] font-semibold text-fg/40 uppercase">
                          Logo Size
                        </label>
                        <span className="text-[11px] font-bold text-fg/70">
                          {logoSize}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={logoSize}
                        onChange={(e) => setLogoSize(parseInt(e.target.value))}
                        className="w-full accent-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-fg/40 uppercase mb-2">
                        Padding Style
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setLogoPaddingStyle("circle")}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${logoPaddingStyle === "circle" ? "border-accent bg-accent/10 text-accent" : "border-fg/10 text-fg/40 hover:border-fg/20"}`}
                        >
                          Circle
                        </button>
                        <button
                          onClick={() => setLogoPaddingStyle("square")}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${logoPaddingStyle === "square" ? "border-accent bg-accent/10 text-accent" : "border-fg/10 text-fg/40 hover:border-fg/20"}`}
                        >
                          Square
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Data Pattern Style */}
              <section>
                <label className="block text-sm font-semibold text-fg/70 mb-3">
                  Data Pattern
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setQrStyleData("squares")}
                    className={`p-2 rounded-lg border-2 text-xs font-bold ${qrStyleData === "squares" ? "border-accent bg-accent/10 text-accent" : "border-fg/10 text-fg/40 hover:border-fg/20"}`}
                  >
                    Squares
                  </button>
                  <button
                    onClick={() => setQrStyleData("dots")}
                    className={`p-2 rounded-lg border-2 text-xs font-bold ${qrStyleData === "dots" ? "border-accent bg-accent/10 text-accent" : "border-fg/10 text-fg/40 hover:border-fg/20"}`}
                  >
                    Dots
                  </button>
                  <button
                    onClick={() => setQrStyleData("fluid")}
                    className={`p-2 rounded-lg border-2 text-xs font-bold ${qrStyleData === "fluid" ? "border-accent bg-accent/10 text-accent" : "border-fg/10 text-fg/40 hover:border-fg/20"}`}
                  >
                    Fluid
                  </button>
                </div>
              </section>

              {/* Frame Style */}
              <section>
                <label className="block text-sm font-semibold text-fg/70 mb-3">
                  Frame Style
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {FRAME_STYLES.map(({ key, label, icon }) => (
                    <button
                      key={key}
                      onClick={() => setFrameStyle(key)}
                      className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                        frameStyle === key
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-fg/10 hover:border-fg/20 text-fg/40"
                      }`}
                    >
                      <span className="material-icons mb-1 text-lg">
                        {icon}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="block text-[11px] font-semibold text-fg/40 uppercase mb-2">
                    Frame Text
                  </label>
                  <input
                    type="text"
                    value={frameText}
                    onChange={(e) => setFrameText(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-background border border-fg/10 focus:border-accent/50 outline-none text-sm"
                  />
                </div>
              </section>

              {/* Color Configuration */}
              <section>
                <label className="block text-sm font-semibold text-fg/70 mb-3">
                  Color Configuration
                </label>
                <div className="space-y-4">
                  {/* Foreground */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border border-fg/20"
                        style={{ backgroundColor: fgColor }}
                      />
                      <div>
                        <p className="text-xs font-semibold">Foreground</p>
                        <p className="text-[10px] text-fg/40">
                          {fgColor.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <label className="cursor-pointer text-fg/40 hover:text-accent transition-colors">
                      <Palette size={18} />
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  {/* Background */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border border-fg/20"
                        style={{ backgroundColor: bgColor }}
                      />
                      <div>
                        <p className="text-xs font-semibold">Background</p>
                        <p className="text-[10px] text-fg/40">
                          {bgColor.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <label className="cursor-pointer text-fg/40 hover:text-accent transition-colors">
                      <Palette size={18} />
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  {/* Eye Marker */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border border-fg/20"
                        style={{ backgroundColor: eyeColor }}
                      />
                      <div>
                        <p className="text-xs font-semibold">Eye Marker</p>
                        <p className="text-[10px] text-fg/40">
                          {eyeColor.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <label className="cursor-pointer text-fg/40 hover:text-accent transition-colors">
                      <Palette size={18} />
                      <input
                        type="color"
                        value={eyeColor}
                        onChange={(e) => setEyeColor(e.target.value)}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              </section>
            </div>

            {/* Save Action */}
            <div className="p-6 border-t border-fg/5">
              <button
                onClick={handleSave}
                disabled={saving || !user}
                className="w-full bg-accent text-white py-3 rounded-lg font-bold text-sm shadow-lg shadow-accent/20 hover:-translate-y-px transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saved ? (
                  <>
                    <Check size={16} />
                    Saved!
                  </>
                ) : saving ? (
                  "Saving..."
                ) : (
                  "Apply Global Style"
                )}
              </button>
            </div>
          </aside>

          {/* Right: Live Preview Canvas */}
          <section className="flex-1 bg-background p-8 flex flex-col relative overflow-y-auto">
            {/* Preview Title */}
            <div className="mb-6 z-10">
              <h3 className="text-xs font-semibold text-fg/40 uppercase tracking-widest">
                Live Rendering
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl font-bold">QR Preview</span>
                <span className="px-2 py-1 bg-accent/10 text-accent text-[10px] font-bold rounded">
                  DPI: 300 (PRINT READY)
                </span>
              </div>
            </div>

            {/* QR Canvas */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                layout
                className="p-8 rounded-3xl shadow-2xl border border-fg/5 relative bg-white mx-auto my-auto max-w-[90%]"
                style={{ backgroundColor: bgColor }}
              >
                {/* QR Frame */}
                <div
                  className="rounded-2xl p-4 flex flex-col items-center"
                  style={{
                    border: `12px solid ${fgColor}`,
                    borderRadius:
                      frameStyle === "modern"
                        ? "1.5rem"
                        : frameStyle === "minimal"
                          ? "0"
                          : "1rem",
                  }}
                >
                  <div className="relative">
                    <QRCode
                      value="https://example.com/artnode"
                      size={200}
                      bgColor={bgColor}
                      fgColor={fgColor}
                      eyeColor={eyeColor}
                      qrStyle={qrStyleData}
                      logoImage={logoPreview || undefined}
                      logoWidth={logoPreview ? logoSize : 0}
                      logoHeight={logoPreview ? logoSize : 0}
                      logoPaddingStyle={logoPaddingStyle}
                      logoPadding={logoPreview ? 2 : 0}
                      quietZone={0}
                      eyeRadius={currentEyeRadius}
                    />
                  </div>

                  {/* Frame Label */}
                  {frameText && (
                    <div
                      className="mt-6 px-8 py-2 rounded-full"
                      style={{ backgroundColor: fgColor }}
                    >
                      <span
                        className="font-bold tracking-[0.2em] text-sm"
                        style={{ color: bgColor }}
                      >
                        {frameText}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </section>
        </div>

        {/* Status Footer */}
        <footer className="h-10 bg-card border-t border-fg/5 px-6 flex items-center justify-between text-xs text-fg/30 shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              System Ready
            </span>
            <span className="w-px h-3 bg-fg/10" />
            <span>Cloud Sync: Active</span>
          </div>
          <div className="flex items-center gap-4">
            <span>ArtNode QR Studio v1.0</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default QRStudio;
