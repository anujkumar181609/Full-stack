import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await api.get("/users/me");
        setMe(data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  return (
    <section className="card">
      <h2>Protected Dashboard</h2>
      {loading ? <p>Loading secure data...</p> : null}
      {!loading && error ? <p className="error">{error}</p> : null}
      {!loading && me ? (
        <div className="stack">
          <p>
            <strong>ID:</strong> {me.id}
          </p>
          <p>
            <strong>Name:</strong> {me.name}
          </p>
          <p>
            <strong>Email:</strong> {me.email}
          </p>
        </div>
      ) : null}
    </section>
  );
};
