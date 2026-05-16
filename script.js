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