"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">Simple ToolBox</h1>
      <section className="mt-8">
        <Link href={"/convert-image"}>
          <h1 className="text-lg font-bold text-blue-500 underline">
            Simplest Convert Image
          </h1>
          <h3>
            Easily convert images online in the simplest way. Supports
            conversion to JPEG, PNG, and WEBP formats.
          </h3>
        </Link>
      </section>
    </main>
  );
}
