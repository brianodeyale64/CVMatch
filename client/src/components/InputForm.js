import React, { useState, useRef } from 'react';
import './InputForm.css';

function InputForm({ onSubmit, loading, error }) {
  const [cvText, setCvText] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [inputMode, setInputMode] = useState('text'); // 'text' | 'file'
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setCvFile(f); setCvText(''); }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type === 'application/pdf') { setCvFile(f); setInputMode('file'); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('jobDescription', jobDesc);
    if (inputMode === 'file' && cvFile) {
      fd.append('cv', cvFile);
    } else {
      fd.append('cvText', cvText);
    }
    onSubmit(fd);
  };

  const canSubmit = jobDesc.trim() && (inputMode === 'text' ? cvText.trim() : cvFile) && !loading;

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-section">
        <div className="section-label">
          <span className="label-num">01</span>
          <span>Your CV</span>
        </div>

        <div className="mode-toggle">
          <button type="button" className={`mode-btn ${inputMode === 'text' ? 'active' : ''}`} onClick={() => setInputMode('text')}>
            Paste text
          </button>
          <button type="button" className={`mode-btn ${inputMode === 'file' ? 'active' : ''}`} onClick={() => setInputMode('file')}>
            Upload PDF
          </button>
        </div>

        {inputMode === 'text' ? (
          <textarea
            className="textarea"
            placeholder="Paste your CV content here..."
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            rows={10}
          />
        ) : (
          <div
            className={`drop-zone ${cvFile ? 'has-file' : ''}`}
            onClick={() => fileRef.current.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <input ref={fileRef} type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
            {cvFile ? (
              <div className="file-info">
                <span className="file-icon">📄</span>
                <span className="file-name">{cvFile.name}</span>
                <button type="button" className="remove-file" onClick={(e) => { e.stopPropagation(); setCvFile(null); }}>✕</button>
              </div>
            ) : (
              <div className="drop-prompt">
                <span className="drop-icon">↑</span>
                <span>Drop PDF here or click to browse</span>
                <span className="drop-hint">Max 5MB</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="form-section">
        <div className="section-label">
          <span className="label-num">02</span>
          <span>Job Description</span>
        </div>
        <textarea
          className="textarea"
          placeholder="Paste the full job description here..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          rows={10}
        />
      </div>

      {error && <div className="error-msg">⚠ {error}</div>}

      <button className={`submit-btn ${loading ? 'loading' : ''}`} type="submit" disabled={!canSubmit}>
        {loading ? (
          <span className="btn-inner">
            <span className="spinner" />
            Analysing...
          </span>
        ) : (
          <span className="btn-inner">
            <span>Analyse Match</span>
            <span className="btn-arrow">→</span>
          </span>
        )}
      </button>
    </form>
  );
}

export default InputForm;
