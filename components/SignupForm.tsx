"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function SignupForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          website: formData.get("website"),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to submit the form.");

      setStatus("success");
      setMessage(result.message);
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <form className="signup-card" onSubmit={handleSubmit}>
      <div className="form-heading">
        <span className="eyebrow">Membership signup</span>
        <h2>Stay connected</h2>
        <p>Receive meeting announcements, volunteer opportunities, and specialty-focused updates.</p>
      </div>

      <label>
        Full name
        <input name="name" type="text" autoComplete="name" placeholder="Your full name" maxLength={100} required />
      </label>

      <label>
        Email address
        <input name="email" type="email" autoComplete="email" placeholder="name@uams.edu" maxLength={254} required />
      </label>

      <div className="honeypot" aria-hidden="true">
        <label>Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Joining…" : "Join the interest group"}
      </button>

      <p className="privacy-note">By signing up, you agree to receive messages related to the interest group. You may unsubscribe at any time.</p>

      {message && (
        <div className={`form-message ${status}`} role="status" aria-live="polite">
          {message}
        </div>
      )}
    </form>
  );
}
