"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import AssetTable from "@/components/AssetTable";
import ErrorBox from "@/components/ErrorBox";

const FILTERS = ["", "AVAILABLE", "ASSIGNED", "MAINTENANCE"];

export default function AssetsPage() {
  const { isAdmin } = useAuth();
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", serialNumber: "", categoryId: "", status: "AVAILABLE" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setAssets(await api(status ? `/api/assets?status=${status}` : "/api/assets"));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    api("/api/categories")
      .then(setCategories)
      .catch(() => {});
  }, []);

  // Runs an API action, shows a success message or the error, then reloads the table
  async function run(action, okMessage) {
    setError(null);
    setMessage("");
    try {
      await action();
      setMessage(okMessage);
      await load();
    } catch (e) {
      setError(e);
    }
  }

  function createAsset(e) {
    e.preventDefault();
    run(async () => {
      await api("/api/assets", {
        method: "POST",
        body: {
          name: form.name,
          serialNumber: form.serialNumber,
          categoryId: form.categoryId ? Number(form.categoryId) : null,
          status: form.status,
        },
      });
      setForm({ ...form, name: "", serialNumber: "" });
    }, "Asset created");
  }

  const onAssign = (id, userId) =>
    run(() => api(`/api/assets/${id}/assign/${userId}`, { method: "PATCH" }), "Asset assigned");
  const onReturn = (id) => run(() => api(`/api/assets/${id}/return`, { method: "PATCH" }), "Asset returned");
  const onDelete = (asset) => {
    if (window.confirm(`Delete "${asset.name}"?`)) {
      run(() => api(`/api/assets/${asset.id}`, { method: "DELETE" }), "Asset deleted");
    }
  };

  return (
    <div>
      <div className="page-head">
        <h1>Assets</h1>
        <label className="inline">
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {FILTERS.map((s) => (
              <option key={s} value={s}>
                {s || "All"}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ErrorBox error={error} />
      {message && <div className="alert success">{message}</div>}

      {isAdmin && (
        <details className="card">
          <summary>Add a new asset</summary>
          <form onSubmit={createAsset} className="grid">
            <label>
              Name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>
              Serial number
              <input
                value={form.serialNumber}
                onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
              />
            </label>
            <label>
              Category
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">Choose...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
              </select>
            </label>
            <button type="submit">Create asset</button>
          </form>
        </details>
      )}

      {loading ? (
        <p className="muted">Loading...</p>
      ) : (
        <AssetTable assets={assets} isAdmin={isAdmin} onAssign={onAssign} onReturn={onReturn} onDelete={onDelete} />
      )}
    </div>
  );
}
