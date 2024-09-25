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
  // Remove any existing highlight for all items
  draggables.forEach((item) => {
    const highlight = item.querySelector('.highlight');  // Check if highlight exists
    if (highlight) {
      highlight.remove();  // Remove the existing highlight
    }
    item.style.pointerEvents = 'none';  // Disable interaction for non-active items
  });
  
  // Add highlight to the active draggable item
  if (draggables[activeDraggableIndex]) {
    const activeItem = draggables[activeDraggableIndex];
    console.log(activeDraggableIndex);
    // Create a new highlight element
    const highlight = document.createElement('div');
    highlight.classList.add('highlight');
    
    // Apply dynamic size and positioning
    const itemRect = activeItem.getBoundingClientRect();
    highlight.style.position = 'absolute';
    highlight.style.width = `${itemRect.width * 1.25}px`;  // 25% larger
    highlight.style.height = `${itemRect.height * 1.25}px`; // 25% larger
    highlight.style.left = `-${(itemRect.width * 0.125)}px`;  // Adjust position to center
    highlight.style.top = `-${(itemRect.height * 0.125)}px`;   // Adjust position to center
    highlight.style.borderRadius = '50%';
    highlight.style.backgroundColor = 'gold';
    highlight.style.zIndex = '-1';  // Ensure it appears behind the image

    // Append the highlight behind the active draggable item
    activeItem.style.position = 'relative';  // Ensure the active item is a positioned container
    activeItem.appendChild(highlight);  // Append highlight to the active item

    // Enable interaction for the active item
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
  console.log(activeDraggableIndex);
  if (activeDraggableIndex < draggables.length) {
    highlightActiveDraggable();
  } else {
    console.log("All items locked");
    checkButton.style.display = 'none';
    draggables.forEach((item) => {
      const highlight = item.querySelector('.highlight');  // Check if highlight exists
      if (highlight) {
        highlight.remove();  // Remove the existing highlight
      }
      item.style.pointerEvents = 'none';
    });
  }
}

window.onload = function() {
  activeDraggableIndex = 0;  // Ensure starting at the correct index
  highlightActiveDraggable();  // Highlight the first draggable on load
};

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