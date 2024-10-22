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

const nextButton = document.querySelector('.nextButton');
const dayOfWeekSpot = document.querySelectorAll('.dayOfWeekSpot');
const monthSpot = document.querySelectorAll('.monthSpot');
const dayOfMonthSpot = document.querySelector('.dayOfMonthSpot');
let currentStep = 1;
const totalSteps = 4;

dayjs().format();

const todayNumber = dayjs().day();
let today = '';
switch (todayNumber) {
  case 1: today = 'Monday'; break;
  case 2: today = 'Tuesday'; break;
  case 3: today = 'Wednesday'; break;
  case 4: today = 'Thursday'; break;
  default: today = 'Friday'; break;
}

const thisMonth = dayjs().month()
const todayDate = dayjs().date();
const thisYear = dayjs().year();
console.log(todayDate);

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
  return snapZones[currentStep - 1]; // Assuming steps are indexed 1 to totalSteps
}

function showStep(step) {
  for (let i = 1; i <= totalSteps; i++) {
      const stepElement = document.getElementById(`step${i}`);
      stepElement.style.display = i === step ? 'flex' : 'none';
  }
  const snapZone = getActiveSnapZone();
  const observer = new MutationObserver(() => {
    if (currentStep == 1) {
      if (today === selectedDay) {
        nextButton.style.display = 'block';
      } else {
        nextButton.style.display = 'none';
      }
    } else if (currentStep == 2) {
      if (todayMonth === selectedMonth) {
        nextButton.style.display = 'block';
      } else {
        nextButton.style.display = 'none';
      }
    } else if (currentStep == 3) {
      if (todayDate === selectedDayOfMonth) {
        nextButton.style.display = 'block';
      } else {
        nextButton.style.display = 'none';
      }
    } else if (currentStep == 4) {
      if (thisYear === selectedYear) {
        nextButton.style.display = 'block';
      } else {
        nextButton.style.display = 'none';
      }
    }
  });
  observer.observe(snapZone, { childList: true });
}
showStep(currentStep);

nextButton.addEventListener('click', () => {
  if (currentStep == 1) {
      currentStep++;
      showStep(currentStep);
      dayOfWeekSpot[0].innerText = selectedDay;
  } else if (currentStep == 2) {
      currentStep++;
      showStep(currentStep);
      dayOfWeekSpot[1].innerText = selectedDay;
      monthSpot[0].innerText = selectedMonth;
  } else if (currentStep == 3) {
      currentStep++;
      showStep(currentStep);
      dayOfWeekSpot[2].innerText = selectedDay;
      monthSpot[1].innerText = selectedMonth;
      dayOfMonthSpot.innerText = selectedDayOfMonth;
  } else if (currentStep == 4) {
      window.location.href = 'clothingPicker.html';
  }
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
  e.preventDefault();
  const dropZoneRect = dropZone.getBoundingClientRect();
  const offsetX = e.clientX - dropZoneRect.left - dragOffsetX;
  const offsetY = e.clientY - dropZoneRect.top - dragOffsetY;
  const activeSnapZone = getActiveSnapZone();
  if (isNearSnapZone(e.clientX, e.clientY, activeSnapZone)) {
      activeSnapZone.innerHTML = currentDraggedItem.innerHTML;
      if (currentStep == 1) {
        selectedDay = currentDraggedItem.innerText.trim();
      } else if (currentStep == 2) {
        selectedMonth = currentDraggedItem.innerText.trim();
      } else if (currentStep == 3) {
        selectedDayOfMonth = currentDraggedItem.innerText.trim();
        selectedDayOfMonth = parseInt(selectedDayOfMonth, 10);
      } else if (currentStep == 4) {
        selectedYear = currentDraggedItem.innerText.trim();
        selectedYear = parseInt(selectedYear, 10);
      }
      currentDraggedItem.style.display = 'none'; 
      console.log(selectedDayOfMonth);
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
  const touch = e.changedTouches[0];
  const dropZoneRect = dropZone.getBoundingClientRect();
  const offsetX = touch.clientX - dropZoneRect.left - dragOffsetX;
  const offsetY = touch.clientY - dropZoneRect.top - dragOffsetY;

  // Get the current active snap zone based on the step
  const activeSnapZone = getActiveSnapZone();

  if (isNearSnapZone(touch.clientX, touch.clientY, activeSnapZone)) {
    activeSnapZone.innerHTML = currentDraggedItem.innerHTML; 
    if (currentStep == 1) {
      selectedDay = currentDraggedItem.innerText.trim();
    } else if (currentStep == 2) {
      selectedMonth = currentDraggedItem.innerText.trim();
    } else if (currentStep == 3) {
      selectedDayOfMonth = currentDraggedItem.innerText.trim();
      selectedDayOfMonth = parseInt(selectedDayOfMonth, 10);
    } else if (currentStep == 4) {
      selectedYear = currentDraggedItem.innerText.trim();
      selectedYear = parseInt(selectedYear, 10);
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