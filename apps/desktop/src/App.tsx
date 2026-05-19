import "./App.css";

function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Automation OS</h2>

        <button>New Workflow</button>
        <button>Tools</button>
        <button>Logs</button>
      </aside>

      <main className="main">
        <h1>Local-First AI Automation OS</h1>

        <div className="card">
          <p>System initialized successfully.</p>
        </div>
      </main>
    </div>
  );
}

export default App;