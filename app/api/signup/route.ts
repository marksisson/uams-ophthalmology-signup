import { NextRequest, NextResponse } from "next/server";
import { insertSignup } from "@/lib/supabase";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const attempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = attempts.get(ip);
  if (!current || now > current.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return false;
  }
  current.count += 1;
  return current.count > 8;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const name = String(body.name || "").trim().replace(/\s+/g, " ");
    const email = String(body.email || "").trim().toLowerCase();
    const website = String(body.website || "").trim();

    if (website) return NextResponse.json({ message: "Thanks for joining!" });
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }
    if (!emailPattern.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const { error } = await insertSignup(name, email);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ message: "You’re already on the list — thank you!" });
      }
      console.error(error);
      return NextResponse.json({ error: "We couldn’t save your signup. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ message: "You’re on the list! Watch your inbox for future updates." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
