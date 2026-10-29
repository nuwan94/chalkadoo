"use client";

import { useState } from "react";
import { Doo } from "@/components/brand/Doo";
import { useGate } from "@/components/lesson/context";
import { Tex } from "@/components/math/RichText";

type Side = { x: number; ones: number };
type State = { left: Side; right: Side };

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function sideTex({ x, ones }: Side) {
  const parts: string[] = [];
  if (x > 0) parts.push(x === 1 ? "x" : `${x}x`);
  if (ones > 0) parts.push(String(ones));
  return parts.length ? parts.join(" + ") : "0";
}

/**
 * An equation as a balance scale. Learners tap blocks to take them off a pan; the scale tips
 * if the two sides stop being equal. Solved when x stands alone on one side and the scale balances.
 *
 * Usage in MDX: <BalanceScale left={[2, 1]} right={[0, 7]} />  →  2x + 1 = 7
 */
export function BalanceScale({
  left,
  right,
}: {
  /** [number of x blocks, number of 1 blocks] on the left pan. */
  left: [number, number];
  right: [number, number];
}) {
  const initial: State = { left: { x: left[0], ones: left[1] }, right: { x: right[0], ones: right[1] } };
  // The hidden value of x that makes the starting equation true.
  const X = (initial.right.ones - initial.left.ones) / (initial.left.x - initial.right.x);

  const gate = useGate();
  const [history, setHistory] = useState<State[]>([initial]);
  const state = history[history.length - 1];

  const weight = (s: Side) => s.x * X + s.ones;
  const diff = weight(state.right) - weight(state.left);
  const balanced = Math.abs(diff) < 1e-9;
  const tilt = Math.max(-12, Math.min(12, diff * 3));
  const isolated = (a: Side, b: Side) => a.x === 1 && a.ones === 0 && b.x === 0;
  const solved = balanced && (isolated(state.left, state.right) || isolated(state.right, state.left));
  const divisor = [state.left.x, state.left.ones, state.right.x, state.right.ones].reduce(gcd);

  function push(next: State) {
    setHistory((h) => [...h, next]);
    const done =
      Math.abs(weight(next.right) - weight(next.left)) < 1e-9 &&
      (isolated(next.left, next.right) || isolated(next.right, next.left));
    if (done) gate.solve(10);
  }

  function remove(side: "left" | "right", kind: "x" | "ones") {
    if (solved) return;
    push({ ...state, [side]: { ...state[side], [kind]: state[side][kind] - 1 } });
  }

  function divide() {
    const d = divisor;
    push({
      left: { x: state.left.x / d, ones: state.left.ones / d },
      right: { x: state.right.x / d, ones: state.right.ones / d },
    });
  }

  const equation = `${sideTex(state.left)} ${balanced ? "=" : "\\neq"} ${sideTex(state.right)}`;

  return (
    <div className="not-prose my-6 panel bg-surface-2 p-4 sm:p-6">
      <p className="text-base text-ink-muted">
        Tap a block to lift it off. Keep the scale level and get <Tex tex="x" /> on its own.
      </p>

      <div
        className="relative mx-auto mt-2 h-[250px] w-full max-w-[520px] select-none"
        style={{ containerType: "inline-size", ["--tilt" as string]: `${tilt}deg` }}
      >
        {(["left", "right"] as const).map((side) => {
          const dir = side === "left" ? -1 : 1;
          const s = state[side];
          return (
            <div
              key={side}
              className="absolute bottom-[70px] flex w-[44cqw] flex-col items-center transition-transform duration-500 ease-out"
              style={{
                left: `calc(50% + ${dir * 26}cqw)`,
                transform: `translateX(-50%) translateY(calc(sin(var(--tilt)) * ${dir * 26}cqw))`,
              }}
            >
              <div className="flex w-full flex-wrap-reverse content-start items-end justify-center gap-1 px-1 pb-1">
                {Array.from({ length: s.x }, (_, i) => (
                  <button
                    key={`x${i}`}
                    type="button"
                    disabled={solved}
                    onClick={() => remove(side, "x")}
                    aria-label={`Remove an x block from the ${side} side`}
                    className="hand grid size-11 place-items-center rounded-lg border-[2.5px] border-[#1e1e24] bg-[#5b8cff] text-xl font-bold text-white shadow-[2px_2px_0_#1e1e24] hover:-translate-y-0.5 transition-transform disabled:hover:translate-y-0"
                  >
                    {solved ? X : "x"}
                  </button>
                ))}
                {Array.from({ length: s.ones }, (_, i) => (
                  <button
                    key={`o${i}`}
                    type="button"
                    disabled={solved}
                    onClick={() => remove(side, "ones")}
                    aria-label={`Remove a 1 block from the ${side} side`}
                    className="hand grid size-9 place-items-center rounded-full border-[2.5px] border-[#1e1e24] bg-[#ffd23f] text-base font-bold text-[#1e1e24] shadow-[2px_2px_0_#1e1e24] hover:-translate-y-0.5 transition-transform disabled:hover:translate-y-0"
                  >
                    1
                  </button>
                ))}
              </div>
              {/* the pan */}
              <div className="h-3 w-full rounded-b-full border-[2.5px] border-line bg-surface" />
            </div>
          );
        })}

        {/* beam */}
        <div
          className="absolute bottom-[64px] left-1/2 h-2 w-[56cqw] rounded-full border-2 border-line transition-transform duration-500 ease-out"
          style={{ transform: "translateX(-50%) rotate(var(--tilt))", background: "var(--scale-metal)" }}
          aria-hidden
        />
        {/* fulcrum */}
        <div
          className="absolute bottom-[8px] left-1/2 h-[60px] w-[60px] -translate-x-1/2 bg-line"
          style={{ clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }}
          aria-hidden
        />
      </div>

      <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
        <p className={`text-2xl ${balanced ? "" : "text-red"}`} aria-live="polite">
          <Tex tex={equation} />
        </p>
        <div className="flex flex-wrap gap-2">
          {divisor > 1 && balanced && !solved && (
            <button type="button" className="btn btn-primary !min-h-10 !px-3 text-sm" onClick={divide}>
              ÷ Split both sides into {divisor} groups
            </button>
          )}
          <button
            type="button"
            className="btn btn-ghost !min-h-10 !px-3 text-sm"
            disabled={history.length === 1 || solved}
            onClick={() => setHistory((h) => h.slice(0, -1))}
          >
            Undo
          </button>
          <button
            type="button"
            className="btn btn-ghost !min-h-10 !px-3 text-sm"
            disabled={history.length === 1 || solved}
            onClick={() => setHistory([initial])}
          >
            Reset
          </button>
        </div>
      </div>

      {(!balanced || solved) && (
        <div className="mt-4 flex items-end gap-2 anim-pop" role="status">
          <Doo mood={solved ? "happy" : "worried"} size={52} className={`shrink-0 ${solved ? "anim-bounce" : ""}`} />
          <div className={`panel flex-1 px-4 py-3 ${solved ? "bg-correct" : "bg-wrong"}`}>
            {solved ? (
              <p className="hand text-xl font-bold">
                Chalk-a-doo! <Tex tex={`x = ${X}`} />, and the scale is still level.
              </p>
            ) : (
              <p className="hand text-xl font-bold">
                Whoa, it&apos;s tipping! You changed one side only. Do the same to the other side.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
