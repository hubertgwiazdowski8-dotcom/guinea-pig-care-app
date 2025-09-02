import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import AuthForm from './AuthForm';
import GuineaPigList from './GuineaPigList';
import GuineaPigForm from './GuineaPigForm';
import Modal from './Modal';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [pigs, setPigs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPig, setEditingPig] = useState(null);
  const [pigToDelete, setPigToDelete] = useState(null);

  // Obsługa logowania/wylogowania
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => setUser(u));
    return () => unsubscribe();
  }, []);

  // Pobieraj świnki tylko gdy user jest zalogowany
  useEffect(() => {
    if (user) {
      fetchPigs();
    } else {
      setPigs([]);
    }
    // eslint-disable-next-line
  }, [user]);

  // Funkcja pobierająca świnki z tokenem
  const fetchPigs = async () => {
    if (!auth.currentUser) return;
    const token = await auth.currentUser.getIdToken();
    fetch('http://localhost:8080/api/pigs', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPigs(data);
        } else {
          setPigs([]);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setPigs([]);
      });
  };

  // Usuwanie świnki z tokenem
  const handleDeletePig = async (pigId) => {
    const token = await auth.currentUser.getIdToken();
    await fetch(`http://localhost:8080/api/pigs/${pigId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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

  if (!user) {
    return (
      <div className='App'>
        <h1 className='h1'>Guinea Pig App</h1>
        <AuthForm />
      </div>
    );
  }

  return (
    <div className='App'>
      <button
        onClick={() => auth.signOut()}
        style={{
          float: 'right',
          margin: 16,
          padding: "8px 16px",
          background: "#eee",
          border: "1px solid #bbb",
          borderRadius: 4,
          cursor: "pointer"
        }}
      >
        Wyloguj
      </button>
      <h1 className='h1'>List of your pigs</h1>
      
      <GuineaPigList
        pigs={pigs}
        onEdit={handleEditPig}
        onDelete={setPigToDelete}
      />

      <div className='form-button'>
        <button
          type="button"
          className='add-button'
          onClick={() => { setShowForm(v => !v); setEditingPig(null); }}
        >
          {showForm && !editingPig ? "Hide form" : "Add new"}
        </button>
      </div>
      
      <div className={`collapsible${showForm ? " open" : ""}`}>
        {showForm && (
          <GuineaPigForm
            onPigAdded={fetchPigs}
            onPigUpdated={() => { fetchPigs(); handleFormClose(); }}
            initialPig={editingPig}
            onCancel={handleFormClose}
            // PRZEKAŻ USER (jeśli potrzebujesz w GuineaPigForm do requesta)
            user={user}
          />
        )}
      </div>

      <Modal
        show={!!pigToDelete}
        onConfirm={() => handleDeletePig(pigToDelete)}
        onCancel={() => setPigToDelete(null)}
        message="Are you sure you want to delete this guinea pig?"
      />
    </div>
  );
}

export default App;