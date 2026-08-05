"use client";

import { useState } from "react";

type Signup = { id: string; name: string; email: string; created_at: string };

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [signups, setSignups] = useState<Signup[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadSignups() {
    setLoading(true); setError("");
    const response = await fetch("/api/admin/signups", { headers: { "x-admin-password": password } });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) { setError(result.error || "Unable to load signups."); return; }
    setSignups(result.signups);
  }

  async function downloadCsv() {
    setError("");
    const response = await fetch("/api/admin/signups?format=csv", { headers: { "x-admin-password": password } });
    if (!response.ok) { setError("Unable to download CSV. Check the password."); return; }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ophthalmology-interest-group-signups.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="admin-shell">
      <section className="admin-card">
        <div className="admin-title"><span className="eyebrow">Private administration</span><h1>Signup list</h1><p>Enter the password configured in your deployment environment.</p></div>
        <div className="admin-controls">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin password" onKeyDown={(e) => e.key === "Enter" && loadSignups()} />
          <button onClick={loadSignups} disabled={loading || !password}>{loading ? "Loading…" : "View signups"}</button>
          <button className="secondary-button" onClick={downloadCsv} disabled={!password}>Export CSV</button>
        </div>
        {error && <div className="form-message error">{error}</div>}
        <div className="table-meta"><b>{signups.length}</b> signup{signups.length === 1 ? "" : "s"}</div>
        <div className="table-wrap">
          <table><thead><tr><th>Name</th><th>Email</th><th>Joined</th></tr></thead>
            <tbody>{signups.map((signup) => <tr key={signup.id}><td>{signup.name}</td><td><a href={`mailto:${signup.email}`}>{signup.email}</a></td><td>{new Date(signup.created_at).toLocaleString()}</td></tr>)}</tbody>
          </table>
          {!signups.length && <p className="empty-state">No records loaded.</p>}
        </div>
      </section>
    </main>
  );
}
