const baseHeaders = () => {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
};

function baseUrl() {
  const url = process.env.SUPABASE_URL;
  if (!url) throw new Error("Missing SUPABASE_URL.");
  return `${url.replace(/\/$/, "")}/rest/v1`;
}

export async function insertSignup(name: string, email: string) {
  const response = await fetch(`${baseUrl()}/signups`, {
    method: "POST",
    headers: { ...baseHeaders(), Prefer: "return=minimal" },
    body: JSON.stringify({ name, email }),
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return { error };
  }
  return { error: null };
}

export async function listSignups() {
  const response = await fetch(
    `${baseUrl()}/signups?select=id,name,email,created_at&order=created_at.desc`,
    { headers: baseHeaders(), cache: "no-store" },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return { data: null, error };
  }

  return { data: await response.json(), error: null };
}
