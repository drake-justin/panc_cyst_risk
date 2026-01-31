import { CaseInput } from "@/lib/schema/caseInput";
import { Derived } from "./derive";

export type Recommendation = {
  title: string;
  actionNow: string;
  surveillance?: string;
  escalationTriggers?: string[];
  rationale: string[];
  confidenceNote?: string;
};

export type Rule = {
  id: string;
  priority: number;
  when: (i: CaseInput, d: Derived) => boolean;
  then: (i: CaseInput, d: Derived) => Recommendation;
};

export function evaluateRules(rules: Rule[], i: CaseInput, d: Derived): Recommendation {
  const matched = rules.filter((r) => r.when(i, d)).sort((a, b) => b.priority - a.priority);
  if (matched.length === 0) {
    return {
      title: "No matching rule",
      actionNow: "Insufficient data to recommend. Please complete inputs.",
      rationale: ["No rule conditions met."],
    };
  }
  const top = matched[0];
  const rec = top.then(i, d);
  return { ...rec, rationale: [...rec.rationale, `Rule: ${top.id}`] };
}
