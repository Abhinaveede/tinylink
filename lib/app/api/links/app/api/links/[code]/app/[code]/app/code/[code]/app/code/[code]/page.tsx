import React from "react";

async function getData(code: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/links/${code}`, { cache: "no-store" });
  if (!res.ok) throw new Error("not found");
  return res.json();
}

export default async function Page({ params }: { params: { code: string } }) {
  let data: any = null;
  try {
    data = await getData(params.code);
  } catch {
    return (
      <main style={{ padding: 24, fontFamily: "Arial" }}>
        <h2>Not found</h2>
        <p>Code: {params.code}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "Arial" }}>
      <h1>Stats for {data.code}</h1>
      <p><strong>Original URL:</strong> {data.url}</p>
      <p><strong>Clicks:</strong> {data.clicks}</p>
      <p><strong>Last Clicked:</strong> {data.last_clicked ?? "Never"}</p>
      <p><strong>Created:</strong> {new Date(data.created_at).toLocaleString()}</p>
    </main>
  );
}
