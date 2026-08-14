 function TaskItem({
  task,
  toggleTask,
  deleteTask,
}) {
  return (
    <div className="task-item">

      {/* CHECK TASK */}
      <button
        type="button"
        className={
          task.completed
            ? "check-circle checked"
            : "check-circle"
        }
        onClick={() => toggleTask(task)}
        aria-label={
          task.completed
            ? "Mark task as pending"
            : "Mark task as completed"
        }
      >
        {task.completed && "✓"}
      </button>

      {/* TASK TITLE */}
      <span
        className={
          task.completed
            ? "task-title completed"
            : "task-title"
        }
      >
        {task.title}
      </span>

      {/* CATEGORY */}
      <span
        className={`category ${
          task.category
            ? task.category.toLowerCase()
            : "personal"
        }`}
      >
        {task.category || "Personal"}
      </span>

      {/* DELETE */}
      <button
        type="button"
        className="delete-button"
        onClick={() => deleteTask(task.id)}
        aria-label="Delete task"
      >
        🗑
      </button>

    </div>
  );
}

export default TaskItem;