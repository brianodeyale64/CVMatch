import React, { useState } from 'react';
import InputForm from './components/InputForm';
import Results from './components/Results';
import Header from './components/Header';
import './App.css';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyse = async (formData) => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/analyse', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setResult(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setResult(null); setError(''); };

  return (
    <div className="app">
      <Header />
      <main className="main">
        {!result ? (
          <InputForm onSubmit={handleAnalyse} loading={loading} error={error} />
        ) : (
          <Results data={result} onReset={handleReset} />
        )}
      </main>
      <footer className="colophon">
        <span className="eyebrow">CVMatch · Read by Claude</span>
        <span className="eyebrow">React · Express · Anthropic API</span>
      </footer>
    </div>
  );
}

export default App;
