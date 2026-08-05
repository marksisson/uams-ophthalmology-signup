"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

type SubmittedSignup = {
  name: string;
  email: string;
};

export default function SignupForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [submittedSignup, setSubmittedSignup] = useState<SubmittedSignup | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          website: formData.get("website"),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to submit the form.");

      setSubmittedSignup({ name, email });
      setStatus("success");
      setMessage(result.message || "Your signup was received.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  function resetForm() {
    setSubmittedSignup(null);
    setStatus("idle");
    setMessage("");
  }

  if (status === "success" && submittedSignup) {
    return (
      <section className="signup-card signup-confirmation" aria-labelledby="signup-confirmation-title">
        <div className="confirmation-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <span className="eyebrow">Signup complete</span>
        <h2 id="signup-confirmation-title">You’re on the list.</h2>
        <p className="confirmation-lead">
          Thank you, <strong>{submittedSignup.name}</strong>. Your membership request for the UAMS Ophthalmology Interest Group has been recorded.
        </p>

        <div className="confirmation-details">
          <span>Confirmation email</span>
          <strong>{submittedSignup.email}</strong>
        </div>

        <p className="confirmation-note">
          We’ll use this address for meeting announcements, volunteer opportunities, and group updates.
        </p>

        <button className="secondary-action" type="button" onClick={resetForm}>
          Sign up another person
        </button>

        <div className="sr-only" role="status" aria-live="polite">
          {message}
        </div>
      </section>
    );
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

      {message && status === "error" && (
        <div className="form-message error" role="alert">
          {message}
        </div>
      )}
    </form>
  );
}
