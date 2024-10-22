let currentDraggedItem = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let isTouch = false;

const draggables = document.querySelectorAll('.draggable');
const dropZone = document.getElementById('dropZone');
const snapZone = document.getElementById('snapZone');

export let selectedDay = "";
export let selectedMonth = "";
export let selectedDayOfMonth = "";
export let selectedYear = "";

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
  
  if (isNearSnapZone(e.clientX, e.clientY)) {
    snapZone.innerHTML = currentDraggedItem.innerHTML;
    selectedDay = currentDraggedItem.innerText.trim();
    console.log('Selected day is now:', selectedDay); 
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
  if (isNearSnapZone(touch.clientX, touch.clientY)) {
    snapZone.innerHTML = currentDraggedItem.innerHTML; 
    selectedDay = currentDraggedItem.innerText.trim(); 
    console.log('Selected day is now:', selectedDay); 
    currentDraggedItem.style.display = 'none'; 
  } else {
    currentDraggedItem.style.position = 'absolute';
    currentDraggedItem.style.left = `${offsetX}px`;
    currentDraggedItem.style.top = `${offsetY}px`;
    dropZone.appendChild(currentDraggedItem);
  }
  currentDraggedItem = null;
}

function isNearSnapZone(x, y) {
  const snapRect = snapZone.getBoundingClientRect();
  const threshold = 50;
  return (
    x > snapRect.left - threshold &&
    x < snapRect.right + threshold &&
    y > snapRect.top - threshold &&
    y < snapRect.bottom + threshold
  );
}