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
