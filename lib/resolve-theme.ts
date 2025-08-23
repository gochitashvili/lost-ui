export function resolveTheme(theme: string | undefined): "light" | "dark" {
  if (theme === "dark") return "dark";
  if (theme === "light") return "light";

  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return "light";
}
