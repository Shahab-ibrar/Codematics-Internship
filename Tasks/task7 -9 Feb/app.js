
/* TASK 1 */
function ageToDays() {
  let dob = document.getElementById("dob").value;
  let result = document.getElementById("ageResult");

  if (dob === "") {
    result.innerText = "Please select date";
    return;
  }

  let birth = new Date(dob);
  let today = new Date();
  let days = Math.floor((today - birth) / (1000 * 60 * 60 * 24));

  result.innerText = "Age in days: " + days;
}

/* TASK 2 */
function hoursToSeconds() {
  let hours = document.getElementById("hours").value;
  let result = document.getElementById("hoursResult");

  if (hours === "") {
    result.innerText = "Enter hours";
    return;
  }

  result.innerText = "Seconds: " + (hours * 3600);
}

/* TASK 3 - Array */
function findNextInArray() {
  let arr = [10, 20, 30, 40, 50];
  let value = Number(document.getElementById("arrayInput").value);
  let result = document.getElementById("nextResult");

  let index = arr.indexOf(value);

  if (index === -1) {
    result.innerText = "Number not found in array";
  } else if (index === arr.length - 1) {
    result.innerText = "No next number";
  } else {
    result.innerText = "Next number is: " + arr[index + 1];
  }
}

/* TASK 3 - Single value */
function findNextSingle() {
  let value = Number(document.getElementById("singleInput").value);
  let result = document.getElementById("nextResult");

  if (isNaN(value)) {
    result.innerText = "Invalid number";
    return;
  }

  if (Number.isInteger(value)) {
    result.innerText = "Next integer: " + (value + 1);
  } else {
    result.innerText = "Next float: " + (value + 0.1).toFixed(1);
  }
}

/* TASK 4 */
function capitalizeName() {
  let name = document.getElementById("nameInput").value;
  let result = document.getElementById("nameResult");

  if (name === "") {
    result.innerText = "Enter name";
    return;
  }

  result.innerText =
    name.charAt(0).toUpperCase() + name.slice(1);
}

/* TASK 5 */
function calculateBMI() {
  let w = Number(document.getElementById("weight").value);
  let h = Number(document.getElementById("height").value);
  let result = document.getElementById("bmiResult");

  if (w <= 0 || h <= 0) {
    result.innerText = "Invalid input";
    return;
  }

  let bmi = (w / (h * h)).toFixed(2);
  result.innerText = "BMI: " + bmi;
}

/* TASK 6 */
function generateArray() {
  let arr = [];

  for (let i = 0; i < 5; i++) {
    arr.push(Math.floor(Math.random() * 100) + 1);
  }

  document.getElementById("array").innerText =
    "Array: [" + arr.join(", ") + "]";
  document.getElementById("first").innerText =
    "First: " + arr[0];
  document.getElementById("last").innerText =
    "Last: " + arr[arr.length - 1];
}

/* TASK 7 - Event Handling */
let num1 = document.getElementById("num1");
let num2 = document.getElementById("num2");
let sum = document.getElementById("sum");

function calculateSum() {
  let a = parseInt(num1.value);
  let b = parseInt(num2.value);
  sum.value = a + b;
}

num1.addEventListener("input", calculateSum);
num2.addEventListener("input", calculateSum);
