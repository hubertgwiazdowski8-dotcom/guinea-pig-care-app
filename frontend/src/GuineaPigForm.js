import React, { useState, useCallback, useRef, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './getCroppedImg';
import './GuineaPigForm.css';

export default function GuineaPigForm({ onPigAdded }) {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photo_url, setPhotoURL] = useState(null);

  // Cropper state
  const [selectedImg, setSelectedImg] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropping, setCropping] = useState(false);

  // Ref for keyboard focus in cropper
  const cropperContainerRef = useRef(null);
  const fileInputRef = useRef();

  useEffect(() => {
    if (cropping && cropperContainerRef.current) {
      cropperContainerRef.current.focus();
    }
  }, [cropping]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImg(URL.createObjectURL(e.target.files[0]));
      setCropping(true);
    }
  };

  const handleCropFinish = async () => {
    const croppedBlob = await getCroppedImg(selectedImg, croppedAreaPixels);
    const file = new File([croppedBlob], "cropped.jpg", { type: croppedBlob.type });
    if (photo_url) URL.revokeObjectURL(photo_url);
    const url = URL.createObjectURL(file);
    setPhoto(file);
    setPhotoURL(url);
    setCropping(false);
    URL.revokeObjectURL(selectedImg);
    setSelectedImg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropCancel = () => {
    setCropping(false);
    if (selectedImg) URL.revokeObjectURL(selectedImg);
    setSelectedImg(null);
  };

  const handlePhotoDelete = () => {
    if (photo_url) URL.revokeObjectURL(photo_url);
    setPhoto(null);
    setPhotoURL(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('birthdate', birthdate);
    formData.append('notes', notes);
    if (photo) {
      formData.append('photo', photo);
    }

    const response = await fetch('http://127.0.0.1:8080/api/pigs', {
      method: 'POST',
      body: formData,
    });
    if (response.ok) {
      setName('');
      setBirthdate('');
      setNotes('');
      setPhoto(null);
      setPhotoURL(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (onPigAdded) onPigAdded();
    } else {
      alert('Coś poszło nie tak!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className='title-row'>
        <h1>List of pigs</h1>
      </div>
      <div className="form-row">
        <label>Name:</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div className="form-row">
        <label>Birthdate:</label>
        <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} />
      </div>
      <div className="form-row">
        <label>Description:</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} />
      </div>
      <div className="form-row">
        <label>Photo:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
        {photo && photo_url && (
          <div style={{ position: "relative", display: "inline-block", marginTop: 10 }}>
            <img
              src={photo_url}
              alt="przycięte"
              style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, border: '1px solid #ccc' }}
            />
            <button
              type="button"
              onClick={handlePhotoDelete}
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                background: "#ee5555",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: 26,
                height: 26,
                fontWeight: "bold",
                fontSize: 18,
                cursor: "pointer",
                boxShadow: "0 1px 4px #0002"
              }}
              aria-label="Usuń zdjęcie"
              title="Usuń zdjęcie"
            >×</button>
          </div>
        )}
      </div>
      {cropping && (
        <div className="cropper-modal">
          <div
            className="cropper-container"
            ref={cropperContainerRef}
            tabIndex={-1}
            onKeyDown={e => { if (e.key === 'Enter') handleCropFinish(); }}
          >
            <div className="easy-crop-container">
              <Cropper
                image={selectedImg}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="cropper-buttons">
              <button type="button" className="crop-btn" onClick={handleCropFinish}>
                Zapisz przycięcie
              </button>
              <button type="button" className="crop-cancel-btn" onClick={handleCropCancel}>
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
      <button type="submit" className="submit-btn">Dodaj świnkę</button>
    </form>
  );
}