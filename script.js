// Task data structure
let tasks = [];

// DOM elements
let taskInput;
let addBtn;
let tasksContainer;

// Load tasks from localStorage
function loadTasks() {
    const stored = localStorage.getItem('taskflow_tasks');
    if (stored) {
        tasks = JSON.parse(stored);
        console.log(`Loaded ${tasks.length} tasks from storage`);
    } else {
        console.log('No saved tasks found, starting fresh');
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
    console.log(`Saved ${tasks.length} tasks to storage`);
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    taskInput = document.getElementById('taskInput');
    addBtn = document.getElementById('addBtn');
    tasksContainer = document.getElementById('tasksContainer');
    
    // Load existing tasks
    loadTasks();
    
    console.log('App initialized with', tasks.length, 'tasks');
});

// Add new task
function addTask() {
    const title = taskInput.value.trim();
    
    if (!title) {
        alert('Please enter a task');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        title: title,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };
    
    tasks.unshift(newTask); // Add to beginning of array
    saveTasks();
    renderTasks();
    
    taskInput.value = '';
    taskInput.focus();
    
    console.log('Task added:', newTask);
}

// Render tasks to UI (placeholder)
function renderTasks() {
    console.log('Rendering tasks...');
}

// Set up event listeners
function setupEventListeners() {
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
}

// Update DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    taskInput = document.getElementById('taskInput');
    addBtn = document.getElementById('addBtn');
    tasksContainer = document.getElementById('tasksContainer');
    
    // Load existing tasks
    loadTasks();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initial render
    renderTasks();
    
    console.log('App initialized with', tasks.length, 'tasks');
});