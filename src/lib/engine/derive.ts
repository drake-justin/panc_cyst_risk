import { CaseInput } from "@/lib/schema/caseInput";

export type Derived = {
  hasHRS: boolean;
  hasWF: boolean;
  hrsReasons: string[];
  wfReasons: string[];

  agaHighRiskFeatureCount: number;
};

export function derive(i: CaseInput): Derived {
  const hrsReasons: string[] = [];
  const wfReasons: string[] = [];

  // HRS-like (Kyoto-style)
  if (i.symptoms.jaundice) hrsReasons.push("Obstructive jaundice");
  if (i.muralNodule === "gte5mm") hrsReasons.push("Enhancing mural nodule ≥5 mm");
  if (i.mpdMm >= 10) hrsReasons.push("Main pancreatic duct ≥10 mm");
  if (["suspicious", "malignant"].includes(i.cytology)) hrsReasons.push("Suspicious/malignant cytology");

  // WF-like (Kyoto-style)
  if (i.cystSizeMm >= 30) wfReasons.push("Cyst ≥30 mm");
  if (i.thickWall) wfReasons.push("Thickened/enhancing cyst wall");
  if (i.mpdMm >= 5 && i.mpdMm < 10) wfReasons.push("Main duct 5–9 mm");
  if (i.abruptDuctChangeWithAtrophy) wfReasons.push("Abrupt duct caliber change + distal atrophy");
  if (i.lymphadenopathy) wfReasons.push("Lymphadenopathy");
  if (i.ca199Elevated) wfReasons.push("Elevated CA 19-9");
  if (i.growthMmPerYear >= 2.5) wfReasons.push("Growth ≥2.5 mm/year");
  if (i.newOnsetDiabetes) wfReasons.push("New-onset diabetes");
  if (i.symptoms.pancreatitis) wfReasons.push("Cyst-related pancreatitis");

  // AGA high-risk features: size ≥3cm, duct dilation, solid component
  let aga = 0;
  if (i.cystSizeMm >= 30) aga++;
  if (i.mpdMm >= 5) aga++;
  if (i.solidComponent) aga++;

  return {
    hasHRS: hrsReasons.length > 0,
    hasWF: wfReasons.length > 0,
    hrsReasons,
    wfReasons,
    agaHighRiskFeatureCount: aga,
  };
}
