let currentDraggedItem = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

const draggables = document.querySelectorAll('.draggable');
const dropZone = document.getElementById('dropZone');
const snapZones = document.querySelectorAll('.snapZone');

let selectedDay = "";
let selectedMonth = "";
let selectedDayOfMonth = "";
let selectedYear = "";
let selectedYesterday = "";
let selectedTomorrow = "";

let stepComplete = false;

const nextButton = document.querySelector('.nextButton');
const dayOfWeekSpot = document.querySelectorAll('.dayOfWeekSpot');
const monthSpot = document.querySelectorAll('.monthSpot');
const dayOfMonthSpot = document.querySelectorAll('.dayOfMonthSpot');
const yearSpot = document.querySelector('.yearSpot');
const yesterdaySpot = document.querySelectorAll('.yesterday');
const tomorrowSpot = document.querySelector('.tomorrow');
let currentStep = 1;
const totalSteps = 6;

dayjs().format();

const todayNumber = dayjs().day();
let today = '';
let yesterday = '';
let tomorrow = '';
switch (todayNumber) {
  case 1: 
    today = "Monday"; 
    yesterday = "Sunday"; 
    tomorrow = "Tuesday";
    break;
  case 2: 
    today = "Tuesday"; 
    yesterday = "Monday"; 
    tomorrow = "Wednesday";
    break;
  case 3: 
    today = "Wednesday"; 
    yesterday = "Tuesday"; 
    tomorrow = "Thursday";
    break;
  case 4: 
    today = "Thursday"; 
    yesterday = "Wednesday"; 
    tomorrow = "Friday";
    break;
  default: 
    today = "Friday"; 
    yesterday = "Thursday"; 
    tomorrow = "Saturday";
    break;
}

const thisMonth = dayjs().month()
const todayDate = dayjs().date();
const thisYear = dayjs().year();

let todayMonth = '';
switch (thisMonth) {
  case 0: todayMonth = 'January'; break;
  case 1: todayMonth = 'February'; break;
  case 2: todayMonth = 'March'; break;
  case 3: todayMonth = 'April'; break;
  case 4: todayMonth = 'May'; break;
  case 5: todayMonth = 'June'; break;
  case 6: todayMonth = 'July'; break;
  case 7: todayMonth = 'August'; break;
  case 8: todayMonth = 'September'; break;
  case 9: todayMonth = 'October'; break;
  case 10: todayMonth = 'November'; break;
  default: todayMonth = 'December'; break;
}

function getActiveSnapZone() {
  return snapZones[currentStep - 1];
}

function showStep(step) {
  for (let i = 1; i <= totalSteps; i++) {
      const stepElement = document.getElementById(`step${i}`);
      stepElement.style.display = i === step ? 'flex' : 'none';
  }
  const snapZone = getActiveSnapZone();
  const observer = new MutationObserver(() => {
    if (currentStep == 1 && yesterday === selectedYesterday) {
      nextButton.style.display = 'block';
      stepComplete = true;
    } else if (currentStep == 2 && today === selectedDay) {
      nextButton.style.display = 'block';
      stepComplete = true;
    } else if (currentStep == 3 && todayMonth === selectedMonth) {
      nextButton.style.display = 'block';
      stepComplete = true;
    } else if (currentStep == 4 && todayDate === selectedDayOfMonth) {
      nextButton.style.display = 'block';
      stepComplete = true;
    } else if (currentStep == 5 && thisYear === selectedYear) {
      nextButton.style.display = 'block';
      stepComplete = true;
    } else if (currentStep == 6 && tomorrow === selectedTomorrow) {
      nextButton.style.display = 'block';
      stepComplete = true;
    } else {
      nextButton.style.display = 'none';
      stepComplete = false;
    }
  });
  observer.observe(snapZone, { childList: true });
}

showStep(currentStep);



nextButton.addEventListener('click', () => {
  if (currentStep == 1) {
    currentStep++;
    showStep(currentStep);
    yesterdaySpot[0].innerText = selectedYesterday;
    nextButton.style.display = 'none';
  } else if (currentStep == 2) {
    currentStep++;
    showStep(currentStep);
    yesterdaySpot[1].innerText = selectedYesterday;
    dayOfWeekSpot[0].innerText = selectedDay;
    nextButton.style.display = 'none';
  } else if (currentStep == 3) {
    currentStep++;
    showStep(currentStep);
    yesterdaySpot[2].innerText = selectedYesterday;
    dayOfWeekSpot[1].innerText = selectedDay;
    monthSpot[0].innerText = selectedMonth;
    nextButton.style.display = 'none';
  } else if (currentStep == 4) {
    currentStep++;
    showStep(currentStep);
    yesterdaySpot[3].innerText = selectedYesterday;
    dayOfWeekSpot[2].innerText = selectedDay;
    monthSpot[1].innerText = selectedMonth;
    dayOfMonthSpot[0].innerText = selectedDayOfMonth;
    nextButton.style.display = 'none';
  } else if (currentStep == 5) {
    currentStep++;
    showStep(currentStep);
    yesterdaySpot[4].innerText = selectedYesterday;
    dayOfWeekSpot[3].innerText = selectedDay;
    monthSpot[2].innerText = selectedMonth;
    dayOfMonthSpot[1].innerText = selectedDayOfMonth;
    yearSpot.innerText = selectedYear;
    nextButton.style.display = 'none';
  } else if (currentStep == 6) { 
    window.location.href = 'clothingPicker.html';
  }
  stepComplete = false
});


dropZone.addEventListener('dragover', dragOver);
dropZone.addEventListener('drop', drop);

draggables.forEach((item) => {
  item.addEventListener('dragstart', dragStart);
  item.addEventListener('touchstart', touchStart);
  item.addEventListener('touchmove', touchMove);
  item.addEventListener('touchend', touchEnd);
});

function dragStart(e) {
  if (stepComplete) return;
  currentDraggedItem = e.target;
  const rect = currentDraggedItem.getBoundingClientRect();
  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;
  e.dataTransfer.setData('text/plain', e.target.id);
  setTimeout(() => {
    currentDraggedItem.style.display = 'none';
  }, 0);
}
function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  if (stepComplete) return;
  e.preventDefault();
  const dropZoneRect = dropZone.getBoundingClientRect();
  const offsetX = e.clientX - dropZoneRect.left - dragOffsetX;
  const offsetY = e.clientY - dropZoneRect.top - dragOffsetY;
  const activeSnapZone = getActiveSnapZone();
  if (isNearSnapZone(e.clientX, e.clientY, activeSnapZone)) {
      activeSnapZone.innerHTML = currentDraggedItem.innerHTML;
      if (currentStep == 1) {
        selectedYesterday = currentDraggedItem.innerText.trim();
      } else if (currentStep == 2) {
        selectedDay = currentDraggedItem.innerText.trim();
      } else if (currentStep == 3) {
        selectedMonth = currentDraggedItem.innerText.trim();
      } else if (currentStep == 4) {
        selectedDayOfMonth = currentDraggedItem.innerText.trim();
        selectedDayOfMonth = parseInt(selectedDayOfMonth, 10);
      } else if (currentStep == 5) {
        selectedYear = currentDraggedItem.innerText.trim();
        selectedYear = parseInt(selectedYear, 10);
      } else if (currentStep == 6) {
        selectedTomorrow = currentDraggedItem.innerText.trim();
      }
      currentDraggedItem.style.display = 'none'; 
  } else {
      currentDraggedItem.style.position = 'absolute';
      currentDraggedItem.style.left = `${offsetX}px`;
      currentDraggedItem.style.top = `${offsetY}px`;
      currentDraggedItem.style.display = 'block';
      dropZone.appendChild(currentDraggedItem);
  }
  currentDraggedItem = null;
}

function touchStart(e) {
  if (stepComplete) return;
  currentDraggedItem = e.target;
  const rect = currentDraggedItem.getBoundingClientRect();
  const touch = e.touches[0];
  dragOffsetX = touch.clientX - rect.left;
  dragOffsetY = touch.clientY - rect.top;
  currentDraggedItem.style.position = 'absolute';
  currentDraggedItem.style.left = `${touch.clientX - dragOffsetX}px`;
  currentDraggedItem.style.top = `${touch.clientY - dragOffsetY}px`;
}

function touchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const dropZoneRect = dropZone.getBoundingClientRect();
  const offsetX = touch.clientX - dropZoneRect.left - dragOffsetX;
  const offsetY = touch.clientY - dropZoneRect.top - dragOffsetY;
  currentDraggedItem.style.left = `${offsetX}px`;
  currentDraggedItem.style.top = `${offsetY}px`;
}

function touchEnd(e) {
  if (stepComplete) return;
  const touch = e.changedTouches[0];
  const dropZoneRect = dropZone.getBoundingClientRect();
  const offsetX = touch.clientX - dropZoneRect.left - dragOffsetX;
  const offsetY = touch.clientY - dropZoneRect.top - dragOffsetY;
  const activeSnapZone = getActiveSnapZone();
  if (isNearSnapZone(touch.clientX, touch.clientY, activeSnapZone)) {
    activeSnapZone.innerHTML = currentDraggedItem.innerHTML; 
    if (currentStep == 1) {
      selectedYesterday = currentDraggedItem.innerText.trim();
    } else if (currentStep == 2) {
      selectedDay = currentDraggedItem.innerText.trim();
    } else if (currentStep == 3) {
      selectedMonth = currentDraggedItem.innerText.trim();
    } else if (currentStep == 4) {
      selectedDayOfMonth = currentDraggedItem.innerText.trim();
      selectedDayOfMonth = parseInt(selectedDayOfMonth, 10);
    } else if (currentStep == 5) {
      selectedYear = currentDraggedItem.innerText.trim();
      selectedYear = parseInt(selectedYear, 10);
    } else if (currentStep == 6) {
      selectedTomorrow = currentDraggedItem.innerText.trim();
    } 
    currentDraggedItem.style.display = 'none'; 
  } else {
    currentDraggedItem.style.position = 'absolute';
    currentDraggedItem.style.left = `${offsetX}px`;
    currentDraggedItem.style.top = `${offsetY}px`;
    dropZone.appendChild(currentDraggedItem);
  }
  currentDraggedItem = null;
}

function isNearSnapZone(x, y, snapZone) {
  const snapRect = snapZone.getBoundingClientRect();
  const threshold = 50;
  return (
      x > snapRect.left - threshold &&
      x < snapRect.right + threshold &&
      y > snapRect.top - threshold &&
      y < snapRect.bottom + threshold
  );
}