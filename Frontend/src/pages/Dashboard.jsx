import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [creating, setCreating] = useState(false);

  const fetchTasks = useCallback(async (explicitUserId) => {
    let currentUserId = typeof explicitUserId === "string" ? explicitUserId : null;
    
    if (!currentUserId) {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          currentUserId = JSON.parse(savedUser)?.id;
        }
      } catch {
        // ignore parse error
      }
    }

    if (!currentUserId) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:8080/api/tasks/${currentUserId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchTasks(parsedUser.id);
    } catch {
      navigate("/login");
    }
  }, [navigate, fetchTasks]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle || !taskDueDate || !user?.id) return;

    try {
      setCreating(true);
      const response = await fetch("http://localhost:8080/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          dueDate: taskDueDate,
          priority: taskPriority,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const newTask = await response.json();
      setTasks((prev) => [...prev, newTask]);

      // Reset form & close modal
      setTaskTitle("");
      setTaskDescription("");
      setTaskDueDate("");
      setTaskPriority("Medium");
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updated = await response.json();
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? updated : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>StudentTask</h1>
          <p>Welcome back{user?.name ? `, ${user.name}` : ""}! Manage your tasks and stay organized.</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <section className="welcome-card">
          <h2>Today's Progress</h2>
          <p>
            {completedTasks} of {tasks.length} tasks completed
          </p>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <strong>{progress}% complete</strong>
        </section>

        <section className="task-section">
          <div className="section-title">
            <div>
              <h2>Your Tasks</h2>
              <p>Tasks saved in your account.</p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-secondary" onClick={() => fetchTasks(user?.id)}>
                Refresh
              </button>
              <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                + Add Task
              </button>
            </div>
          </div>

          {loading && <p>Loading tasks...</p>}
          {error && <p style={{ color: "#ef4444" }}>{error}</p>}

          {!loading && !error && tasks.length === 0 && (
            <div className="empty-task">
              <div className="empty-icon">✓</div>
              <h3>No tasks yet</h3>
              <p>Create your first task to get organized.</p>
              <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ marginTop: "15px" }}>
                + Add Task
              </button>
            </div>
          )}

          {!loading && !error && tasks.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className={`task-item ${task.completed ? "completed" : ""}`}
                >
                  <button
                    className={`task-check-btn ${task.completed ? "checked" : ""}`}
                    onClick={() => handleToggleTask(task._id, task.completed)}
                    title={task.completed ? "Mark as pending" : "Mark as completed"}
                  >
                    ✓
                  </button>

                  <div className="task-details">
                    <h4>{task.title}</h4>
                    {task.description && <p>{task.description}</p>}
                    <div className="task-meta">
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  <button
                    className="task-delete-btn"
                    onClick={() => handleDeleteTask(task._id)}
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Task</h2>
            <form onSubmit={handleCreateTask} className="modal-form">
              <label>
                Task Title *
                <input
                  type="text"
                  placeholder="e.g., Complete Mathematics Assignment"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                />
              </label>

              <label>
                Description (Optional)
                <textarea
                  rows="3"
                  placeholder="Additional details, chapters, or notes..."
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
              </label>

              <label>
                Due Date *
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  required
                />
              </label>

              <label>
                Priority
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={creating}>
                  {creating ? "Creating..." : "Save Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}