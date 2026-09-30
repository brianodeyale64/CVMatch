import React, { useState, useRef } from 'react';
import './InputForm.css';

function InputForm({ onSubmit, loading, error }) {
  const [cvText, setCvText] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [inputMode, setInputMode] = useState('text'); // 'text' | 'file'
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setCvFile(f); setCvText(''); }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
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
    <form className="desk" onSubmit={handleSubmit}>
      <p className="desk-intro">
        Hand over your CV and the job you're after. We'll read them side by side,
        highlight what lines up, circle what's missing, and draft the letter.
      </p>

      <div className="sheets">
        <section className="sheet sheet-cv">
          <header className="sheet-head">
            <span className="eyebrow">Exhibit A</span>
            <h2 className="sheet-title">Your CV</h2>
            <div className="mode-toggle" role="tablist" aria-label="CV input method">
              <button
                type="button" role="tab" aria-selected={inputMode === 'text'}
                className={`mode-btn ${inputMode === 'text' ? 'active' : ''}`}
                onClick={() => setInputMode('text')}
              >
                Paste
              </button>
              <span className="mode-sep">/</span>
              <button
                type="button" role="tab" aria-selected={inputMode === 'file'}
                className={`mode-btn ${inputMode === 'file' ? 'active' : ''}`}
                onClick={() => setInputMode('file')}
              >
                PDF
              </button>
            </div>
          </header>

          {inputMode === 'text' ? (
            <textarea
              className="ruled"
              placeholder="Paste your CV here…"
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              aria-label="CV text"
            />
          ) : (
            <div
              className={`drop-zone ${cvFile ? 'has-file' : ''} ${dragging ? 'dragging' : ''}`}
              onClick={() => fileRef.current.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileRef.current.click(); }}
            >
              <input ref={fileRef} type="file" accept=".pdf" onChange={handleFileChange} hidden />
              {cvFile ? (
                <div className="file-info">
                  <span className="file-clip" aria-hidden="true">📎</span>
                  <span className="file-name">{cvFile.name}</span>
                  <button
                    type="button" className="remove-file" aria-label="Remove file"
                    onClick={(e) => { e.stopPropagation(); setCvFile(null); }}
                  >
                    remove
                  </button>
                </div>
              ) : (
                <div className="drop-prompt">
                  <span className="drop-hand">drop it here</span>
                  <span className="drop-sub">or click to choose a PDF · max 5 MB</span>
                </div>
              )}
            </div>
          )}
          <footer className="sheet-foot eyebrow">
            {inputMode === 'text'
              ? `${cvText.trim() ? cvText.trim().split(/\s+/).length : 0} words`
              : cvFile ? 'PDF attached' : 'Awaiting file'}
          </footer>
        </section>

        <section className="sheet sheet-job">
          <header className="sheet-head">
            <span className="eyebrow">Exhibit B</span>
            <h2 className="sheet-title">The Job</h2>
          </header>
          <textarea
            className="ruled"
            placeholder="Paste the full job description…"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            aria-label="Job description"
          />
          <footer className="sheet-foot eyebrow">
            {`${jobDesc.trim() ? jobDesc.trim().split(/\s+/).length : 0} words`}
          </footer>
        </section>
      </div>

      {error && (
        <div className="error-note" role="alert">
          <span className="error-hand">hold on —</span> {error}
        </div>
      )}

      <div className="submit-row">
        <button className={`submit-btn ${loading ? 'loading' : ''}`} type="submit" disabled={!canSubmit}>
          {loading ? (
            <span className="btn-inner">
              <span className="pen" aria-hidden="true" />
              Reading your CV…
            </span>
          ) : (
            <span className="btn-inner">
              Mark it up <span className="btn-arrow" aria-hidden="true">→</span>
            </span>
          )}
        </button>
        <span className="submit-note">
          {loading
            ? 'The red pen is out. This usually takes a few seconds.'
            : 'Scored, annotated and a cover letter drafted.'}
        </span>
      </div>
    </form>
  );
}

export default InputForm;
