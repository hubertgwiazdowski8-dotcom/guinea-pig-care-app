import React, { useState } from 'react';
import GuineaPigForm from './GuineaPigForm';

export default function GuineaPigPage({ pigs, onPigAdded }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowForm(v => !v)}
        style={{
          marginBottom: "18px",
          background: "#4693cf",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "10px 22px",
          fontSize: "1.1rem",
          fontWeight: "600",
          cursor: "pointer"
        }}
      >
        {showForm ? "Ukryj formularz" : "Add new"}
      </button>
      <div className={`collapsible${showForm ? " open" : ""}`}>
        {showForm && (
          <GuineaPigForm onPigAdded={onPigAdded} />
        )}
      </div>
      <ul style={{marginTop: 36}}>
        {pigs && pigs.map(pig => <li key={pig.id || pig.name}>{pig.name}</li>)}
      </ul>
    </div>
  );
}