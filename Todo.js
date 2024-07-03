document.addEventListener('DOMContentLoaded', loadTasks);

function Add() {
    const taskInput = document.getElementById('inp');
    const taskText = taskInput.value.trim();
    if (taskText === '') return;
    
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    addTaskToDOM(task);
    saveTask(task);
    taskInput.value = '';
}

function addTaskToDOM(task) {
    const taskList = document.getElementById('task-list');
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.setAttribute('data-id', task.id);
    
    taskItem.innerHTML = `
        <input type="checkbox" class="check" onclick="toggleTask(${task.id})" ${task.completed ? 'checked' : ''}>
        <span class="task-text ${task.completed ? 'completed' : ''}" onclick="editTask(${task.id})">${task.text}</span>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
    `;
    
    taskList.appendChild(taskItem);
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task));
}

function toggleTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            task.completed = !task.completed;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    filterTasks(document.querySelector('.filters .active').dataset.filter);
}

function deleteTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.querySelector(`[data-id='${taskId}']`).remove();
}

function editTask(taskId) {
    const taskText = document.querySelector(`[data-id='${taskId}'] .task-text`);
    const newTaskText = prompt('Edit your task', taskText.innerText);
    if (newTaskText !== null) {
        taskText.innerText = newTaskText;
        let tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                task.text = newTaskText;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function filterTasks(filter) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    
    tasks
        .filter(task => {
            if (filter === 'all') return true;
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
        })
        .forEach(task => addTaskToDOM(task));

    document.querySelectorAll('.filters button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`[onclick="filterTasks('${filter}')"]`).classList.add('active');
}
