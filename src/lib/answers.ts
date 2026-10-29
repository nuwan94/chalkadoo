import { parse, type MathNode } from "mathjs";

/** Turns what people actually type (−, ×, ÷, commas) into something mathjs can parse. */
export function normalizeInput(raw: string): string {
  return raw
    .trim()
    .replace(/[−–—]/g, "-")
    .replace(/[×·]/g, "*")
    .replace(/÷/g, "/")
    .replace(/(\d),(\d{3})\b/g, "$1$2");
}

function symbolsIn(node: MathNode): string[] {
  const names: string[] = [];
  node.traverse((n, _path, parent) => {
    // A SymbolNode that is the callee of a function call (e.g. `sqrt`) is not a variable.
    if (n.type === "SymbolNode" && !(parent?.type === "FunctionNode" && (parent as unknown as { fn: MathNode }).fn === n)) {
      names.push((n as unknown as { name: string }).name);
    }
  });
  return names;
}

/** Parses a purely numeric answer such as `7`, `-3.5` or `7/2`. Returns null if it is not a number. */
export function parseNumber(raw: string): number | null {
  const input = normalizeInput(raw);
  if (!input || !/^[\d\s.+\-*/()^]+$/.test(input)) return null;
  try {
    const value = parse(input).evaluate();
    return typeof value === "number" && Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

export function numbersEqual(a: number, b: number, tolerance = 1e-9): boolean {
  return Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(b));
}

export type ExpressionCheck =
  | { ok: true; correct: boolean }
  | { ok: false; reason: string };

// Fixed sample points keep checking deterministic (no hydration or flaky results).
const SAMPLES = [1.37, -2.11, 3.53, 0.71, -0.43, 2.9, -4.17, 5.21];

/**
 * Checks whether `input` is algebraically equivalent to `answer` by evaluating both
 * at several sample points. `2(x+3)`, `2x+6` and `6+2*x` all match each other.
 */
export function checkExpression(raw: string, answer: string, variables: string[]): ExpressionCheck {
  const input = normalizeInput(raw);
  if (!input) return { ok: false, reason: "Type an expression first." };
  let given: MathNode;
  try {
    given = parse(input);
  } catch {
    return { ok: false, reason: "I can't read that expression. Check your brackets and symbols." };
  }
  const unknown = symbolsIn(given).filter((s) => !variables.includes(s));
  if (unknown.length) {
    return { ok: false, reason: `Use only ${variables.join(", ")} — I don't know what ${unknown[0]} is.` };
  }
  const expected = parse(answer);
  let compared = 0;
  for (let i = 0; i < SAMPLES.length; i++) {
    const scope = Object.fromEntries(variables.map((v, j) => [v, SAMPLES[(i + j * 3) % SAMPLES.length] + j]));
    let a: unknown, b: unknown;
    try {
      a = given.evaluate(scope);
      b = expected.evaluate(scope);
    } catch {
      continue;
    }
    if (typeof a !== "number" || typeof b !== "number" || !Number.isFinite(a) || !Number.isFinite(b)) continue;
    if (!numbersEqual(a, b, 1e-7)) return { ok: true, correct: false };
    compared++;
  }
  return compared >= 3 ? { ok: true, correct: true } : { ok: false, reason: "That expression can't be evaluated." };
}

/** LaTeX preview of what the learner typed, or null while it is not valid yet. */
export function previewTex(raw: string): string | null {
  const input = normalizeInput(raw);
  if (!input) return null;
  try {
    // mathjs typesets letters that are also unit names (b, g, m…) upright; learners mean variables.
    return parse(input)
      .toTex({ implicit: "hide", parenthesis: "keep" })
      .replace(/\\mathrm\{([a-zA-Z])\}/g, "$1");
  } catch {
    return null;
  }
}
