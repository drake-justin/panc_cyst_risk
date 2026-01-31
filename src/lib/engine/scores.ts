import { CaseInput } from "@/lib/schema/caseInput";

export type ScoreResult = {
  score: number;
  drivers: string[];
  category: "Low" | "Intermediate" | "High";
};

export function clinicalScore(i: CaseInput): ScoreResult {
  let points = 0;
  const drivers: string[] = [];

  // High-risk-ish (+4)
  if (i.symptoms.jaundice) { points += 4; drivers.push("Jaundice"); }
  if (i.muralNodule === "gte5mm") { points += 4; drivers.push("Mural nodule ≥5mm"); }
  if (i.mpdMm >= 10) { points += 4; drivers.push("MPD ≥10mm"); }
  if (["suspicious", "malignant"].includes(i.cytology)) { points += 4; drivers.push("Concerning cytology"); }

  // Worrisome-ish (+2)
  if (i.mpdMm >= 5 && i.mpdMm < 10) { points += 2; drivers.push("MPD 5–9mm"); }
  if (i.cystSizeMm >= 30) { points += 2; drivers.push("Cyst ≥30mm"); }
  if (i.growthMmPerYear >= 2.5) { points += 2; drivers.push("Growth ≥2.5mm/yr"); }
  if (i.ca199Elevated) { points += 2; drivers.push("CA 19-9 elevated"); }
  if (i.newOnsetDiabetes) { points += 2; drivers.push("New-onset diabetes"); }
  if (i.symptoms.pancreatitis) { points += 2; drivers.push("Pancreatitis"); }
  if (i.thickWall) { points += 2; drivers.push("Thick/enhancing wall"); }
  if (i.lymphadenopathy) { points += 2; drivers.push("Lymphadenopathy"); }
  if (i.abruptDuctChangeWithAtrophy) { points += 2; drivers.push("Abrupt duct change + atrophy"); }

  // Compress to 0–10
  const score = Math.max(0, Math.min(10, Math.round(points / 2)));
  const category = score <= 2 ? "Low" : score <= 5 ? "Intermediate" : "High";
  return { score, drivers, category };
}

export function molecularScore(i: CaseInput): ScoreResult {
  if (!i.molecularDone) return { score: 0, drivers: ["No molecular testing entered"], category: "Low" };

  const m = i.molecular;
  const drivers: string[] = [];

  const mucinous = m.KRAS || m.GNAS || m.BRAF;
  const advancedCount = [m.TP53, m.SMAD4, m.CTNNB1, m.MTOR_PATHWAY].filter(Boolean).length;

  if (m.VHL && !mucinous && advancedCount === 0) {
    return { score: 1, drivers: ["VHL-only pattern (suggests serous cystadenoma)"], category: "Low" };
  }

  let score = 0;
  if (mucinous && advancedCount === 0) {
    score = 2;
    drivers.push("Mucinous signature (KRAS/GNAS/BRAF) without advanced markers");
  } else if (advancedCount === 1) {
    score = 6;
    drivers.push("One advanced-neoplasia marker (TP53/SMAD4/CTNNB1/mTOR-pathway)");
  } else if (advancedCount >= 2) {
    score = 9;
    drivers.push(`Multiple advanced markers (n=${advancedCount})`);
  } else {
    score = 0;
    drivers.push("No mucinous or advanced markers entered");
  }

  const category = score <= 2 ? "Low" : score <= 6 ? "Intermediate" : "High";
  return { score, drivers, category };
}
