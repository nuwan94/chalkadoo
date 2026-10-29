"use client";

import { useState } from "react";
import { RichText } from "@/components/math/RichText";
import { QuestionShell } from "./QuestionShell";
import { useQuestion } from "./useQuestion";

export function MultipleChoice({
  prompt,
  options,
  answer,
  hint,
  explanation,
}: {
  prompt?: string;
  /** Option labels; `$...$` renders as maths. */
  options: string[];
  /** Index of the correct option. */
  answer: number;
  hint?: string;
  explanation?: string;
}) {
  const q = useQuestion();
  const [selected, setSelected] = useState<number | null>(null);
  const [ruledOut, setRuledOut] = useState<number[]>([]);
  const reveal = q.status === "revealed";

  function check() {
    if (selected === null) return;
    const correct = selected === answer;
    if (!correct) setRuledOut((r) => [...r, selected]);
    q.submit(correct);
  }

  return (
    <QuestionShell
      q={q}
      prompt={prompt}
      hint={hint}
      explanation={explanation}
      canCheck={selected !== null && !ruledOut.includes(selected)}
      onCheck={check}
      onReveal={() => {
        setSelected(answer);
        q.reveal();
      }}
    >
      <div role="radiogroup" aria-label={prompt ?? "Choose an answer"} className="grid gap-3">
        {options.map((opt, i) => {
          const isSelected = selected === i;
          const isAnswer = (q.status === "correct" || reveal) && i === answer;
          const isOut = ruledOut.includes(i);
          let style = "bg-surface hover:bg-hint";
          if (isAnswer) style = "bg-correct";
          else if (isOut) style = "bg-wrong line-through opacity-70";
          else if (isSelected) style = "bg-hint ring-[3px] ring-blue";
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={q.done || isOut}
              onClick={() => {
                setSelected(i);
                q.touch();
              }}
              className={`flex min-h-12 w-full items-center gap-3 rounded-xl border-[2.5px] border-line px-4 py-3 text-left text-lg transition-colors disabled:cursor-default ${style}`}
            >
              <span className="hand grid size-8 shrink-0 place-items-center rounded-full border-2 border-line font-bold">
                {isAnswer ? "✓" : isOut ? "✗" : String.fromCharCode(65 + i)}
              </span>
              <RichText text={opt} />
            </button>
          );
        })}
      </div>
    </QuestionShell>
  );
}
