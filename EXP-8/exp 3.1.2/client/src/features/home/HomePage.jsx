import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <section className="hero">
      <p className="kicker">React Router + Express + JWT</p>
      <h1>Simple protected routing starter.</h1>
      <p>
        Register or login, then open the dashboard. Unauthenticated users are redirected to the
        sign in page automatically.
      </p>
      <div className="hero-actions">
        <Link to="/register" className="btn primary">
          Register
        </Link>
        <Link to="/dashboard" className="btn secondary">
          Open dashboard
        </Link>
      </div>
    </section>
  );
};
