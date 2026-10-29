"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import ErrorBox from "@/components/ErrorBox";

export default function CategoriesPage() {
  const { isAdmin } = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      setCategories(await api("/api/categories"));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createCategory(e) {
    e.preventDefault();
    setError(null);
    setMessage("");
    try {
      await api("/api/categories", { method: "POST", body: { name } });
      setName("");
      setMessage("Category created");
      await load();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div>
      <h1>Categories</h1>
      <ErrorBox error={error} />
      {message && <div className="alert success">{message}</div>}

      {isAdmin && (
        <form onSubmit={createCategory} className="card inline-form">
          <label>
            New category
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Monitor" />
          </label>
          <button type="submit">Add</button>
        </form>
      )}

      {loading ? (
        <p className="muted">Loading...</p>
      ) : categories.length === 0 ? (
        <p className="muted">No categories yet.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
