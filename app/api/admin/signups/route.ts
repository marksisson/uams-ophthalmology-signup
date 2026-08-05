import { NextRequest, NextResponse } from "next/server";
import { listSignups } from "@/lib/supabase";

type Signup = {
  name: string;
  email: string;
  created_at: string;
};

function authorized(request: NextRequest): boolean {
  const supplied = request.headers.get("x-admin-password") ?? "";
  const expected = process.env.ADMIN_PASSWORD ?? "";

  return expected.length >= 12 && supplied === expected;
}

function csvEscape(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { data, error } = await listSignups();

  if (error) {
    console.error("Unable to retrieve signups:", error);

    return NextResponse.json(
      { error: "Unable to retrieve signups." },
      { status: 500 },
    );
  }

  const signups: Signup[] = (data ?? []) as Signup[];
  const format = request.nextUrl.searchParams.get("format");

  if (format === "csv") {
    const rows = [
      "Name,Email,Signup date",
      ...signups.map((item) =>
        [
          csvEscape(item.name),
          csvEscape(item.email),
          csvEscape(item.created_at),
        ].join(","),
      ),
    ];

    return new NextResponse(rows.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="ophthalmology-interest-group-signups.csv"',
      },
    });
  }

  return NextResponse.json({ signups });
}
