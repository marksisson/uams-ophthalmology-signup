import { NextRequest, NextResponse } from "next/server";
import { listSignups } from "@/lib/supabase";

function authorized(request: NextRequest) {
  const supplied = request.headers.get("x-admin-password") || "";
  const expected = process.env.ADMIN_PASSWORD || "";
  return expected.length >= 12 && supplied === expected;
}

function csvEscape(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await listSignups();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to retrieve signups." }, { status: 500 });
  }

  const format = request.nextUrl.searchParams.get("format");
  if (format === "csv") {
    const rows = ["Name,Email,Signup date", ...(data || []).map((item) =>
      [csvEscape(item.name), csvEscape(item.email), csvEscape(item.created_at)].join(",")
    )];
    return new NextResponse(rows.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="ophthalmology-interest-group-signups.csv"`,
      },
    });
  }

  return NextResponse.json({ signups: data || [] });
}
