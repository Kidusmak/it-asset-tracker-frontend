"use client";

import { useState } from "react";

function Row({ asset, isAdmin, onAssign, onReturn, onDelete }) {
  const [userId, setUserId] = useState("");

  return (
    <tr>
      <td>{asset.name}</td>
      <td className="mono">{asset.serialNumber}</td>
      <td>{asset.category ? asset.category.name : "-"}</td>
      <td>
        <span className={`badge ${asset.status.toLowerCase()}`}>{asset.status}</span>
      </td>
      <td>{asset.assignedTo ? asset.assignedTo.username : "-"}</td>
      <td>{new Date(asset.createdAt).toLocaleDateString()}</td>
      {isAdmin && (
        <td className="actions">
          {asset.status === "AVAILABLE" && (
            <span className="inline">
              <input
                className="small"
                type="number"
                min="1"
                placeholder="user id"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <button disabled={!userId} onClick={() => onAssign(asset.id, userId)}>
                Assign
              </button>
            </span>
          )}
          {asset.status === "ASSIGNED" && <button onClick={() => onReturn(asset.id)}>Return</button>}
          <button className="danger" onClick={() => onDelete(asset)}>
            Delete
          </button>
        </td>
      )}
    </tr>
  );
}

export default function AssetTable({ assets, isAdmin, onAssign, onReturn, onDelete }) {
  if (!assets.length) return <p className="muted">No assets found.</p>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Serial number</th>
            <th>Category</th>
            <th>Status</th>
            <th>Assigned to</th>
            <th>Created</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {assets.map((a) => (
            <Row
              key={a.id}
              asset={a}
              isAdmin={isAdmin}
              onAssign={onAssign}
              onReturn={onReturn}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
