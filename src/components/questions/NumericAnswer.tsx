"use client";

import { useId, useState } from "react";
import { RichText } from "@/components/math/RichText";
import { numbersEqual, parseNumber } from "@/lib/answers";
import { QuestionShell } from "./QuestionShell";
import { useQuestion } from "./useQuestion";

/** A number answer. Accepts `7`, `3.5`, `7/2` and the like. */
export function NumericAnswer({
  prompt,
  label,
  answer,
  hint,
  explanation,
}: {
  prompt?: string;
  /** Shown before the input, e.g. "$x =$". */
  label?: string;
  answer: number;
  hint?: string;
  explanation?: string;
}) {
  const q = useQuestion();
  const [value, setValue] = useState("");
  const inputId = useId();

  function check() {
    const n = parseNumber(value);
    if (n === null) {
      q.nudge("That's not a number I recognise. Try something like 7, -2 or 3/4.");
      return;
    }
    q.submit(numbersEqual(n, answer));
  }

  const tone =
    q.status === "correct" || q.status === "revealed"
      ? "bg-correct"
      : q.status === "wrong"
        ? "bg-wrong"
        : "bg-surface";

  return (
    <QuestionShell
      q={q}
      prompt={prompt}
      hint={hint}
      explanation={explanation}
      canCheck={value.trim() !== ""}
      onCheck={check}
      onReveal={() => {
        setValue(String(answer));
        q.reveal();
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) check();
        }}
        className="flex items-center gap-3 text-2xl"
      >
        {label && (
          <label htmlFor={inputId} className="shrink-0">
            <RichText text={label} />
          </label>
        )}
        <input
          id={inputId}
          aria-label={label ? undefined : prompt ?? "Your answer"}
          value={value}
          disabled={q.done}
          onChange={(e) => {
            setValue(e.target.value);
            q.touch();
          }}
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="?"
          className={`hand w-36 rounded-xl border-[2.5px] border-line px-3 py-1.5 text-2xl font-bold outline-none focus:ring-[3px] focus:ring-blue ${tone}`}
        />
      </form>
    </QuestionShell>
  );
}
