export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Methodology</h1>

      <section className="space-y-2 text-sm text-muted-foreground">
        <p>
          This tool displays recommendations from four published guideline pathways and an additional “Unified” pathway.
          The Unified pathway is an AI-synthesized best-practice interpretation that combines concepts across guidelines.
          It is not an official society guideline and may differ from any single source.
        </p>
        <p>The site is designed to be stateless. Do not enter patient identifiers.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Risk scores</h2>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
          <li>
            <b>Clinical/Radiographic score</b>: heuristic index based on high-risk and worrisome features used across
            guidelines. Not a validated prognostic model.
          </li>
          <li>
            <b>Molecular score</b>: heuristic index based on mucinous signatures (e.g., KRAS/GNAS) and advanced neoplasia
            markers (e.g., TP53/SMAD4 pathway). Vendor-agnostic (genes in → score out).
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Public-facing limitations</h2>
        <p className="text-sm text-muted-foreground">
          Recommendations can be sensitive to cyst type, imaging quality, patient factors, and institutional expertise.
          Use multidisciplinary review when high-risk features are present.
        </p>
      </section>
    </main>
  );
}
