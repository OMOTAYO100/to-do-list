"use strict"

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

// Form Submit Handler
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const task = input.value.trim();
  if (task !== "") {
    addTodo(task);
    input.value = "";
  }
});

// Add Task to List 
function addTodo(task, completed = false) {
  const li = document.createElement("li");
  li.className =
    "flex justify-between items-center bg-gray-50 border border-gray-200 rounded-md px-4 py-2";

  if (completed) {
    li.classList.add("opacity-50");
  }

  li.innerHTML = `
    <span class="task-text ${completed ? 'line-through' : ''}">${task}</span>
    <div class="flex gap-4">
      <button onclick="toggleDone(this)" class="text-green-600 hover:text-green-800">✔️</button>
      <button onclick="deleteTodo(this)" class="text-red-600 hover:text-red-800">❌</button>
    </div>
  `;

  list.appendChild(li);
  saveToLocalStorage();
}

// Toggle Task Done
function toggleDone(button) {
  const li = button.closest("li");
  li.classList.toggle("opacity-50");
  li.querySelector(".task-text").classList.toggle("line-through");
  saveToLocalStorage();
}

// Delete Task
function deleteTodo(button) {
  const li = button.closest("li");
  list.removeChild(li);
  saveToLocalStorage();
}

// Save Todos + Last Opened Date
function saveToLocalStorage() {
  const tasks = [];

  document.querySelectorAll("#todo-list li").forEach((li) => {
    tasks.push({
      text: li.querySelector(".task-text").textContent,
      completed: li.classList.contains("opacity-50"),
    });
  });

  localStorage.setItem("todos", JSON.stringify(tasks));
  saveLastOpenedDate();
}

// Save the Current Date
function saveLastOpenedDate() {
  const today = new Date().toLocaleDateString(); // e.g., "7/15/2025"
  localStorage.setItem("lastOpenedDate", today);
}

// Load and Reset If New Day
function loadFromLocalStorage() {
  const today = new Date().toLocaleDateString();
  const lastOpened = localStorage.getItem("lastOpenedDate");

  // If new day, reset todos
  if (lastOpened && lastOpened !== today) {
    localStorage.removeItem("todos");
  }

  // Save today's date
  saveLastOpenedDate();

  const savedTasks = JSON.parse(localStorage.getItem("todos")) || [];
  savedTasks.forEach((task) => {
    addTodo(task.text, task.completed);
  });
}

// Load On Page Start
window.addEventListener("DOMContentLoaded", loadFromLocalStorage);
