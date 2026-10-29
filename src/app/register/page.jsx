"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";
import ErrorBox from "@/components/ErrorBox";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [created, setCreated] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setCreated(null);
    setBusy(true);
    try {
      const user = await api("/api/auth/register", {
        method: "POST",
        body: { username: username.trim(), password },
      });
      setCreated(user);
      setUsername("");
      setPassword("");
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card narrow">
      <h1>Register</h1>
      <ErrorBox error={error} />
      {created && (
        <div className="alert success">
          Account <strong>{created.username}</strong> created (user id <strong>{created.id}</strong>,{" "}
          {created.role}). You can now <Link href="/login">log in</Link>.
        </div>
      )}
      <form onSubmit={onSubmit}>
        <label>
          Username (3-50 characters)
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Password (at least 6 characters)
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" disabled={busy}>
          {busy ? "Creating..." : "Create account"}
        </button>
      </form>
      <p className="muted">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </div>
  );
}
