import { z } from "zod";

export const CaseInputSchema = z.object({
  // Patient
  age: z.number().min(18).max(120).optional(),
  surgicalCandidate: z.boolean().default(true),

  symptoms: z
    .object({
      jaundice: z.boolean().default(false),
      pancreatitis: z.boolean().default(false),
      pain: z.boolean().default(false),
      weightLoss: z.boolean().default(false),
    })
    .default({ jaundice: false, pancreatitis: false, pain: false, weightLoss: false }),

  newOnsetDiabetes: z.boolean().default(false),
  ca199Elevated: z.boolean().default(false),

  // Imaging
  suspectedType: z
    .enum(["BD-IPMN", "MD-IPMN", "Mixed-IPMN", "MCN", "SCN", "Indeterminate"])
    .default("Indeterminate"),

  cystSizeMm: z.number().min(0).max(200).default(0),
  growthMmPerYear: z.number().min(0).max(100).default(0),
  mpdMm: z.number().min(0).max(30).default(0),

  muralNodule: z.enum(["none", "lt5mm", "gte5mm"]).default("none"),
  solidComponent: z.boolean().default(false),
  thickWall: z.boolean().default(false),
  lymphadenopathy: z.boolean().default(false),
  abruptDuctChangeWithAtrophy: z.boolean().default(false),

  // EUS/FNA
  eusDone: z.boolean().default(false),
  cytology: z.enum(["unknown", "benign", "atypical", "suspicious", "malignant"]).default("unknown"),

  // Molecular
  molecularDone: z.boolean().default(false),
  molecular: z
    .object({
      KRAS: z.boolean().default(false),
      GNAS: z.boolean().default(false),
      BRAF: z.boolean().default(false),

      TP53: z.boolean().default(false),
      SMAD4: z.boolean().default(false),
      CTNNB1: z.boolean().default(false),
      MTOR_PATHWAY: z.boolean().default(false),

      VHL: z.boolean().default(false),
      MEN1: z.boolean().default(false),
    })
    .default({
      KRAS: false,
      GNAS: false,
      BRAF: false,
      TP53: false,
      SMAD4: false,
      CTNNB1: false,
      MTOR_PATHWAY: false,
      VHL: false,
      MEN1: false,
    }),
});

export type CaseInput = z.infer<typeof CaseInputSchema>;
