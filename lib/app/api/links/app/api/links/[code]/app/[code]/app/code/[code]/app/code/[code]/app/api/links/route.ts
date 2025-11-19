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

  if (!/^https?:\/\//i.test(url)) url = "https://" + url;

  if (!code) code = Math.random().toString(36).slice(2, 8);

  try {
    const res = await pool.query(
      "INSERT INTO links(code, url) VALUES($1, $2) RETURNING code, url, clicks, last_clicked, created_at",
      [code, url]
    );
    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (err: any) {
    if (err.code === "23505") {
      return NextResponse.json({ error: "code already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
