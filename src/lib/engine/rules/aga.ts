import { Rule } from "../evaluate";

export const agaRules: Rule[] = [
  {
    id: "AGA_NOT_SURGICAL_CANDIDATE_STOP",
    priority: 100,
    when: (i) => !i.surgicalCandidate,
    then: () => ({
      title: "AGA 2015",
      actionNow: "Stop surveillance (not a surgical candidate).",
      rationale: ["Not a surgical candidate."],
    }),
  },
  {
    id: "AGA_SURGERY_SOLID_AND_DUCT_OR_CONCERNING",
    priority: 90,
    when: (i) => (i.solidComponent && i.mpdMm >= 5) || ["suspicious", "malignant"].includes(i.cytology),
    then: (i) => ({
      title: "AGA 2015",
      actionNow: "Refer for surgical evaluation.",
      rationale: [
        i.solidComponent && i.mpdMm >= 5 ? "Solid component + duct dilation" : "Concerning cytology",
      ],
    }),
  },
  {
    id: "AGA_EUS_IF_2_HIGH_RISK_FEATURES",
    priority: 70,
    when: (_i, d) => d.agaHighRiskFeatureCount >= 2,
    then: (_i, d) => ({
      title: "AGA 2015",
      actionNow: "EUS-FNA recommended.",
      rationale: [`≥2 high-risk features (count=${d.agaHighRiskFeatureCount}).`],
    }),
  },
  {
    id: "AGA_SURVEIL_LOW_RISK",
    priority: 10,
    when: (i) => i.cystSizeMm < 30 && !i.solidComponent && i.mpdMm < 5,
    then: () => ({
      title: "AGA 2015",
      actionNow: "Surveillance (MRI).",
      surveillance: "MRI in 1 year, then every 2 years for a total of 5 years if stable.",
      rationale: ["Cyst <3 cm, no solid component, no duct dilation."],
    }),
  },
];
