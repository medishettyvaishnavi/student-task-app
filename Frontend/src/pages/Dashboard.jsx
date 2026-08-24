import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <div className="logo">
            <span className="logo-icon">✓</span>
            StudentTask
          </div>

          <p>Manage your academic tasks</p>
        </div>

        <button onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <section className="welcome-card">
          <h1>
            Welcome
            {user?.name ? `, ${user.name}` : ""}! 👋
          </h1>

          <p>
            Stay organized and keep moving toward your goals.
          </p>
        </section>

        <section className="task-section">
          <div className="section-title">
            <div>
              <h2>My Tasks</h2>
              <p>Your tasks will appear here.</p>
            </div>

            <button>
              + Add Task
            </button>
          </div>

          <div className="empty-task">
            <div className="empty-icon">✓</div>

            <h3>No tasks yet</h3>

            <p>
              Create your first task to get started.
            </p>

            <button>
              Create Task
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}