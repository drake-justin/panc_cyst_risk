import { Rule } from "../evaluate";

function acrSurveillance(cystMm: number): string {
  // Simplified ACR-style schedules for MVP
  if (cystMm < 15) return "Follow-up depends on age/risk; consider 1-year MRI/CT.";
  if (cystMm >= 15 && cystMm < 20) return "Yearly for 5 years, then every 2 years for 4 years (if duct communication).";
  if (cystMm >= 20 && cystMm <= 25)
    return "Every 6 months for 2 years, then yearly for 2 years, then every 2 years for 6 years (if duct communication).";
  if (cystMm > 25 && cystMm < 30) return "Consider EUS; short-interval imaging (e.g., 6–12 months) depending on features.";
  return "Consider EUS/MDT; interval depends on features and surgical candidacy.";
}

export const acrRules: Rule[] = [
  {
    id: "ACR_NOT_SURGICAL_CANDIDATE",
    priority: 100,
    when: (i) => !i.surgicalCandidate,
    then: () => ({
      title: "ACR",
      actionNow: "Consider stopping surveillance if not a surgical candidate (individualize).",
      rationale: ["Not a surgical candidate."],
    }),
  },
  {
    id: "ACR_HIGH_RISK_FEATURES",
    priority: 80,
    when: (i) => i.mpdMm >= 10 || i.muralNodule === "gte5mm" || i.solidComponent,
    then: (i) => ({
      title: "ACR",
      actionNow: "Recommend EUS/MDT evaluation (high-risk imaging feature).",
      rationale: [
        i.mpdMm >= 10 ? "MPD ≥10 mm" : "",
        i.muralNodule === "gte5mm" ? "Mural nodule ≥5 mm" : "",
        i.solidComponent ? "Solid component" : "",
      ].filter(Boolean),
    }),
  },
  {
    id: "ACR_SIZE_BASED",
    priority: 10,
    when: () => true,
    then: (i) => ({
      title: "ACR",
      actionNow: "Imaging surveillance recommended (size-based).",
      surveillance: acrSurveillance(i.cystSizeMm),
      rationale: [`Cyst size entered: ${i.cystSizeMm} mm.`],
    }),
  },
];
