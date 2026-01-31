import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-3xl font-semibold">Pancreatic Cyst Decision Support</h1>

      <div className="rounded-xl border p-4 space-y-2">
        <p className="font-medium">Important disclaimer</p>
        <p className="text-sm text-muted-foreground">
          This site provides educational clinical decision support (CDS) and is not medical advice.
          Do not enter patient identifiers. Always confirm decisions with clinical judgment,
          multidisciplinary review, and local standards of care.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link className="rounded-lg border px-4 py-2" href="/tool">
          Open the Tool
        </Link>
        <Link className="rounded-lg border px-4 py-2" href="/about">
          Methodology
        </Link>
      </div>
    </main>
  );
}
