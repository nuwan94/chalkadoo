"use client";

import { useSyncExternalStore } from "react";

/**
 * Learner progress, kept in localStorage until accounts arrive (phase 2).
 * Reads and writes are wrapped so private windows and blocked storage still work.
 */
export type LessonProgress = { completed: boolean; bestXp: number; lastStep: number };
export type Progress = { xp: number; lessons: Record<string, LessonProgress> };

const KEY = "chalkadoo:progress";
const EMPTY: Progress = { xp: 0, lessons: {} };

let cachedRaw: string | null = null;
let cached: Progress = EMPTY;
const listeners = new Set<() => void>();

function read(): Progress {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {}
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  try {
    cached = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    cached = EMPTY;
  }
  return cached;
}

function write(next: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable: keep progress in memory for this page view.
    cachedRaw = JSON.stringify(next);
    cached = next;
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

/** Returns null during server rendering and hydration, then the stored progress. */
export function useProgress(): Progress | null {
  return useSyncExternalStore<Progress | null>(subscribe, read, () => null);
}

export function saveStep(key: string, step: number) {
  const p = read();
  const prev = p.lessons[key] ?? { completed: false, bestXp: 0, lastStep: 0 };
  write({ ...p, lessons: { ...p.lessons, [key]: { ...prev, lastStep: step } } });
}

export function completeLesson(key: string, xp: number) {
  const p = read();
  const prev = p.lessons[key] ?? { completed: false, bestXp: 0, lastStep: 0 };
  // Only XP above the previous best counts, so replaying a lesson can't farm points.
  const gained = Math.max(0, xp - prev.bestXp);
  write({
    xp: p.xp + gained,
    lessons: { ...p.lessons, [key]: { completed: true, bestXp: Math.max(prev.bestXp, xp), lastStep: 0 } },
  });
  return gained;
}
