import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          JWT Auth Demo
        </Link>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
        <div className="topbar-right">
          {user ? <span className="badge">{user.email}</span> : null}
          {user ? (
            <button type="button" className="btn ghost" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn ghost">
              Sign in
            </Link>
          )}
        </div>
      </header>
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
};
