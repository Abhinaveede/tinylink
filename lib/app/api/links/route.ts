import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  const res = await pool.query("SELECT code, url, clicks, last_clicked, created_at FROM links ORDER BY created_at DESC");
  return NextResponse.json(res.rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !body.url) {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }
  let { url, code } = body;
  // normalize url
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  if (!code) {
    // generate 6-char code
    code = Math.random().toString(36).slice(2, 8);
  } else {
    code = String(code).trim();
  }

  try {
    const insert = await pool.query(
      "INSERT INTO links(code, url) VALUES($1,$2) RETURNING code, url, clicks, last_clicked, created_at",
      [code, url]
    );
    return NextResponse.json(insert.rows[0], { status: 201 });
  } catch (err: any) {
    // duplicate
    if (err.code === "23505" || (err.message && err.message.includes("duplicate key"))) {
      return NextResponse.json({ error: "code already exists" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
