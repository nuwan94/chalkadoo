"use client";

import { useState } from "react";
import { useGate } from "@/components/lesson/context";

export type QuestionStatus = "idle" | "wrong" | "correct" | "revealed";

/** XP for a correct answer by attempt number: 10 first try, then 7, then 5. Revealing gives 0. */
const XP_BY_ATTEMPT = [10, 7, 5];

/** Shared attempt/feedback logic for every question type. */
export function useQuestion() {
  const gate = useGate();
  const [status, setStatus] = useState<QuestionStatus>("idle");
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const done = status === "correct" || status === "revealed";

  return {
    status,
    attempts,
    done,
    message,
    /** Show a gentle message without counting an attempt (e.g. empty or unreadable input). */
    nudge(text: string) {
      setMessage(text);
    },
    submit(correct: boolean) {
      if (done) return;
      const attempt = attempts + 1;
      setAttempts(attempt);
      setMessage(null);
      if (correct) {
        setStatus("correct");
        gate.solve(XP_BY_ATTEMPT[Math.min(attempt, XP_BY_ATTEMPT.length) - 1]);
      } else {
        setStatus("wrong");
      }
    },
    /** Learner gave up after a couple of tries: show the worked answer and open the gate. */
    reveal() {
      setStatus("revealed");
      setMessage(null);
      gate.solve(0);
    },
    /** Clears the "wrong" state when the learner edits their answer. */
    touch() {
      if (status === "wrong") setStatus("idle");
      if (message) setMessage(null);
    },
  };
}

export type QuestionState = ReturnType<typeof useQuestion>;
