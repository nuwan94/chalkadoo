# Chalkadoo

Interactive maths lessons for every level. Learn by doing, with Doo, the know-it-all piece of chalk.

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000. The first lesson is at `/learn/algebra/balancing-equations`.

## How it fits together

| Path | What it is |
|---|---|
| `src/content/courses.ts` | Course and lesson catalogue (titles, difficulty, free/premium, available) |
| `src/content/<course>/<lesson>.mdx` | Lesson bodies |
| `src/components/lesson/` | Lesson player, step gating, Doo's feedback |
| `src/components/questions/` | Question types |
| `src/components/widgets/` | Interactive widgets (balance scale) |
| `src/lib/answers.ts` | Answer checking (numbers and algebraic equivalence via mathjs) |
| `src/lib/progress.ts` | Progress and XP, in localStorage until accounts exist |
| `src/app/globals.css` | Visual system: whiteboard (light) and chalkboard (dark) tokens |

## Writing a lesson

1. Add the lesson to `src/content/courses.ts` with `available: true`.
2. Create `src/content/<course>/<lesson>.mdx`. Every top-level element must be a `<Step>`; the player shows one step at a time.
3. Write maths with `$inline$`, or with `$$` on their own lines for display maths.

"Continue" stays locked until every question or widget in the step is solved. Steps with no questions are open straight away.

Components available in MDX without importing:

```mdx
<Step>

## A heading

Some prose with $x + 3 = 7$.

<BalanceScale left={[2, 1]} right={[0, 7]} />   {/* 2x + 1 = 7 */}

<MultipleChoice prompt="…" options={["A", "B"]} answer={1} hint="…" explanation="…" />
<NumericAnswer prompt="Solve $x + 8 = 15$." label="$x =$" answer={7} hint="…" explanation="…" />
<ExpressionAnswer prompt="…" label="$x =$" answer="b - a" variables={["a", "b"]} />
<OrderSteps prompt="…" items={["first", "second", "third"]} />   {/* give items in the correct order */}

<DooSays mood="smug">A joke or a warning from Doo.</DooSays>

</Step>
```

In plain string attributes a backslash is literal (`"$25 \div 5$"`). Inside `{…}` JavaScript strings it must be doubled (`{["$3 \\times 4$"]}`).

XP per question: 10 for the first try, 7 for the second, 5 after that, and 0 if the learner reveals the answer.
