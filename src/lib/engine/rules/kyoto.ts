import { Rule } from "../evaluate";

function kyotoSurveillance(cystMm: number): string {
  if (cystMm < 20) return "6 months once, then every 18 months (BD-IPMN size-based schedule).";
  if (cystMm < 30) return "Every 6 months twice, then yearly (BD-IPMN size-based schedule).";
  return "Every 6 months (BD-IPMN size-based schedule).";
}

export const kyotoRules: Rule[] = [
  {
    id: "KYOTO_NOT_SURGICAL_CANDIDATE",
    priority: 100,
    when: (i) => !i.surgicalCandidate,
    then: () => ({
      title: "Kyoto 2024",
      actionNow: "Individualize care; surveillance may be stopped if not a surgical candidate.",
      rationale: ["Not a surgical candidate."],
    }),
  },
  {
    id: "KYOTO_HRS_SURGERY",
    priority: 90,
    when: (_i, d) => d.hasHRS,
    then: (_i, d) => ({
      title: "Kyoto 2024",
      actionNow: "Surgical evaluation recommended (high-risk stigmata present).",
      rationale: d.hrsReasons,
      escalationTriggers: ["Multidisciplinary pancreas conference", "Pancreas-protocol imaging/EUS as needed"],
    }),
  },
  {
    id: "KYOTO_WF_EUS",
    priority: 70,
    when: (_i, d) => !d.hasHRS && d.hasWF,
    then: (_i, d) => ({
      title: "Kyoto 2024",
      actionNow: "EUS recommended (worrisome features present).",
      rationale: d.wfReasons,
      escalationTriggers: ["If EUS shows concerning features → surgical evaluation"],
    }),
  },
  {
    id: "KYOTO_SIZE_BASED_SURVEILLANCE",
    priority: 10,
    when: (_i, d) => !d.hasHRS && !d.hasWF,
    then: (i) => ({
      title: "Kyoto 2024",
      actionNow: "Surveillance recommended.",
      surveillance: kyotoSurveillance(i.cystSizeMm),
      rationale: ["No high-risk stigmata or worrisome features entered."],
    }),
  },
];
