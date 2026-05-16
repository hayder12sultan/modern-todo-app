// Task data structure
let tasks = [];

// DOM elements
let taskInput;
let addBtn;
let tasksContainer;

// Load tasks from localStorage
function loadTasks() {
  const stored = localStorage.getItem("taskflow_tasks");
  if (stored) {
    tasks = JSON.parse(stored);
    console.log(`Loaded ${tasks.length} tasks from storage`);
  } else {
    console.log("No saved tasks found, starting fresh");
  }
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("taskflow_tasks", JSON.stringify(tasks));
  console.log(`Saved ${tasks.length} tasks to storage`);
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements
  taskInput = document.getElementById("taskInput");
  addBtn = document.getElementById("addBtn");
  tasksContainer = document.getElementById("tasksContainer");

  // Load existing tasks
  loadTasks();

  console.log("App initialized with", tasks.length, "tasks");
});

// Add new task
function addTask() {
  const title = taskInput.value.trim();

  if (!title) {
    alert("Please enter a task");
    return;
  }

  const newTask = {
    id: Date.now(),
    title: title,
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };

  tasks.unshift(newTask); // Add to beginning of array
  saveTasks();
  renderTasks();

  taskInput.value = "";
  taskInput.focus();

  console.log("Task added:", newTask);
}

// Render tasks to UI
function renderTasks() {
  if (!tasksContainer) return;

  if (tasks.length === 0) {
    tasksContainer.innerHTML = `
            <div class="empty-state">
                <p>✨ No tasks yet</p>
                <p style="font-size: 12px; margin-top: 8px;">Add your first task above</p>
            </div>
        `;
    return;
  }

  tasksContainer.innerHTML = tasks
    .map(
      (task) => `
        <div class="task-card" data-id="${task.id}">
            <span class="task-title">${escapeHtml(task.title)}</span>
        </div>
    `,
    )
    .join("");
}

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Set up event listeners
function setupEventListeners() {
  addBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });
}

// Update DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements
  taskInput = document.getElementById("taskInput");
  addBtn = document.getElementById("addBtn");
  tasksContainer = document.getElementById("tasksContainer");

  // Load existing tasks
  loadTasks();

  // Set up event listeners
  setupEventListeners();

  // Initial render
  renderTasks();

  console.log("App initialized with", tasks.length, "tasks");
});

// Delete task
function deleteTask(id) {
  if (confirm("Delete this task?")) {
    const taskCount = tasks.length;
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
    console.log(`Task deleted. ${tasks.length}/${taskCount} tasks remaining`);
  }
}

// Update renderTasks function
function renderTasks() {
  if (!tasksContainer) return;

  if (tasks.length === 0) {
    tasksContainer.innerHTML = `
            <div class="empty-state">
                <p>✨ No tasks yet</p>
                <p style="font-size: 12px; margin-top: 8px;">Add your first task above</p>
            </div>
        `;
    return;
  }

  tasksContainer.innerHTML = tasks
    .map(
      (task) => `
        <div class="task-card" data-id="${task.id}">
            <span class="task-title">${escapeHtml(task.title)}</span>
            <div class="task-actions">
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `,
    )
    .join("");
}

// Toggle complete status
function toggleComplete(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;
    saveTasks();
    renderTasks();
    console.log(
      "Task toggled:",
      task.title,
      task.completed ? "completed" : "active",
    );
  }
}

// Update renderTasks function
function renderTasks() {
  if (!tasksContainer) return;

  if (tasks.length === 0) {
    tasksContainer.innerHTML = `
            <div class="empty-state">
                <p>✨ No tasks yet</p>
                <p style="font-size: 12px; margin-top: 8px;">Add your first task above</p>
            </div>
        `;
    return;
  }

  tasksContainer.innerHTML = tasks
    .map(
      (task) => `
        <div class="task-card ${task.completed ? "completed" : ""}" data-id="${task.id}">
            <div class="task-left">
                <input type="checkbox" 
                       class="task-checkbox" 
                       ${task.completed ? "checked" : ""} 
                       onchange="toggleComplete(${task.id})">
                <span class="task-title">${escapeHtml(task.title)}</span>
            </div>
            <div class="task-actions">
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `,
    )
    .join("");
}

let editingTaskId = null;
let editModal, editInput, closeModalBtn, saveEditBtn;

// Edit task
function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    editingTaskId = id;
    editInput.value = task.title;
    editModal.style.display = "flex";
  }
}

// Save edit
function saveEdit() {
  const newTitle = editInput.value.trim();
  if (!newTitle) {
    alert("Task title cannot be empty");
    return;
  }

  const task = tasks.find((t) => t.id === editingTaskId);
  if (task) {
    task.title = newTitle;
    saveTasks();
    renderTasks();
    console.log("Task updated:", task);
  }
  closeModal();
}

// Close modal
function closeModal() {
  editModal.style.display = "none";
  editingTaskId = null;
  editInput.value = "";
}

// Update renderTasks to include edit button
function renderTasks() {
  // ... existing code
  tasksContainer.innerHTML = tasks
    .map(
      (task) => `
        <div class="task-card ${task.completed ? "completed" : ""}" data-id="${task.id}">
            <div class="task-left">
                <input type="checkbox" 
                       class="task-checkbox" 
                       ${task.completed ? "checked" : ""} 
                       onchange="toggleComplete(${task.id})">
                <span class="task-title">${escapeHtml(task.title)}</span>
            </div>
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `,
    )
    .join("");
}

// Update DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements
  taskInput = document.getElementById("taskInput");
  addBtn = document.getElementById("addBtn");
  tasksContainer = document.getElementById("tasksContainer");
  editModal = document.getElementById("editModal");
  editInput = document.getElementById("editInput");
  closeModalBtn = document.getElementById("closeModalBtn");
  saveEditBtn = document.getElementById("saveEditBtn");

  // Load existing tasks
  loadTasks();

  // Set up event listeners
  setupEventListeners();

  // Modal event listeners
  closeModalBtn.addEventListener("click", closeModal);
  saveEditBtn.addEventListener("click", saveEdit);
  editModal.addEventListener("click", (e) => {
    if (e.target === editModal) closeModal();
  });

  // Initial render
  renderTasks();

  console.log("App initialized with", tasks.length, "tasks");
});

let currentFilter = "all";

// Get filtered tasks based on current filter
function getFilteredTasks() {
  if (currentFilter === "active") {
    return tasks.filter((t) => !t.completed);
  }
  if (currentFilter === "completed") {
    return tasks.filter((t) => t.completed);
  }
  return tasks;
}

// Update renderTasks to use filtered tasks
function renderTasks() {
  if (!tasksContainer) return;

  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    let message = "";
    if (currentFilter === "active") message = "No active tasks";
    else if (currentFilter === "completed") message = "No completed tasks";
    else message = "No tasks yet";

    tasksContainer.innerHTML = `
            <div class="empty-state">
                <p>✨ ${message}</p>
                <p style="font-size: 12px; margin-top: 8px;">
                    ${currentFilter === "all" ? "Add your first task above" : "Try another filter"}
                </p>
            </div>
        `;
    return;
  }

  tasksContainer.innerHTML = filteredTasks
    .map(
      (task) => `
        <div class="task-card ${task.completed ? "completed" : ""}" data-id="${task.id}">
            <div class="task-left">
                <input type="checkbox" 
                       class="task-checkbox" 
                       ${task.completed ? "checked" : ""} 
                       onchange="toggleComplete(${task.id})">
                <span class="task-title">${escapeHtml(task.title)}</span>
            </div>
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `,
    )
    .join("");
}

// Set up tab switching
function setupTabs() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentFilter = tab.dataset.filter;
      renderTasks();
      console.log("Filter changed to:", currentFilter);
    });
  });
}

// Update DOMContentLoaded to include setupTabs
document.addEventListener("DOMContentLoaded", () => {
  // ... existing code
  setupTabs();
  // ... rest of code
});

// Update getFilteredTasks to include history
function getFilteredTasks() {
  if (currentFilter === "active") {
    return tasks.filter((t) => !t.completed);
  }
  if (currentFilter === "completed") {
    return tasks.filter((t) => t.completed);
  }
  if (currentFilter === "history") {
    return tasks.filter((t) => t.completed);
  }
  return tasks;
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

// Update renderTasks to show timestamps
function renderTasks() {
  if (!tasksContainer) return;

  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    let message = "";
    if (currentFilter === "active") message = "No active tasks";
    else if (currentFilter === "completed") message = "No completed tasks";
    else if (currentFilter === "history") message = "No task history";
    else message = "No tasks yet";

    tasksContainer.innerHTML = `
            <div class="empty-state">
                <p>✨ ${message}</p>
                <p style="font-size: 12px; margin-top: 8px;">
                    ${currentFilter === "all" ? "Add your first task above" : "Try another filter"}
                </p>
            </div>
        `;
    return;
  }

  tasksContainer.innerHTML = filteredTasks
    .map((task) => {
      const dateStr =
        task.completed && task.completedAt
          ? `Completed ${formatDate(task.completedAt)}`
          : `Created ${formatDate(task.createdAt)}`;

      return `
            <div class="task-card ${task.completed ? "completed" : ""}" data-id="${task.id}">
                <div class="task-left">
                    <input type="checkbox" 
                           class="task-checkbox" 
                           ${task.completed ? "checked" : ""} 
                           onchange="toggleComplete(${task.id})">
                    <div class="task-info">
                        <div class="task-title">${escapeHtml(task.title)}</div>
                        <div class="task-meta">🕐 ${dateStr}</div>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            </div>
        `;
    })
    .join("");
}

let statsCount, clearCompletedBtn;

// Update statistics
function updateStats() {
  const activeCount = tasks.filter((t) => !t.completed).length;
  const totalCount = tasks.length;
  statsCount.textContent = `${activeCount} active of ${totalCount} total`;
}

// Clear all completed tasks
function clearCompleted() {
  const completedTasks = tasks.filter((t) => t.completed);

  if (completedTasks.length === 0) {
    alert("No completed tasks to clear");
    return;
  }

  if (
    confirm(
      `Delete ${completedTasks.length} completed task${completedTasks.length > 1 ? "s" : ""}?`,
    )
  ) {
    tasks = tasks.filter((t) => !t.completed);
    saveTasks();
    renderTasks();
    updateStats();
    console.log(`Cleared ${completedTasks.length} completed tasks`);
  }
}

// Update renderTasks to call updateStats
function renderTasks() {
  // ... existing render code
  updateStats(); // Add this line
}

// Update DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements
  taskInput = document.getElementById("taskInput");
  addBtn = document.getElementById("addBtn");
  tasksContainer = document.getElementById("tasksContainer");
  editModal = document.getElementById("editModal");
  editInput = document.getElementById("editInput");
  closeModalBtn = document.getElementById("closeModalBtn");
  saveEditBtn = document.getElementById("saveEditBtn");
  statsCount = document.getElementById("statsCount");
  clearCompletedBtn = document.getElementById("clearCompletedBtn");

  // Load existing tasks
  loadTasks();

  // Set up event listeners
  setupEventListeners();
  setupTabs();

  // Modal event listeners
  closeModalBtn.addEventListener("click", closeModal);
  saveEditBtn.addEventListener("click", saveEdit);
  editModal.addEventListener("click", (e) => {
    if (e.target === editModal) closeModal();
  });

  // Clear completed button
  clearCompletedBtn.addEventListener("click", clearCompleted);

  // Initial render
  renderTasks();

  console.log("App initialized with", tasks.length, "tasks");
});

// Show toast notification
function showToast(message, duration = 2000) {
  const existingToast = document.querySelector(".toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Add toast to all functions
function addTask() {
  const title = taskInput.value.trim();

  if (!title) {
    showToast("Please enter a task", 1500);
    return;
  }

  const newTask = {
    id: Date.now(),
    title: title,
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  taskInput.focus();

  showToast("✓ Task added");
  console.log("Task added:", newTask);
}

function deleteTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (confirm("Delete this task?")) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
    showToast(`🗑 Deleted "${task.title.substring(0, 30)}"`);
    console.log(`Task deleted.`);
  }
}

function toggleComplete(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;
    saveTasks();
    renderTasks();
    showToast(task.completed ? "✓ Task completed!" : "↺ Task reopened");
    console.log(
      "Task toggled:",
      task.title,
      task.completed ? "completed" : "active",
    );
  }
}

function saveEdit() {
  const newTitle = editInput.value.trim();
  if (!newTitle) {
    showToast("Task cannot be empty", 1500);
    return;
  }

  const task = tasks.find((t) => t.id === editingTaskId);
  if (task) {
    task.title = newTitle;
    saveTasks();
    renderTasks();
    showToast("✎ Task updated");
    console.log("Task updated:", task);
  }
  closeModal();
}

function clearCompleted() {
  const completedTasks = tasks.filter((t) => t.completed);

  if (completedTasks.length === 0) {
    showToast("No completed tasks to clear", 1500);
    return;
  }

  if (
    confirm(
      `Delete ${completedTasks.length} completed task${completedTasks.length > 1 ? "s" : ""}?`,
    )
  ) {
    tasks = tasks.filter((t) => !t.completed);
    saveTasks();
    renderTasks();
    updateStats();
    showToast(
      `Cleared ${completedTasks.length} task${completedTasks.length > 1 ? "s" : ""}`,
    );
    console.log(`Cleared ${completedTasks.length} completed tasks`);
  }
}
