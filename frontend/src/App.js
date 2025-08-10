import React, { useEffect, useState } from "react";

function PigList({ pigs, onSelect }) {
  return (
    <div>
      <h2>Twoje świnki morskie</h2>
      <ul>
        {pigs.map((pig) => (
          <li key={pig.id} onClick={() => onSelect(pig)}>
            <b>{pig.name}</b> {pig.birthdate && `(${pig.birthdate})`}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PigForm({ onAdd }) {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [photo_url, setPhotoUrl] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/pigs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, birthdate, photo_url, notes }),
    });
    setName(""); setBirthdate(""); setPhotoUrl(""); setNotes("");
    onAdd();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Dodaj świnkę</h3>
      <input placeholder="Imię" value={name} onChange={e => setName(e.target.value)} required />
      <input type="date" placeholder="Data urodzenia" value={birthdate} onChange={e => setBirthdate(e.target.value)} />
      <input placeholder="URL zdjęcia" value={photo_url} onChange={e => setPhotoUrl(e.target.value)} />
      <input placeholder="Notatki" value={notes} onChange={e => setNotes(e.target.value)} />
      <button type="submit">Dodaj</button>
    </form>
  );
}

function PigDetails({ pig, onBack }) {
  const [logs, setLogs] = useState([]);
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetch(`/api/pigs/${pig.id}/logs`)
      .then(res => res.json())
      .then(setLogs);
  }, [pig]);

  const handleAddLog = async (e) => {
    e.preventDefault();
    await fetch(`/api/pigs/${pig.id}/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, weight: parseFloat(weight), notes }),
    });
    setDate(""); setWeight(""); setNotes("");
    fetch(`/api/pigs/${pig.id}/logs`).then(res => res.json()).then(setLogs);
  };

  return (
    <div>
      <button onClick={onBack}>← Powrót</button>
      <h2>{pig.name}</h2>
      {pig.photo_url && <img src={pig.photo_url} alt={pig.name} style={{maxWidth: 200}} />}
      <p>Data urodzenia: {pig.birthdate || "?"}</p>
      <p>Notatki: {pig.notes}</p>
      <h3>Logi opieki</h3>
      <ul>
        {logs.map(log => (
          <li key={log.id}>
            <b>{log.date}</b> – Waga: {log.weight ?? "?"}g, Notatki: {log.notes}
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddLog}>
        <h4>Dodaj log opieki</h4>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <input type="number" placeholder="Waga (g)" value={weight} onChange={e => setWeight(e.target.value)} />
        <input placeholder="Notatki" value={notes} onChange={e => setNotes(e.target.value)} />
        <button type="submit">Dodaj log</button>
      </form>
    </div>
  );
}

export default function App() {
  const [pigs, setPigs] = useState([]);
  const [selected, setSelected] = useState(null);

  const refresh = () => {
    fetch("/api/pigs").then(res => res.json()).then(setPigs);
  };

  useEffect(refresh, []);

  if (selected) {
    return <PigDetails pig={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div style={{maxWidth: 500, margin: "auto", fontFamily: "sans-serif"}}>
      <h1>Guinea Pig Care</h1>
      <PigForm onAdd={refresh} />
      <PigList pigs={pigs} onSelect={setSelected} />
    </div>
  );
}