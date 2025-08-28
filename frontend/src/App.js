import React, { useEffect, useState } from 'react';
import GuineaPigForm from './GuineaPigForm';
import './GuineaPigGallery.css';

function App() {
  const [pigs, setPigs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [pigToDelete, setPigToDelete] = useState(null);

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

  // Usuwanie świnki
  const handleDeletePig = async (pigId) => {
    await fetch(`http://localhost:8080/api/pigs/${pigId}`, { method: 'DELETE' });
    fetchPigs();
    setPigToDelete(null);
  };

  // Obsługa edycji (do rozbudowy)
  const handleEditPig = (pigId) => {
    alert("Tryb edycji świnki o id: " + pigId);
    // Możesz tu otwierać formularz edycji
  };

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
            <div className="pig-actions">
              <button
                className="edit-btn"
                title="Edytuj"
                onClick={() => handleEditPig(pig.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 18,
                  marginRight: 8
                }}
              >✏️</button>
              <button
                className="delete-btn"
                title="Usuń"
                onClick={() => setPigToDelete(pig.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 18,
                  color: "#c32c2c"
                }}
              >🗑️</button>
            </div>
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
      {/* Modal potwierdzający usunięcie */}
      {pigToDelete && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>Czy na pewno chcesz usunąć świnkę?</p>
            <div style={{ display: "flex", gap: "12px", marginTop: 10 }}>
              <button onClick={() => handleDeletePig(pigToDelete)} style={{
                background: "#c32c2c",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "8px 18px",
                fontWeight: "bold",
                cursor: "pointer"
              }}>Tak</button>
              <button onClick={() => setPigToDelete(null)} style={{
                background: "#ddd",
                color: "#222",
                border: "none",
                borderRadius: "4px",
                padding: "8px 18px",
                fontWeight: "bold",
                cursor: "pointer"
              }}>Nie</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;