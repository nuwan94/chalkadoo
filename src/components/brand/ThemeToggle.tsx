"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";
const KEY = "chalkadoo:theme";

function currentTheme(): Theme {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", cb);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener("change", cb);
  };
}

/** Switches between whiteboard (light) and chalkboard (dark). */
export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, currentTheme, () => null);

  function toggle() {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {}
    listeners.forEach((l) => l());
  }

  const label = theme === "dark" ? "Switch to whiteboard (light)" : "Switch to chalkboard (dark)";
  return (
    <button
      type="button"
      onClick={toggle}
      className="btn btn-ghost !min-h-10 !px-3 !py-1 text-sm"
      aria-label={label}
      title={label}
    >
      <span aria-hidden>{theme === "dark" ? "☀" : "☾"}</span>
      <span className="hidden sm:inline">{theme === "dark" ? "Whiteboard" : "Chalkboard"}</span>
    </button>
  );
}
