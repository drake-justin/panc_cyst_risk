import { CaseInput } from "@/lib/schema/caseInput";
import { derive } from "./derive";
import { evaluateRules } from "./evaluate";

import { agaRules } from "./rules/aga";
import { kyotoRules } from "./rules/kyoto";
import { europeanRules } from "./rules/european";
import { acrRules } from "./rules/acr";
import { unifiedRules } from "./rules/unified";

export function runAll(input: CaseInput) {
  const d = derive(input);

  return {
    derived: d,
    pathways: {
      AGA: evaluateRules(agaRules, input, d),
      European: evaluateRules(europeanRules, input, d),
      Kyoto: evaluateRules(kyotoRules, input, d),
      ACR: evaluateRules(acrRules, input, d),
      Unified: evaluateRules(unifiedRules, input, d),
    },
  };
}
