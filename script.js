const taskInput = document.getElementById("taskInput");
const deadlineInput = document.getElementById("deadlineInput");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const lightDarkButton = document.getElementById("lightDark");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentEditId = null;

addTaskButton.addEventListener("click", function() {
  if (currentEditId !== null) {
    updateTask(currentEditId);
  } else {
    addTask();
  }
});

lightDarkButton.addEventListener("click", toggleTheme);

function loadTasks() {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    renderTask(task);
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const taskText = taskInput.value.trim();
  const deadline = deadlineInput.value;

  if (taskText === "") return;

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false,
    deadline: deadline || null
  };

  tasks.push(task);
  saveTasks();
  renderTask(task);
  clearForm();
}

function updateTask(id) {
  const task = tasks.find(t => t.id === id);
  task.text = taskInput.value.trim();
  task.deadline = deadlineInput.value || null;
  
  saveTasks();
  loadTasks();
  clearForm();
  currentEditId = null;
  addTaskButton.textContent = "Add Task";
}

function renderTask(task) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.id = task.id;

  const taskWrapper = document.createElement("div");
  taskWrapper.className = "task-text-wrapper";

  const taskPara = document.createElement("p");
  taskPara.className = "task-text";
  taskPara.textContent = task.text;

  taskPara.addEventListener("click", () => {
    task.completed = !task.completed;
    taskPara.classList.toggle("completed", task.completed);
    saveTasks();
  });

  taskWrapper.appendChild(taskPara);

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "task-actions";

  const deadlineSpan = document.createElement("span");
  deadlineSpan.className = "task-deadline";
  deadlineSpan.textContent = formatDate(task.deadline);
  
  if (task.deadline && isPastDeadline(task.deadline)) {
    deadlineSpan.classList.add("past-deadline");
  }

  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => {
    currentEditId = task.id;
    taskInput.value = task.text;
    deadlineInput.value = task.deadline || "";
    addTaskButton.textContent = "Update Task";
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
    li.remove();
  });

  actionsDiv.append(deadlineSpan, editBtn, deleteBtn);
  li.append(taskWrapper, actionsDiv);
  taskList.appendChild(li);
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-UK", {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function isPastDeadline(deadline) {
  if (!deadline) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(deadline) < today;
}

function clearForm() {
  taskInput.value = "";
  deadlineInput.value = "";
}

function toggleTheme() {
  document.body.classList.toggle("dark");

  lightDarkButton.textContent =
    document.body.classList.contains("dark") ? "Light" : "Dark";

  const isDarkMode = document.body.classList.contains("dark");
  lightDarkButton.style.backgroundColor = isDarkMode ? "#f0f0f0" : "#333";
  lightDarkButton.style.color = isDarkMode ? "black" : "white";

  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  lightDarkButton.textContent = "Light";
  lightDarkButton.style.backgroundColor = "#f0f0f0";
  lightDarkButton.style.color = "black";
} else {
  lightDarkButton.textContent = "Dark";
  lightDarkButton.style.backgroundColor = "#333";
  lightDarkButton.style.color = "white";
}

loadTasks();