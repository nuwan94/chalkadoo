"use client";

import { useState } from "react";
import { RichText } from "@/components/math/RichText";
import { QuestionShell } from "./QuestionShell";
import { useQuestion } from "./useQuestion";

/** Deterministic shuffle (same on server and client) that never returns the solved order. */
function scramble(n: number): number[] {
  const order = Array.from({ length: n }, (_, i) => i);
  let seed = n * 7919 + 17;
  for (let i = n - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const j = seed % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order.every((v, i) => v === i) ? order.reverse() : order;
}

/** Put the items in the right order. `items` is given in the correct order; learners see them shuffled. */
export function OrderSteps({
  prompt,
  items,
  hint,
  explanation,
}: {
  prompt?: string;
  items: string[];
  hint?: string;
  explanation?: string;
}) {
  const q = useQuestion();
  const [order, setOrder] = useState(() => scramble(items.length));
  const [checkedOrder, setCheckedOrder] = useState<number[] | null>(null);

  function move(pos: number, delta: -1 | 1) {
    const target = pos + delta;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[pos], next[target]] = [next[target], next[pos]];
    setOrder(next);
    setCheckedOrder(null);
    q.touch();
  }

  function check() {
    setCheckedOrder(order);
    q.submit(order.every((v, i) => v === i));
  }

  return (
    <QuestionShell
      q={q}
      prompt={prompt}
      hint={hint}
      explanation={explanation}
      canCheck
      onCheck={check}
      onReveal={() => {
        setOrder(items.map((_, i) => i));
        setCheckedOrder(null);
        q.reveal();
      }}
    >
      <ol className="grid gap-2.5">
        {order.map((itemIndex, pos) => {
          const placedRight = checkedOrder?.[pos] === pos && checkedOrder[pos] === itemIndex;
          const solvedTone = q.done ? "bg-correct" : placedRight ? "bg-correct" : "bg-surface";
          return (
            <li
              key={itemIndex}
              className={`flex items-center gap-3 rounded-xl border-[2.5px] border-line px-3 py-2 ${solvedTone}`}
            >
              <span className="hand w-6 shrink-0 text-center text-xl font-bold">{placedRight || q.done ? "✓" : pos + 1}</span>
              <span className="flex-1 text-lg">
                <RichText text={items[itemIndex]} />
              </span>
              {!q.done && (
                <span className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => move(pos, -1)}
                    disabled={pos === 0}
                    aria-label={`Move step ${pos + 1} up`}
                    className="grid size-10 place-items-center rounded-lg border-2 border-line bg-surface-2 text-lg font-bold disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(pos, 1)}
                    disabled={pos === order.length - 1}
                    aria-label={`Move step ${pos + 1} down`}
                    className="grid size-10 place-items-center rounded-lg border-2 border-line bg-surface-2 text-lg font-bold disabled:opacity-30"
                  >
                    ↓
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </QuestionShell>
  );
}
