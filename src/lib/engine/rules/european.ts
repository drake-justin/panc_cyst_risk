import { Rule } from "../evaluate";

export const europeanRules: Rule[] = [
  {
    id: "EURO_NOT_SURGICAL_CANDIDATE",
    priority: 100,
    when: (i) => !i.surgicalCandidate,
    then: () => ({
      title: "European 2018",
      actionNow: "Individualize care; consider stopping surveillance if not a surgical candidate.",
      rationale: ["Not a surgical candidate."],
    }),
  },
  {
    id: "EURO_ABSOLUTE_SURGERY",
    priority: 90,
    when: (i) => i.symptoms.jaundice || i.muralNodule === "gte5mm" || i.mpdMm > 10,
    then: (i) => ({
      title: "European 2018",
      actionNow: "Surgical evaluation recommended (absolute indication).",
      rationale: [
        i.symptoms.jaundice ? "Jaundice" : "",
        i.muralNodule === "gte5mm" ? "Enhancing mural nodule >5 mm" : "",
        i.mpdMm > 10 ? "MPD >10 mm" : "",
      ].filter(Boolean),
    }),
  },
  {
    id: "EURO_RELATIVE_INDICATIONS_EUS_OR_6MO",
    priority: 70,
    when: (i) =>
      (i.mpdMm >= 5 && i.mpdMm <= 9.9) ||
      i.cystSizeMm >= 40 ||
      i.growthMmPerYear >= 5 ||
      i.ca199Elevated ||
      i.newOnsetDiabetes ||
      i.symptoms.pancreatitis ||
      i.muralNodule === "lt5mm",
    then: (i) => ({
      title: "European 2018",
      actionNow: "Consider EUS/MDT review; closer follow-up.",
      surveillance: "6-month follow-up (if no immediate surgery).",
      rationale: [
        i.mpdMm >= 5 && i.mpdMm <= 9.9 ? "MPD 5–9.9 mm" : "",
        i.cystSizeMm >= 40 ? "Cyst ≥40 mm" : "",
        i.growthMmPerYear >= 5 ? "Growth ≥5 mm/year" : "",
        i.ca199Elevated ? "CA 19-9 elevated" : "",
        i.newOnsetDiabetes ? "New-onset diabetes" : "",
        i.symptoms.pancreatitis ? "Pancreatitis" : "",
        i.muralNodule === "lt5mm" ? "Mural nodule <5 mm" : "",
      ].filter(Boolean),
    }),
  },
  {
    id: "EURO_SURVEILLANCE_DEFAULT",
    priority: 10,
    when: () => true,
    then: () => ({
      title: "European 2018",
      actionNow: "Surveillance recommended.",
      surveillance: "6-month follow-up in the first year, then yearly if stable and no risk factors.",
      rationale: ["No absolute/relative surgical indications entered."],
    }),
  },
];
