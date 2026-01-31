import { Rule } from "../evaluate";

function unifiedSurveillance(cystMm: number): string {
  // Use Kyoto-style size-based as a unified baseline
  if (cystMm < 20) return "MRI/MRCP in 18 months after an initial 6-month check (if stable).";
  if (cystMm < 30) return "MRI/MRCP q12 months after two q6-month stability checks.";
  return "MRI/MRCP every 6 months.";
}

export const unifiedRules: Rule[] = [
  {
    id: "UNIFIED_NOT_SURGICAL_CANDIDATE",
    priority: 100,
    when: (i) => !i.surgicalCandidate,
    then: () => ({
      title: "Unified (AI-synthesized)",
      actionNow: "Individualize care; avoid surveillance if it would not change management.",
      rationale: ["Not a surgical candidate."],
      confidenceNote: "AI-synthesized pathway; not an official guideline.",
    }),
  },
  {
    id: "UNIFIED_IMMEDIATE_SURGERY_TRIGGERS",
    priority: 90,
    when: (i, d) =>
      d.hasHRS ||
      i.mpdMm > 10 ||
      i.symptoms.jaundice ||
      ["suspicious", "malignant"].includes(i.cytology),
    then: (_i, d) => ({
      title: "Unified (AI-synthesized)",
      actionNow: "Surgical evaluation recommended.",
      rationale: d.hasHRS ? d.hrsReasons : ["High-risk feature present."],
      escalationTriggers: ["MDT conference", "EUS/pancreas-protocol imaging if needed for staging"],
      confidenceNote: "AI-synthesized pathway; not an official guideline.",
    }),
  },
  {
    id: "UNIFIED_EUS_TRIGGERS",
    priority: 70,
    when: (i, d) => !d.hasHRS && (d.hasWF || d.agaHighRiskFeatureCount >= 2 || i.cystSizeMm >= 30),
    then: (_i, d) => ({
      title: "Unified (AI-synthesized)",
      actionNow: "EUS recommended.",
      rationale: [
        ...d.wfReasons,
        d.agaHighRiskFeatureCount >= 2 ? `AGA: ≥2 high-risk features (count=${d.agaHighRiskFeatureCount})` : "",
      ].filter(Boolean),
      confidenceNote: "AI-synthesized pathway; not an official guideline.",
    }),
  },
  {
    id: "UNIFIED_SURVEILLANCE",
    priority: 10,
    when: () => true,
    then: (i) => ({
      title: "Unified (AI-synthesized)",
      actionNow: "Surveillance recommended.",
      surveillance: unifiedSurveillance(i.cystSizeMm),
      rationale: ["No high-risk triggers met."],
      confidenceNote: "AI-synthesized pathway; not an official guideline.",
    }),
  },
];
