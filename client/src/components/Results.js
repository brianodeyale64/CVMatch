import React, { useState } from 'react';
import './Results.css';

function ScoreRing({ score }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 70 ? 'var(--accent)' : score >= 45 ? 'var(--yellow)' : 'var(--red)';

  return (
    <div className="score-ring-wrap">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
        <circle
          cx="65" cy="65" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ * 0.25}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="score-text">
        <span className="score-num" style={{ color }}>{score}</span>
        <span className="score-label">/100</span>
      </div>
    </div>
  );
}

function Results({ data, onReset }) {
  const [coverCopied, setCoverCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const copyCoverLetter = () => {
    navigator.clipboard.writeText(data.coverLetter);
    setCoverCopied(true);
    setTimeout(() => setCoverCopied(false), 2000);
  };

  const verdictColor = {
    'Strong Match': 'var(--accent)',
    'Good Match': 'var(--blue)',
    'Partial Match': 'var(--yellow)',
    'Weak Match': 'var(--red)',
  }[data.matchVerdict] || 'var(--text-muted)';

  return (
    <div className="results">
      <div className="results-header">
        <div className="score-area">
          <ScoreRing score={data.matchScore} />
          <div className="verdict-area">
            <span className="verdict-badge" style={{ color: verdictColor, borderColor: verdictColor }}>
              {data.matchVerdict}
            </span>
            <p className="summary">{data.summary}</p>
          </div>
        </div>
        <button className="reset-btn" onClick={onReset}>← New Analysis</button>
      </div>

      <div className="tabs">
        {['overview', 'cv tweaks', 'cover letter'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="tab-content">
          <div className="two-col">
            <div className="card card-green">
              <div className="card-title">
                <span className="card-icon">✓</span> Strengths
              </div>
              <div className="card-items">
                {data.strengths.map((s, i) => (
                  <div key={i} className="item">
                    <div className="item-title">{s.title}</div>
                    <div className="item-detail">{s.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card card-red">
              <div className="card-title">
                <span className="card-icon">△</span> Gaps
              </div>
              <div className="card-items">
                {data.gaps.map((g, i) => (
                  <div key={i} className="item">
                    <div className="item-title">{g.title}</div>
                    <div className="item-detail">{g.detail}</div>
                    <div className="item-fix">→ {g.fix}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cv tweaks' && (
        <div className="tab-content">
          <div className="card card-blue">
            <div className="card-title">
              <span className="card-icon">✎</span> Suggested CV Improvements
            </div>
            <div className="card-items">
              {data.cvTweaks.map((t, i) => (
                <div key={i} className="item">
                  <div className="item-section-tag">{t.section}</div>
                  <div className="item-detail">{t.suggestion}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cover letter' && (
        <div className="tab-content">
          <div className="card card-plain">
            <div className="card-title-row">
              <div className="card-title">
                <span className="card-icon">✉</span> Tailored Cover Letter
              </div>
              <button className="copy-btn" onClick={copyCoverLetter}>
                {coverCopied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="cover-letter-text">{data.coverLetter}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default Results;
