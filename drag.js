let currentDraggedItem = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let activeDraggableIndex = 0;

const draggables = document.querySelectorAll('.draggable');
const dropZone = document.getElementById('dropZone');
const checkButton = document.querySelector('.check-button');

dropZone.addEventListener('dragover', dragOver);
dropZone.addEventListener('drop', drop);

draggables.forEach((item, index) => {
  item.addEventListener('dragstart', dragStart);
  item.addEventListener('touchstart', touchStart, { passive: true });
  item.addEventListener('touchmove', touchMove, { passive: false });
  item.addEventListener('touchend', touchEnd);
});

checkButton.addEventListener('click', () => {
  lockAndMove();
});

checkButton.addEventListener('touchstart', (e) => {
  e.preventDefault();
  lockAndMove();
});

function highlightActiveDraggable() {
  draggables.forEach((item) => {
    item.style.backgroundColor = '';
    item.style.pointerEvents = 'none';
  });
  if (draggables[activeDraggableIndex]) {
    const activeItem = draggables[activeDraggableIndex];
    activeItem.style.backgroundColor = 'gold';
    activeItem.style.pointerEvents = 'auto';
  }
}

function lockAndMove() {
  if (draggables[activeDraggableIndex]) {
    const currentItem = draggables[activeDraggableIndex];
    currentItem.style.pointerEvents = 'none';
    currentItem.style.backgroundColor = '';
  }
  activeDraggableIndex++;
  activeDraggableIndex++;
  if (activeDraggableIndex < draggables.length) {
    highlightActiveDraggable();
  } else {
    console.log("All items locked");
    checkButton.style.display = 'none';
  }
}

highlightActiveDraggable();


function dragStart(e) {
  if (e.target !== draggables[activeDraggableIndex]) return;
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
  currentDraggedItem.style.position = 'absolute';
  currentDraggedItem.style.left = `${offsetX}px`;
  currentDraggedItem.style.top = `${offsetY}px`;
  currentDraggedItem.style.display = 'block';
  dropZone.appendChild(currentDraggedItem);
  currentDraggedItem = null;
}


function touchStart(e) {
  if (e.target !== draggables[activeDraggableIndex]) return;
  currentDraggedItem = e.target;
  const rect = currentDraggedItem.getBoundingClientRect();
  const touch = e.touches[0];
  dragOffsetX = touch.clientX - rect.left;
  dragOffsetY = touch.clientY - rect.top;
  currentDraggedItem.style.position = 'absolute';
  currentDraggedItem.style.left = `${touch.clientX - dragOffsetX}px`;
  currentDraggedItem.style.top = `${touch.clientY - dragOffsetY}px`;
  currentDraggedItem.style.display = 'block';
}
function touchMove(e) {
  if (currentDraggedItem !== draggables[activeDraggableIndex]) return;
  e.preventDefault();
  const touch = e.touches[0];  
  const dropZoneRect = dropZone.getBoundingClientRect();
  const offsetX = touch.clientX - dropZoneRect.left - dragOffsetX;
  const offsetY = touch.clientY - dropZoneRect.top - dragOffsetY;
  currentDraggedItem.style.left = `${offsetX}px`;
  currentDraggedItem.style.top = `${offsetY}px`;
}
function touchEnd(e) {
  if (currentDraggedItem !== draggables[activeDraggableIndex]) return;
  const touch = e.changedTouches[0];
  const dropZoneRect = dropZone.getBoundingClientRect();
  const offsetX = touch.clientX - dropZoneRect.left - dragOffsetX;
  const offsetY = touch.clientY - dropZoneRect.top - dragOffsetY;
  currentDraggedItem.style.position = 'absolute';
  currentDraggedItem.style.left = `${offsetX}px`;
  currentDraggedItem.style.top = `${offsetY}px`;
  currentDraggedItem.style.display = 'block';
  dropZone.appendChild(currentDraggedItem);
  currentDraggedItem = null;
}