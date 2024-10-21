let currentDraggedItem = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let isTouch = false;

const draggables = document.querySelectorAll('.draggable');
const dropZone = document.getElementById('dropZone');
const snapZone = document.getElementById('snapZone');

// Variable to hold the selected day
let selectedDay = "";

// Add event listeners
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
  
  // Snap logic
  if (isNearSnapZone(e.clientX, e.clientY)) {
    snapZone.innerHTML = currentDraggedItem.innerHTML; // Snap the item to snap zone
    selectedDay = currentDraggedItem.innerText.trim(); // Update selectedDay with the dropped item's text
    console.log('Selected day is now:', selectedDay); // You can use this or display it somewhere
    currentDraggedItem.style.display = 'none'; // Hide the original item
  } else {
    currentDraggedItem.style.position = 'absolute';
    currentDraggedItem.style.left = `${offsetX}px`;
    currentDraggedItem.style.top = `${offsetY}px`;
    currentDraggedItem.style.display = 'block';
    dropZone.appendChild(currentDraggedItem);
  }
  currentDraggedItem = null;
}

// Touch events
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
  
  // Snap logic for touch
  if (isNearSnapZone(touch.clientX, touch.clientY)) {
    snapZone.innerHTML = currentDraggedItem.innerHTML; // Snap the item to snap zone
    selectedDay = currentDraggedItem.innerText.trim(); // Update selectedDay with the dropped item's text
    console.log('Selected day is now:', selectedDay); // You can use this or display it somewhere
    currentDraggedItem.style.display = 'none'; // Hide the original item
  } else {
    currentDraggedItem.style.position = 'absolute';
    currentDraggedItem.style.left = `${offsetX}px`;
    currentDraggedItem.style.top = `${offsetY}px`;
    dropZone.appendChild(currentDraggedItem);
  }
  currentDraggedItem = null;
}

// Utility function to check if the element is near the snap zone
function isNearSnapZone(x, y) {
  const snapRect = snapZone.getBoundingClientRect();
  const threshold = 50; // Adjust threshold for how close it needs to be to snap
  return (
    x > snapRect.left - threshold &&
    x < snapRect.right + threshold &&
    y > snapRect.top - threshold &&
    y < snapRect.bottom + threshold
  );
}