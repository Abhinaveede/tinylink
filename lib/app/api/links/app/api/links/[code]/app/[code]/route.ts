import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  const { code } = params;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const select = await client.query("SELECT url FROM links WHERE code = $1 FOR UPDATE", [code]);
    if (select.rowCount === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    const url = select.rows[0].url;
    await client.query("UPDATE links SET clicks = clicks + 1, last_clicked = now() WHERE code = $1", [code]);
    await client.query("COMMIT");
    return NextResponse.redirect(url);
  } catch (err) {
    await client.query("ROLLBACK").catch(()=>{});
    return NextResponse.json({ error: "server error" }, { status: 500 });
  } finally {
    client.release();
  }
}
