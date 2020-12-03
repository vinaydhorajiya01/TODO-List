// Get DOM elements
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize tasks array from localStorage or empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to create a new task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const task = {
        id: Date.now(),
        text: taskText,
        status: 'todo',
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
}

// Function to delete a task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}

// Function to toggle task completion
function toggleTask(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// Function to update task status
function updateTaskStatus(taskId, newStatus) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, status: newStatus };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// Function to filter tasks
function filterTasks(filter) {
    currentFilter = filter;
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === filter) {
            btn.classList.add('active');
        }
    });
    renderTasks();
}

// Function to render tasks
function renderTasks() {
    let filteredTasks = tasks;
    
    // Apply filter
    if (currentFilter !== 'all') {
        filteredTasks = tasks.filter(task => task.status === currentFilter);
    }

    // Sort tasks by creation date (newest first)
    filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    taskList.innerHTML = '';
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onclick="toggleTask(${task.id})">
            <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
            <select onchange="updateTaskStatus(${task.id}, this.value)">
                <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>Todo</option>
                <option value="inprogress" ${task.status === 'inprogress' ? 'selected' : ''}>In Progress</option>
                <option value="done" ${task.status === 'done' ? 'selected' : ''}>Done</option>
            </select>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

// Add event listener for Enter key in input field
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initial render
renderTasks();