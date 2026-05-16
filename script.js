// Task class
class Task {
  constructor(
    id,
    title,
    completed = false,
    createdAt = new Date(),
    completedAt = null,
  ) {
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.createdAt = new Date(createdAt);
    this.completedAt = completedAt ? new Date(completedAt) : null;
  }
}

let tasks = [];
let currentFilter = "all";
let editingTaskId = null;

// Load from localStorage
function loadTasks() {
  const stored = localStorage.getItem("taskflow_data");
  if (stored) {
    const parsed = JSON.parse(stored);
    tasks = parsed.map(
      (t) => new Task(t.id, t.title, t.completed, t.createdAt, t.completedAt),
    );
  } else {
    tasks = [
      new Task(Date.now() + 1, "design handoff", false, new Date()),
      new Task(
        Date.now() + 2,
        "update documentation",
        true,
        new Date(),
        new Date(),
      ),
      new Task(Date.now() + 3, "review pull requests", false, new Date()),
    ];
  }
  render();
}

function saveTasks() {
  localStorage.setItem("taskflow_data", JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById("taskInput");
  const title = input.value.trim();
  if (!title) {
    showToast("please enter a task");
    return;
  }
  const newTask = new Task(Date.now(), title);
  tasks.unshift(newTask);
  saveTasks();
  input.value = "";
  render();
  showToast("task added");
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
  showToast("task deleted");
}

function toggleComplete(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;
    saveTasks();
    render();
    showToast(task.completed ? "completed ✓" : "marked active");
  }
}

function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    editingTaskId = id;
    document.getElementById("editInput").value = task.title;
    document.getElementById("editModal").classList.add("active");
  }
}

function saveEdit() {
  const newTitle = document.getElementById("editInput").value.trim();
  if (!newTitle) {
    showToast("task cannot be empty");
    return;
  }
  const task = tasks.find((t) => t.id === editingTaskId);
  if (task) {
    task.title = newTitle;
    saveTasks();
    render();
    showToast("task updated");
  }
  closeModal();
}

function closeModal() {
  document.getElementById("editModal").classList.remove("active");
  editingTaskId = null;
}

function clearCompleted() {
  const completedTasks = tasks.filter((t) => t.completed);
  if (completedTasks.length === 0) {
    showToast("no completed tasks");
    return;
  }
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  render();
  showToast(
    `cleared ${completedTasks.length} task${completedTasks.length > 1 ? "s" : ""}`,
  );
}

function formatRelativeTime(date) {
  if (!date) return "";
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function render() {
  let filtered = [];
  if (currentFilter === "all") filtered = tasks;
  else if (currentFilter === "active")
    filtered = tasks.filter((t) => !t.completed);
  else if (currentFilter === "completed")
    filtered = tasks.filter((t) => t.completed);
  else if (currentFilter === "history")
    filtered = tasks.filter((t) => t.completed);

  const statsCount = document.getElementById("statsCount");
  const activeCount = tasks.filter((t) => !t.completed).length;
  statsCount.textContent = `${activeCount} active ${activeCount === 1 ? "task" : "tasks"}`;

  const container = document.getElementById("tasksContainer");

  if (filtered.length === 0) {
    container.innerHTML = `
                    <div class="empty-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                        <h3>no tasks</h3>
                        <p>${currentFilter === "history" ? "completed tasks will appear here" : "create your first task above"}</p>
                    </div>
                `;
    return;
  }

  container.innerHTML = filtered
    .map((task) => {
      const dateStr =
        task.completed && task.completedAt
          ? `completed ${formatRelativeTime(task.completedAt)}`
          : `created ${formatRelativeTime(new Date(task.createdAt))}`;

      return `
                    <div class="task-card ${task.completed ? "completed" : ""}">
                        <div class="checkbox ${task.completed ? "completed" : ""}" onclick="toggleComplete(${task.id})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M20 6L9 17L4 12" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="task-content">
                            <div class="task-title">${escapeHtml(task.title)}</div>
                            <div class="task-meta">
                                <span>🕐 ${dateStr}</span>
                            </div>
                        </div>
                        <div class="task-actions">
                            <button class="icon-btn edit-btn" onclick="editTask(${task.id})">✏️</button>
                            <button class="icon-btn delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
                        </div>
                    </div>
                `;
    })
    .join("");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Event listeners
document.getElementById("addBtn").addEventListener("click", addTask);
document.getElementById("taskInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});
document.getElementById("closeModalBtn").addEventListener("click", closeModal);
document.getElementById("saveEditBtn").addEventListener("click", saveEdit);
document
  .getElementById("clearCompletedBtn")
  .addEventListener("click", clearCompleted);

document.getElementById("editModal").addEventListener("click", (e) => {
  if (e.target === document.getElementById("editModal")) closeModal();
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentFilter = tab.dataset.filter;
    render();
  });
});

loadTasks();
