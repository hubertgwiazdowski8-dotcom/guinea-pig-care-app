import React, { useEffect, useState } from 'react';
import GuineaPigForm from './GuineaPigForm';
import './GuineaPigGallery.css';

function App() {
  const [pigs, setPigs] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Pobieranie świnek
  const fetchPigs = () => {
    fetch('http://localhost:8080/api/pigs')
      .then(response => response.json())
      .then(data => setPigs(data))
      .catch(error => console.error('Błąd:', error));
  };

  useEffect(() => {
    fetchPigs();
  }, []);

  return (
    <div className='App'>
      <div className="pigs-gallery">
  {pigs.map(pig => (
    <div className="pig-card" key={pig.id}>
      <div className="pig-photo-wrap">
        <img
          className="pig-photo"
          src={pig.photo_url
            ? `http://localhost:8080${pig.photo_url}`
            : "http://localhost:8080/static/photos/default-guinea-pig.png"}
          alt={pig.name}
        />
      </div>
      <div className="pig-name">{pig.name}</div>
    </div>
  ))}
</div>
      <button
        type="button"
        onClick={() => setShowForm(v => !v)}
        style={{
          margin: "24px 0 18px 0",
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
        {showForm && <GuineaPigForm onPigAdded={fetchPigs} />}
      </div>
    </div>
  );
}

export default App;