// Motivational Quotes
const quotes = [
  "You're cooler than you think!",
  "Productivity is power!",
  "Adventure awaits around every corner!",
  "Small steps lead to big wins!",
  "You got this! 💪",
  "Make today legendary!",
  "The world needs your sparkle! ✨",
  "Be the hero of your own story!",
  "Dream big, start small!",
  "You're one step closer to awesome!"
];

// Load saved tasks from localStorage
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  setRandomQuote();
  initializeCalendar();

  // Event listeners for calendar navigation
  document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  // Add sparkle effects to random elements periodically
  setInterval(addRandomSparkle, 3000);
});

function addRandomSparkle() {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';

  // Position randomly in the app
  const appContainer = document.querySelector('.app-container');
  const rect = appContainer.getBoundingClientRect();

  sparkle.style.left = `${Math.random() * rect.width}px`;
  sparkle.style.top = `${Math.random() * rect.height}px`;

  appContainer.appendChild(sparkle);

  // Remove after animation
  setTimeout(() => sparkle.remove(), 2000);
}

function setRandomQuote() {
  const quoteElement = document.getElementById('motivational-quote');
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteElement.textContent = `"${randomQuote}"`;

  // Change quote every 30 seconds
  setTimeout(setRandomQuote, 30000);
}

// Toggle Weekly Challenges visibility
function toggleChallenges() {
  const content = document.getElementById('challenges-content');
  content.classList.toggle('hidden');

  const icon = document.querySelector('.section.adventure-glow .fa-caret-down');
  if (content.classList.contains('hidden')) {
    icon.classList.remove('fa-caret-down');
    icon.classList.add('fa-caret-right');
  } else {
    icon.classList.remove('fa-caret-right');
    icon.classList.add('fa-caret-down');
  }
}

// Add Priority Task
function addPriorityTask() {
  const taskInput = document.getElementById('priority-task');
  const whyInput = document.getElementById('priority-why');
  const taskList = document.getElementById('priority-list');

  if (taskInput.value.trim() === '') {
    shakeInput(taskInput);
    return;
  }

  const li = document.createElement('li');
  li.innerHTML = `
        <span>${taskInput.value} <small class="why-text">(Mission: ${whyInput.value})</small></span>
        <button class="delete-btn" onclick="deleteTask(this)"><i class="fas fa-check"></i></button>
    `;
  li.style.animation = 'float-up 0.3s ease-out';
  taskList.appendChild(li);

  saveTasks();
  taskInput.value = '';
  whyInput.value = '';

  // Add focus back to input
  taskInput.focus();
}

// Add Weekly Challenge
function addChallenge() {
  const challengeInput = document.getElementById('challenge-task');
  const challengeList = document.getElementById('challenges-list');

  if (challengeInput.value.trim() === '') {
    shakeInput(challengeInput);
    return;
  }

  const li = document.createElement('li');
  li.innerHTML = `
        <span>${challengeInput.value}</span>
        <button class="delete-btn" onclick="deleteTask(this)"><i class="fas fa-check"></i></button>
    `;
  li.style.animation = 'float-up 0.3s ease-out';
  challengeList.appendChild(li);

  saveTasks();
  challengeInput.value = '';
  challengeInput.focus();
}

// Shake input when empty
function shakeInput(input) {
  input.classList.add('shake');
  setTimeout(() => input.classList.remove('shake'), 500);
}

// Delete Task (Mark as Complete)
function deleteTask(button) {
  const li = button.parentElement;
  li.classList.add('completed');

  // Celebrate completion
  setTimeout(() => {
    celebrate();
    li.remove();
    saveTasks();
  }, 300);
}

// Celebration Animation - FIXED VERSION
function celebrate() {
  const celebration = document.getElementById('celebration');

  // Create confetti elements
  for (let i = 0; i < 3; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    celebration.appendChild(confetti);
  }

  // Show celebration
  celebration.classList.add('show');

  // Hide after animation
  setTimeout(() => {
    celebration.classList.remove('show');
    // Remove confetti
    celebration.querySelectorAll('.confetti').forEach(c => c.remove());
  }, 1500);
}

// Save Tasks to localStorage
function saveTasks() {
  const priorityTasks = document.getElementById('priority-list').innerHTML;
  const challenges = document.getElementById('challenges-list').innerHTML;
  localStorage.setItem('priorityTasks', priorityTasks);
  localStorage.setItem('challenges', challenges);
}

// Load Tasks from localStorage
function loadTasks() {
  const priorityTasks = localStorage.getItem('priorityTasks');
  const challenges = localStorage.getItem('challenges');
  if (priorityTasks) document.getElementById('priority-list').innerHTML = priorityTasks;
  if (challenges) document.getElementById('challenges-list').innerHTML = challenges;
}

/* Calendar Functionality */
let currentDate = new Date();
let selectedDate = new Date();

function initializeCalendar() {
  renderCalendar();
  selectDate(new Date());
}

function renderCalendar() {
  const monthYear = document.getElementById('current-month');
  monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' }).toUpperCase()} ${currentDate.getFullYear()}`;

  const calendarDays = document.getElementById('calendar-days');
  calendarDays.innerHTML = '';

  // Add day headers
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  days.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'day-header';
    dayHeader.textContent = day;
    calendarDays.appendChild(dayHeader);
  });

  // Get first day of month and total days
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  // Add empty cells for days before first day
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day empty';
    calendarDays.appendChild(emptyDay);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;

    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    // Check if day is today
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      dayElement.classList.add('today');
    }

    // Check if day is selected
    if (date.toDateString() === selectedDate.toDateString()) {
      dayElement.classList.add('selected');
    }

    // Check if day has events
    if (hasEvents(date)) {
      dayElement.classList.add('has-events');
    }

    dayElement.addEventListener('click', () => selectDate(date));
    calendarDays.appendChild(dayElement);
  }
}

function selectDate(date) {
  selectedDate = date;
  renderCalendar();

  // Update selected date display
  const selectedDateElement = document.getElementById('selected-date');
  if (isToday(date)) {
    selectedDateElement.textContent = "TODAY'S";
  } else {
    selectedDateElement.textContent = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    }).toUpperCase() + "'S";
  }

  // Load events for selected date
  loadEvents();
}

function isToday(date) {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function hasEvents(date) {
  const events = JSON.parse(localStorage.getItem('calendarEvents') || '{}');
  const dateKey = date.toDateString();
  return events[dateKey] && events[dateKey].length > 0;
}

function addEvent() {
  const eventInput = document.getElementById('new-event');
  const eventText = eventInput.value.trim();

  if (!eventText) {
    shakeInput(eventInput);
    return;
  }

  // Get or create events for selected date
  const events = JSON.parse(localStorage.getItem('calendarEvents') || '{}');
  const dateKey = selectedDate.toDateString();

  if (!events[dateKey]) {
    events[dateKey] = [];
  }

  events[dateKey].push(eventText);
  localStorage.setItem('calendarEvents', JSON.stringify(events));

  // Refresh display
  loadEvents();
  renderCalendar();

  // Create a little animation for the new event
  const eventList = document.getElementById('events-list');
  if (eventList.lastElementChild) {
    eventList.lastElementChild.style.animation = 'none';
    void eventList.lastElementChild.offsetWidth; // Trigger reflow
    eventList.lastElementChild.style.animation = 'float-up 0.3s ease-out';
  }

  eventInput.value = '';
  eventInput.focus();
}

function loadEvents() {
  const eventsList = document.getElementById('events-list');
  eventsList.innerHTML = '';

  const events = JSON.parse(localStorage.getItem('calendarEvents') || '{}');
  const dateKey = selectedDate.toDateString();

  if (events[dateKey]) {
    events[dateKey].forEach((event, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
                <span>${event}</span>
                <span class="delete-event" onclick="deleteEvent(${index})"><i class="fas fa-times"></i></span>
            `;
      li.style.animation = 'float-up 0.3s ease-out';
      eventsList.appendChild(li);
    });
  }
}

function deleteEvent(index) {
  const events = JSON.parse(localStorage.getItem('calendarEvents') || '{}');
  const dateKey = selectedDate.toDateString();

  if (events[dateKey]) {
    events[dateKey].splice(index, 1);
    localStorage.setItem('calendarEvents', JSON.stringify(events));
    loadEvents();
    renderCalendar();
  }
}

// Update streak counter (simplified example)
function updateStreak() {
  // In a real app, you would calculate this based on actual usage
  const streakElement = document.getElementById('streak');
  const currentStreak = parseInt(streakElement.textContent);
  streakElement.textContent = currentStreak + 1;
}

// Initialize streak counter
setTimeout(updateStreak, 2000);
