import React, { useEffect, useState } from 'react';
import GuineaPigForm from './GuineaPigForm';
import './GuineaPigGallery.css';

function App() {
  const [pigs, setPigs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPig, setEditingPig] = useState(null);
  const [pigToDelete, setPigToDelete] = useState(null);

  // Fetch guinea pigs
  const fetchPigs = () => {
    fetch('http://localhost:8080/api/pigs')
      .then(response => response.json())
      .then(data => setPigs(data))
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    fetchPigs();
  }, []);

  const handleDeletePig = async (pigId) => {
    await fetch(`http://localhost:8080/api/pigs/${pigId}`, { method: 'DELETE' });
    fetchPigs();
    setPigToDelete(null);
  };

  const handleEditPig = (pig) => {
    setEditingPig(pig);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setEditingPig(null);
    setShowForm(false);
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
                title="Edit"
                onClick={() => handleEditPig(pig)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 18,
                  marginRight: 8,
                  padding: 0
                }}
                aria-label="Edit"
              >
                {/* Dark SVG pencil icon */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M14.7 2.29a1 1 0 0 1 1.41 1.42l-10 10a1 1 0 0 1-.47.26l-3 1a1 1 0 0 1-1.26-1.26l1-3a1 1 0 0 1 .26-.47l10-10z" stroke="#222" strokeWidth="1.5" fill="none"/>
                </svg>
              </button>
              <button
                className="delete-btn"
                title="Delete"
                onClick={() => setPigToDelete(pig.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 18,
                  color: "#222",
                  padding: 0
                }}
                aria-label="Delete"
              >
                {/* Dark SVG trash icon */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="5" y="7" width="10" height="9" rx="2" stroke="#222" strokeWidth="1.5" fill="none"/>
                  <path d="M3 7h14" stroke="#222" strokeWidth="1.5"/>
                  <path d="M8 7V5a2 2 0 0 1 4 0v2" stroke="#222" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => { setShowForm(v => !v); setEditingPig(null); }}
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
        {showForm && !editingPig ? "Hide form" : "Add new"}
      </button>
      <div className={`collapsible${showForm ? " open" : ""}`}>
        {showForm && (
          <GuineaPigForm
            onPigAdded={fetchPigs}
            onPigUpdated={() => { fetchPigs(); handleFormClose(); }}
            initialPig={editingPig}
            onCancel={handleFormClose}
          />
        )}
      </div>
      {/* Modal for delete confirmation */}
      {pigToDelete && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>Are you sure you want to delete this guinea pig?</p>
            <div style={{ display: "flex", gap: "12px", marginTop: 10 }}>
              <button onClick={() => handleDeletePig(pigToDelete)} style={{
                background: "#c32c2c",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "8px 18px",
                fontWeight: "bold",
                cursor: "pointer"
              }}>Yes</button>
              <button onClick={() => setPigToDelete(null)} style={{
                background: "#ddd",
                color: "#222",
                border: "none",
                borderRadius: "4px",
                padding: "8px 18px",
                fontWeight: "bold",
                cursor: "pointer"
              }}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;