export function formatDate(date) {
  if (!date) return "";
  if (date instanceof Date && !Number.isNaN(date.getTime())) {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  if (typeof date === "string") {
    const clean = date.slice(0, 10);
    const parts = clean.split("-").map(Number);
    if (parts.length === 3 && !parts.some(Number.isNaN)) {
      const [year, month, day] = parts;
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    const d = new Date(date);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    return clean;
  }
  return String(date);
}

export function dateValue(date) {
  if (!date) return 0;
  if (date instanceof Date && !Number.isNaN(date.getTime())) {
    return date.getTime();
  }
  if (typeof date === "string") {
    const clean = date.slice(0, 10);
    const parts = clean.split("-").map(Number);
    if (parts.length === 3 && !parts.some(Number.isNaN)) {
      const [year, month, day] = parts;
      return new Date(year, month - 1, day).getTime();
    }
  }
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}

