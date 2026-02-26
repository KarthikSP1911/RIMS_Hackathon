import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [expressData, setExpressData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFromExpress = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/fastapi-data');
      if (!response.ok) {
        throw new Error('Failed to fetch from Express');
      }
      const data = await response.json();
      setExpressData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fullstack Setup</h1>
        <p>React (3000) &rarr; Express (5000) &rarr; FastAPI (8000)</p>
        
        <button onClick={fetchFromExpress} disabled={loading}>
          {loading ? 'Fetching...' : 'Get Data from FastAPI via Express'}
        </button>

        {error && <p className="error">Error: {error}</p>}

        {expressData && (
          <div className="data-container">
            <h3>Response from Express:</h3>
            <pre>{JSON.stringify(expressData, null, 2)}</pre>
            
            <h3>Data directly from FastAPI (proxied):</h3>
            <ul>
              {expressData.fastapi_response.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
