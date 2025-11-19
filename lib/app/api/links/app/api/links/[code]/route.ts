import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  const { code } = params;
  const res = await pool.query("SELECT code, url, clicks, last_clicked, created_at FROM links WHERE code = $1", [code]);
  if (!res.rowCount) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(res.rows[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: { code: string } }) {
  const { code } = params;
  const res = await pool.query("DELETE FROM links WHERE code = $1", [code]);
  if (res.rowCount === 0) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
