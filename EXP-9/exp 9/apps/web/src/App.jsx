import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function App() {
  const [status, setStatus] = useState("Checking API...");

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        const data = await response.json();
        setStatus(data.ok ? `API healthy at ${data.timestamp}` : "API is not healthy");
      } catch {
        setStatus("API not reachable");
      }
    };

    checkApi();
  }, []);

  return (
    <main className="container">
      <h1>Full-Stack Docker Starter</h1>
      <p className="subtitle">React + Node.js with production-ready multi-stage Docker builds</p>

      <section className="card">
        <h2>Runtime Status</h2>
        <p>{status}</p>
      </section>

      <section className="card">
        <h2>Architecture</h2>
        <ul>
          <li>Frontend: React (Vite)</li>
          <li>Backend: Express API</li>
          <li>Production web server: Nginx</li>
          <li>Orchestration: Docker Compose</li>
        </ul>
      </section>
    </main>
  );
}
