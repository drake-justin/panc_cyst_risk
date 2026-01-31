"use client";

import { useMemo, useState } from "react";
import { CaseInputSchema, type CaseInput } from "@/lib/schema/caseInput";
import { runAll } from "@/lib/engine";
import { clinicalScore, molecularScore } from "@/lib/engine/scores";

const defaults: CaseInput = CaseInputSchema.parse({});

export default function ToolPage() {
  const [input, setInput] = useState<CaseInput>(defaults);
  const results = useMemo(() => runAll(input), [input]);

  const clin = useMemo(() => clinicalScore(input), [input]);
  const mol = useMemo(() => molecularScore(input), [input]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Pancreatic Cyst Tool</h1>
        <p className="text-sm text-muted-foreground">
          Educational CDS only. Do not enter identifiers.
        </p>
      </header>

      {/* INPUTS */}
      <section className="rounded-xl border p-4 space-y-4">
        <h2 className="font-medium">Inputs</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="text-sm">
            Cyst size (mm)
            <input
              className="mt-1 w-full border rounded px-2 py-1"
              type="number"
              value={input.cystSizeMm}
              onChange={(e) => setInput({ ...input, cystSizeMm: Number(e.target.value) })}
            />
          </label>

          <label className="text-sm">
            MPD diameter (mm)
            <input
              className="mt-1 w-full border rounded px-2 py-1"
              type="number"
              value={input.mpdMm}
              onChange={(e) => setInput({ ...input, mpdMm: Number(e.target.value) })}
            />
          </label>

          <label className="text-sm">
            Growth (mm/year)
            <input
              className="mt-1 w-full border rounded px-2 py-1"
              type="number"
              value={input.growthMmPerYear}
              onChange={(e) => setInput({ ...input, growthMmPerYear: Number(e.target.value) })}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="text-sm">
            Mural nodule
            <select
              className="mt-1 w-full border rounded px-2 py-1"
              value={input.muralNodule}
              onChange={(e) => setInput({ ...input, muralNodule: e.target.value as any })}
            >
              <option value="none">None</option>
              <option value="lt5mm">&lt;5 mm</option>
              <option value="gte5mm">≥5 mm</option>
            </select>
          </label>

          <label className="text-sm">
            Solid component
            <select
              className="mt-1 w-full border rounded px-2 py-1"
              value={input.solidComponent ? "yes" : "no"}
              onChange={(e) => setInput({ ...input, solidComponent: e.target.value === "yes" })}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>

          <label className="text-sm">
            Surgical candidate
            <select
              className="mt-1 w-full border rounded px-2 py-1"
              value={input.surgicalCandidate ? "yes" : "no"}
              onChange={(e) => setInput({ ...input, surgicalCandidate: e.target.value === "yes" })}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            ["Jaundice", "symptoms.jaundice"] as const,
            ["Pancreatitis", "symptoms.pancreatitis"] as const,
            ["New-onset diabetes", "newOnsetDiabetes"] as const,
            ["CA 19-9 elevated", "ca199Elevated"] as const,
          ].map(([label, key]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={
                  key.startsWith("symptoms.")
                    ? (input.symptoms as any)[key.split(".")[1]]
                    : (input as any)[key]
                }
                onChange={(e) => {
                  if (key.startsWith("symptoms.")) {
                    const k = key.split(".")[1];
                    setInput({ ...input, symptoms: { ...input.symptoms, [k]: e.target.checked } });
                  } else {
                    setInput({ ...input, [key]: e.target.checked } as any);
                  }
                }}
              />
              {label}
            </label>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            ["Thick/enhancing wall", "thickWall"] as const,
            ["Lymphadenopathy", "lymphadenopathy"] as const,
            ["Abrupt duct change + atrophy", "abruptDuctChangeWithAtrophy"] as const,
          ].map(([label, key]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={(input as any)[key]}
                onChange={(e) => setInput({ ...input, [key]: e.target.checked } as any)}
              />
              {label}
            </label>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="text-sm">
            Cytology
            <select
              className="mt-1 w-full border rounded px-2 py-1"
              value={input.cytology}
              onChange={(e) => setInput({ ...input, cytology: e.target.value as any })}
            >
              <option value="unknown">Unknown</option>
              <option value="benign">Benign</option>
              <option value="atypical">Atypical</option>
              <option value="suspicious">Suspicious</option>
              <option value="malignant">Malignant</option>
            </select>
          </label>

          <label className="text-sm flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={input.molecularDone}
              onChange={(e) => setInput({ ...input, molecularDone: e.target.checked })}
            />
            Molecular testing available
          </label>
        </div>

        {input.molecularDone && (
          <div className="rounded-lg border p-3 space-y-3">
            <div className="text-sm font-medium">Molecular markers</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              {Object.keys(input.molecular).map((k) => (
                <label key={k} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={(input.molecular as any)[k]}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        molecular: { ...input.molecular, [k]: e.target.checked } as any,
                      })
                    }
                  />
                  {k}
                </label>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* SCORES */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border p-4">
          <h3 className="font-medium">Clinical/Radiographic Risk</h3>
          <div className="text-3xl font-semibold mt-2">{clin.score}/10</div>
          <div className="text-sm text-muted-foreground">{clin.category}</div>
          <details className="mt-3">
            <summary className="text-sm cursor-pointer">Drivers</summary>
            <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
              {clin.drivers.length ? clin.drivers.map((x) => <li key={x}>{x}</li>) : <li>None</li>}
            </ul>
          </details>
        </div>

        <div className="rounded-xl border p-4">
          <h3 className="font-medium">Molecular Risk</h3>
          <div className="text-3xl font-semibold mt-2">{mol.score}/10</div>
          <div className="text-sm text-muted-foreground">{mol.category}</div>
          <details className="mt-3">
            <summary className="text-sm cursor-pointer">Drivers</summary>
            <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
              {mol.drivers.length ? mol.drivers.map((x) => <li key={x}>{x}</li>) : <li>None</li>}
            </ul>
          </details>
        </div>
      </section>

      {/* PATHWAYS */}
      <section className="rounded-xl border p-4 space-y-3">
        <h2 className="font-medium">Guideline Recommendations (5 pathways)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(results.pathways).map(([name, rec]) => (
            <div key={name} className="rounded-xl border p-4 space-y-2">
              <div className="text-sm text-muted-foreground">{name}</div>
              <div className="font-semibold">{rec.actionNow}</div>
              {rec.surveillance && <div className="text-sm">{rec.surveillance}</div>}
              {rec.confidenceNote && <div className="text-xs text-muted-foreground">{rec.confidenceNote}</div>}
              <details className="mt-2">
                <summary className="text-sm cursor-pointer">Why?</summary>
                <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                  {rec.rationale.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
