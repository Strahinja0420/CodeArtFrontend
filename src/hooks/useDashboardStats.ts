import { useExperiences } from "./useExperiences";
import type { Experience } from "../types/experience";

export const useDashboardStats = () => {
  const { experiences, loading } = useExperiences();

  const handleExport = () => {
    const headers = ["Title", "Category", "Author", "Scans", "Created At"];
    const rows = experiences.map((exp: Experience) => [
      exp.title,
      exp.category || "",
      exp.author || "",
      exp.scanCount || 0,
      new Date(exp.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "artnode-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalScans = experiences.reduce(
    (sum: number, exp: Experience) => sum + (exp.scanCount || 0),
    0,
  );

  const topExperiences = [...experiences]
    .sort(
      (a: Experience, b: Experience) => (b.scanCount || 0) - (a.scanCount || 0),
    )
    .slice(0, 5);

  const maxScans = topExperiences[0]?.scanCount || 1;

  const recentExperiences = [...experiences]
    .sort(
      (a: Experience, b: Experience) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const categories = [
    ...new Set(experiences.map((e: Experience) => e.category).filter(Boolean)),
  ];

  return {
    experiences,
    loading,
    totalScans,
    topExperiences,
    maxScans,
    recentExperiences,
    categories,
    handleExport,
  };
};
