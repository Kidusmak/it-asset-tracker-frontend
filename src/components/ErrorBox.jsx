export default function ErrorBox({ error }) {
  if (!error) return null;
  const fields = error.errors ? Object.values(error.errors) : [];
  return (
    <div className="alert error">
      {fields.length > 0 ? (
        <>
          <strong>Please fix the following:</strong>
          <ul>
            {fields.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </>
      ) : (
        <strong>{error.message}</strong>
      )}
    </div>
  );
}
