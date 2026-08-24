import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">✓</span>
          StudentTask
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>

          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="badge">🎓 Built for students</div>

            <h1>
              Organize your tasks.
              <span> Achieve your goals.</span>
            </h1>

            <p>
              StudentTask helps you manage assignments, deadlines, and
              daily tasks in one simple workspace.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-btn"
                onClick={() => navigate("/register")}
              >
                Get Started →
              </button>

              <button
                className="secondary-btn"
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Learn More
              </button>
            </div>

            <div className="trust">
              <div className="avatars">
                <span>👨‍🎓</span>
                <span>👩‍🎓</span>
                <span>🧑‍🎓</span>
              </div>

              <div>
                <strong>Stay on track</strong>
                <small>Manage your academic life with ease</small>
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="card-header">
              <div>
                <small>My Tasks</small>
                <h2>Today's Progress</h2>
              </div>

              <div className="progress-circle">75%</div>
            </div>

            <div className="progress-bar">
              <div></div>
            </div>

            <div className="task">
              <div className="task-check completed">✓</div>

              <div className="task-info">
                <strong>Complete mathematics assignment</strong>
                <small>Due today</small>
              </div>

              <span className="priority high">High</span>
            </div>

            <div className="task">
              <div className="task-check completed">✓</div>

              <div className="task-info">
                <strong>Read chapter 5</strong>
                <small>Due today</small>
              </div>

              <span className="priority medium">Medium</span>
            </div>

            <div className="task">
              <div className="task-check"></div>

              <div className="task-info">
                <strong>Prepare presentation</strong>
                <small>Due tomorrow</small>
              </div>

              <span className="priority low">Low</span>
            </div>

            <button
              className="view-tasks"
              onClick={() => navigate("/login")}
            >
              View all tasks →
            </button>
          </div>
        </section>

        <section className="features" id="features">
          <div className="section-heading">
            <small>EVERYTHING YOU NEED</small>

            <h2>One place for all your tasks</h2>

            <p>
              Simple tools designed to help students stay organized,
              focused, and productive.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature">
              <div className="feature-icon">✓</div>

              <h3>Task Management</h3>

              <p>
                Create, update, organize, and complete your tasks
                effortlessly.
              </p>
            </div>

            <div className="feature">
              <div className="feature-icon">◷</div>

              <h3>Deadlines</h3>

              <p>
                Keep track of upcoming deadlines so nothing gets
                forgotten.
              </p>
            </div>

            <div className="feature">
              <div className="feature-icon">↗</div>

              <h3>Track Progress</h3>

              <p>
                See your progress and understand what still needs to
                be completed.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer id="about">
        <div className="logo">
          <span className="logo-icon">✓</span>
          StudentTask
        </div>

        <p>© 2026 StudentTask. Stay organized. Stay focused.</p>
      </footer>
    </div>
  );
}