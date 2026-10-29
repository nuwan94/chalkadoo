"use client";

import { createContext, useContext, useId, useLayoutEffect } from "react";

/**
 * Each lesson step owns a gate. Interactive pieces inside the step register with it,
 * and "Continue" unlocks once every registered piece reports it is solved.
 * Steps with nothing registered (pure explanation) are open straight away.
 */
export type StepGate = {
  register: (id: string) => () => void;
  solve: (id: string, xp: number) => void;
};

export const StepGateContext = createContext<StepGate | null>(null);

const noopGate: StepGate = { register: () => () => {}, solve: () => {} };

/** Registers the calling component as something the learner must complete in this step. */
export function useGate() {
  const gate = useContext(StepGateContext) ?? noopGate;
  const id = useId();
  // Layout effect so the Continue button never flashes as enabled before registration.
  useLayoutEffect(() => gate.register(id), [gate, id]);
  return { solve: (xp: number) => gate.solve(id, xp) };
}
