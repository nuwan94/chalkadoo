import type { MDXComponents } from "mdx/types";
import { DooSays, Step } from "@/components/lesson/Step";
import { ExpressionAnswer } from "@/components/questions/ExpressionAnswer";
import { MultipleChoice } from "@/components/questions/MultipleChoice";
import { NumericAnswer } from "@/components/questions/NumericAnswer";
import { OrderSteps } from "@/components/questions/OrderSteps";
import { BalanceScale } from "@/components/widgets/BalanceScale";

/** Everything a lesson author can use in MDX without importing it. */
const components: MDXComponents = {
  Step,
  DooSays,
  MultipleChoice,
  NumericAnswer,
  ExpressionAnswer,
  OrderSteps,
  BalanceScale,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
