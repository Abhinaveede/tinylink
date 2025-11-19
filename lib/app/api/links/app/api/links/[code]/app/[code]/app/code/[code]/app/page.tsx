"use client";
import React, { useEffect, useState } from "react";

type LinkItem = { code: string; url: string; clicks: number; last_clicked: string | null };

export default function Home() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  const base = process.env.NEXT_PUBLIC_BASE_URL || "";

  async function load() {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
  }
  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, code: code || undefined })
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "error");
      return;
    }
    setUrl("");
    setCode("");
    setMsg("Created: " + data.code);
    load();
  }

  async function remove(c: string) {
    if (!confirm(`Delete ${c}?`)) return;
    const res = await fetch(`/api/links/${c}`, { method: "DELETE" });
    if (res.ok) load();
  }

  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>TinyLink</h1>
      <form onSubmit={create} style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 8 }}>
          <input placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} style={{ width: 420, padding: 8 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input placeholder="custom code (optional)" value={code} onChange={(e) => setCode(e.target.value)} style={{ width: 200, padding: 8 }} />
          <button style={{ marginLeft: 8, padding: "8px 12px" }} type="submit">Create</button>
        </div>
        {msg && <div style={{ marginTop: 8 }}>{msg}</div>}
      </form>

      <h2>Links</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 6 }}>Code</th>
            <th style={{ textAlign: "left", padding: 6 }}>Short URL</th>
            <th style={{ textAlign: "left", padding: 6 }}>Clicks</th>
            <th style={{ textAlign: "left", padding: 6 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((l) => (
            <tr key={l.code}>
              <td style={{ padding: 6 }}>{l.code}</td>
              <td style={{ padding: 6 }}>
                <a href={`${base}/${l.code}`} target="_blank" rel="noreferrer">{`${base}/${l.code}`}</a>
              </td>
              <td style={{ padding: 6 }}>{l.clicks}</td>
              <td style={{ padding: 6 }}>
                <a style={{ marginRight: 8 }} href={`/code/${l.code}`}>Stats</a>
                <button onClick={() => remove(l.code)} style={{ padding: "4px 8px" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 20 }}>
        <a href="/healthz">Health</a>
      </div>
    </main>
  );
}
