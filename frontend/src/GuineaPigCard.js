import React from 'react';

const GuineaPigCard = ({ pig, onEdit, onDelete }) => (
  <div className="pig-card">
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
        onClick={() => onEdit(pig)}
        aria-label="Edit"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 18,
          marginRight: 8,
          padding: 0
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M14.7 2.29a1 1 0 0 1 1.41 1.42l-10 10a1 1 0 0 1-.47.26l-3 1a1 1 0 0 1-1.26-1.26l1-3a1 1 0 0 1 .26-.47l10-10z" stroke="#222" strokeWidth="1.5" fill="none"/>
        </svg>
      </button>
      <button
        className="delete-btn"
        title="Delete"
        onClick={() => onDelete(pig.id)}
        aria-label="Delete"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 18,
          color: "#222",
          padding: 0
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="5" y="7" width="10" height="9" rx="2" stroke="#222" strokeWidth="1.5" fill="none"/>
          <path d="M3 7h14" stroke="#222" strokeWidth="1.5"/>
          <path d="M8 7V5a2 2 0 0 1 4 0v2" stroke="#222" strokeWidth="1.5"/>
        </svg>
      </button>
    </div>
  </div>
);

export default GuineaPigCard;