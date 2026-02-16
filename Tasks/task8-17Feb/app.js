
//////////////////// SHOW / HIDE FUNCTION ////////////////////

function showSection(id) {

  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.add("hidden");
  });

  document.getElementById(id).classList.remove("hidden");

}

//////////////////// CAROUSEL ////////////////////

let slider = document.getElementById("slider");
let nextBtn = document.getElementById("next");
let prevBtn = document.getElementById("prev");

let index = 0;
let totalSlides = slider.children.length;
updateButtons();

nextBtn.addEventListener("click", () => {
  index++;

  if (index >= totalSlides) {
    index = totalSlides - 1; 
  }

  updateSlider();
});

prevBtn.addEventListener("click", () => {
  index--;

  if (index < 0) {
    index = 0; 
  }

  updateSlider();
});

function updateSlider() {
  slider.style.transform = `translateX(-${index * 100}%)`;
  updateButtons();
}

function updateButtons() {
  if (index === 0) {
    prevBtn.style.display = "none";
  } else {
    prevBtn.style.display = "block";
  }

  if (index === totalSlides - 1) {
    nextBtn.style.display = "none";
  } else {
    nextBtn.style.display = "block";
  }
}
//////////////////// CALCULATOR ////////////////////

let display = document.getElementById("display");

function appendValue(value) {
  let operators = ["+", "-", "*", "/"];
  let lastChar = display.value.slice(-1);

  if (display.value === "" && operators.includes(value)) return;

  if (operators.includes(lastChar) && operators.includes(value)) {
    display.value = display.value.slice(0, -1) + value;
    return;
  }

  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function calculate() {
  try {
    display.value = eval(display.value);
  } catch {
    display.value = "Error";
  }
}

//////////////////// CLOCK ////////////////////

let hoursEl = document.getElementById("hours");
let minutesEl = document.getElementById("minutes");
let secondsEl = document.getElementById("seconds");

function updateClock() {
  let now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  let ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  hoursEl.textContent = hours;
  minutesEl.textContent = minutes;
  secondsEl.textContent = seconds;

  document.getElementById("ampm").textContent = ampm;
}

setInterval(updateClock, 1000);
updateClock();

//////////////////// TEMPERATURE ////////////////////

function toCelsius() {
  let val = document.getElementById("tempInput").value;
  let result = (val - 32) * 5 / 9;
  document.getElementById("result").innerText = result.toFixed(2) + " °C";
}

function toFahrenheit() {
  let val = document.getElementById("tempInput").value;
  let result = (val * 9 / 5) + 32;
  document.getElementById("result").innerText = result.toFixed(2) + " °F";
}

//////////////////// PASSWORD ////////////////////

let passwordEl = document.getElementById("passwordField");

function generatePassword() {

  let upper = document.getElementById("upper").checked;
  let lower = document.getElementById("lower").checked;
  let numbers = document.getElementById("numbers").checked;
  let symbols = document.getElementById("symbols").checked;

  let chars = "";

  if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
  if (numbers) chars += "0123456789";
  if (symbols) chars += "!@#$%^&*()_+";

  if (chars === "") {
    alert("Please select at least one option");
    return;
  }

  let password = "";

  for (let i = 0; i < 12; i++) {
    let randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  passwordEl.value = password;
}

function copyPassword() {
  if (passwordEl.value === "") return;
  navigator.clipboard.writeText(passwordEl.value);
  alert("Password copied!");
}

//////////////////// TODO ////////////////////

let taskInput = document.getElementById("taskInput");
let taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {

    let li = document.createElement("li");

    li.className =
      "flex justify-between items-center bg-gray-100 p-2 rounded-lg";

    li.innerHTML = `
      <span onclick="toggleComplete(${index})"
        class="${task.completed ? 'line-through text-gray-500' : ''}">
        ${task.text}
      </span>

      <div class="space-x-2">
        <button onclick="editTask(${index})" class="text-blue-500">&#9998;</button>
        <button onclick="deleteTask(${index})" class="text-red-500">&#128465;</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

function addTask() {

  let text = taskInput.value.trim();

  if (text === "") return;

  tasks.push({
    text: text,
    completed: false
  });

  taskInput.value = "";

  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function editTask(index) {

  let newText = prompt("Edit task:", tasks[index].text);

  if (newText !== null) {
    tasks[index].text = newText;
    saveTasks();
    renderTasks();
  }
}

function toggleComplete(index) {

  tasks[index].completed = !tasks[index].completed;

  saveTasks();
  renderTasks();
}

renderTasks();
