"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AssetTable from "@/components/AssetTable";
import ErrorBox from "@/components/ErrorBox";

export default function MyAssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api("/api/assets/my-assets")
      .then(setAssets)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>My assets</h1>
      <ErrorBox error={error} />
      {loading ? <p className="muted">Loading...</p> : <AssetTable assets={assets} isAdmin={false} />}
    </div>
  );
}
