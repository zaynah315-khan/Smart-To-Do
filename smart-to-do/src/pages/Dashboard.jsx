 import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import TaskItem from "../components/TaskItem";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("Personal");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    if (user) {
      await fetchTasks(user.id);
    } else {
      setLoading(false);
    }
  }

  async function fetchTasks(userId) {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Fetch tasks error:", error);
    } else {
      setTasks(data || []);
    }

    setLoading(false);
  }

  async function addTask(e) {
    e.preventDefault();

    if (!newTask.trim() || !user) {
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title: newTask.trim(),
        category,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Add task error:", error);
      return;
    }

    setTasks((previous) => [
      data,
      ...previous,
    ]);

    setNewTask("");
    setCategory("Personal");
  }

  async function toggleTask(task) {
    const updatedStatus = !task.completed;

    const { error } = await supabase
      .from("tasks")
      .update({
        completed: updatedStatus,
      })
      .eq("id", task.id);

    if (error) {
      console.error(
        "Update task error:",
        error
      );
      return;
    }

    setTasks((previous) =>
      previous.map((item) =>
        item.id === task.id
          ? {
              ...item,
              completed: updatedStatus,
            }
          : item
      )
    );
  }

  async function deleteTask(id) {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Delete task error:",
        error
      );
      return;
    }

    setTasks((previous) =>
      previous.filter(
        (task) => task.id !== id
      )
    );
  }

  async function logout() {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  }

  const filteredTasks = tasks.filter(
    (task) => {
      if (filter === "Pending") {
        return !task.completed;
      }

      if (filter === "Completed") {
        return task.completed;
      }

      return true;
    }
  );

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const firstName =
    user?.user_metadata?.full_name?.split(
      " "
    )[0] || "there";

  return (
    <main className="dashboard">

      {/* =========================
          HEADER
      ========================= */}

      <header className="dashboard-header">

        <div>
          <div className="brand">
            <span>✦</span>
            Goal Grid
          </div>

          <h1>
            Good Morning, {firstName}! ☀️
          </h1>

          <p>
            Let's make today amazing!
          </p>
        </div>

        <button
          className="logout-button"
          onClick={logout}
          type="button"
        >
          <span>↪</span>
          Logout
        </button>

      </header>


      {/* =========================
          HERO
      ========================= */}

      <section className="dashboard-hero">

        <img
          className="dashboard-hero-image"
          src="/assets/dashboard-hero.jpeg"
          alt=""
          aria-hidden="true"
        />

        <div className="hero-overlay"></div>

        <div className="hero-text">

          <span>
            TODAY'S FOCUS
          </span>

          <h2>
            Turn your goals
            <br />
            into small wins.
          </h2>

          <p>
            One task at a time.
          </p>

        </div>

      </section>


      {/* =========================
          ADD TASK
      ========================= */}

      <section className="task-input-card">

        <form onSubmit={addTask}>

          <input
            type="text"
            placeholder="What do you want to do?"
            value={newTask}
            onChange={(e) =>
              setNewTask(e.target.value)
            }
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option value="Personal">
              Personal
            </option>

            <option value="Work">
              Work
            </option>

            <option value="Health">
              Health
            </option>

            <option value="Shopping">
              Shopping
            </option>
          </select>

          <button type="submit">
            <span>+</span>
            Add
          </button>

        </form>

      </section>


      {/* =========================
          FILTERS
      ========================= */}

      <div className="task-toolbar">

        <div className="filters">

          {[
            "All",
            "Pending",
            "Completed",
          ].map((item) => (
            <button
              key={item}
              type="button"
              className={
                filter === item
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter(item)
              }
            >
              {item}
            </button>
          ))}

        </div>

        <span className="task-count">
          {completedCount}/{tasks.length} completed
        </span>

      </div>


      {/* =========================
          TASK LIST
      ========================= */}

      <section className="task-list">

        {loading ? (

          <div className="empty">

            <div className="loader"></div>

            <p>
              Loading your tasks...
            </p>

          </div>

        ) : filteredTasks.length === 0 ? (

          <div className="empty">

            <img
              src="/assets/empty-task.jpeg"
              alt="No tasks"
            />

            <h3>
              No tasks yet
            </h3>

            <p>
              Add your first goal and
              start making progress.
            </p>

          </div>

        ) : (

          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              toggleTask={toggleTask}
              deleteTask={deleteTask}
            />
          ))

        )}

      </section>


      {/* =========================
          BOTTOM FOOTER
      ========================= */}

      <section className="bottom-decoration">

        <img
          className="bottom-plants"
          src="/assets/dashboard-plants.jpeg"
          alt=""
          aria-hidden="true"
        />

        <div className="bottom-overlay"></div>

        <div className="quote">

          <span>✦</span>

          <strong>
            Small steps every day
            <br />
            lead to big results.
          </strong>

          <span>✦</span>

        </div>

      </section>

    </main>
  );
}

export default Dashboard;