function preventDefault(e) {
  if (!e.target.classList.contains('draggable')) {
    e.preventDefault();
  }
}

window.addEventListener('touchmove', preventDefault, { passive: false });

let currentDraggedItem = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let activeDraggableIndex = 0;

const draggables = document.querySelectorAll('.draggable');
const dropZone = document.getElementById('dropZone');
const checkButton = document.querySelector('.check-button');
const undoButton = document.querySelector('.undo');

dropZone.addEventListener('dragover', dragOver);
dropZone.addEventListener('drop', drop);

draggables.forEach((item, index) => {
  item.addEventListener('dragstart', dragStart);
  item.addEventListener('touchstart', touchStart, { passive: false });
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

undoButton.addEventListener('click', () => {
  undo();
});

undoButton.addEventListener('touchstart', (e) => {
  e.preventDefault();
  undo();
});

function highlightActiveDraggable() {
  draggables.forEach((item) => {
    const highlight = item.querySelector('.highlight');
    if (highlight) {
      highlight.remove();
    }
    item.style.pointerEvents = 'none';
  });
  if (draggables[activeDraggableIndex]) {
    const activeItem = draggables[activeDraggableIndex];
    const highlight = document.createElement('div');
    highlight.classList.add('highlight');
    const itemRect = activeItem.getBoundingClientRect();
    highlight.style.position = 'absolute';
    highlight.style.width = `${(itemRect.width * 1.5)/2}px`; 
    highlight.style.height = `${itemRect.height/1.75}px`; 
    highlight.style.left = `${(itemRect.width * 0.125)}px`; 
    highlight.style.top = `${(itemRect.height * 0.25)}px`; 
    highlight.style.borderRadius = '50%';
    highlight.style.backgroundColor = 'gold';
    highlight.style.zIndex = '1'; 
    activeItem.style.position = 'relative';
    activeItem.appendChild(highlight);
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
    draggables.forEach((item) => {
      const highlight = item.querySelector('.highlight');
      if (highlight) {
        highlight.remove(); 
      }
      item.style.pointerEvents = 'none';
    });
  }
}

function undo() {
  if (activeDraggableIndex === 0) {
      // Do nothing if the index is 0
      return;
  } else {
      // Decrease activeDraggableIndex by 2 if it is not 0
      activeDraggableIndex -= 2;
      // Ensure the index doesn't go below 0
      if (activeDraggableIndex < 0) {
          activeDraggableIndex = 0;
      }
      // Call the function to highlight the active draggable item
      highlightActiveDraggable();
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
  const touch = e.clientX ? e : e.touches[0];
  dragOffsetX = touch.clientX - rect.left;
  dragOffsetY = touch.clientY - rect.top;
  currentDraggedItem.style.position = 'absolute';
  currentDraggedItem.style.left = `${touch.clientX - dragOffsetX}px`;
  currentDraggedItem.style.top = `${touch.clientY - dragOffsetY}px`;
}

function touchMove(e) {
  if (currentDraggedItem !== draggables[activeDraggableIndex]) return;
  e.preventDefault();
  const touch = e.clientX ? e : e.touches[0];
  const dropZoneRect = dropZone.getBoundingClientRect();
  const offsetX = touch.clientX - dropZoneRect.left - dragOffsetX;
  const offsetY = touch.clientY - dropZoneRect.top - dragOffsetY;
  currentDraggedItem.style.left = `${offsetX}px`;
  currentDraggedItem.style.top = `${offsetY}px`;
}

function touchEnd(e) {
  if (!currentDraggedItem) return;
  if (currentDraggedItem !== draggables[activeDraggableIndex]) return;
  const touch = e.clientX ? e : e.changedTouches[0];
  const dropZoneRect = dropZone.getBoundingClientRect();
  const offsetX = touch.clientX - dropZoneRect.left - dragOffsetX;
  const offsetY = touch.clientY - dropZoneRect.top - dragOffsetY;
  currentDraggedItem.style.position = 'absolute';
  currentDraggedItem.style.left = `${offsetX}px`;
  currentDraggedItem.style.top = `${offsetY}px`;
  dropZone.appendChild(currentDraggedItem);
  currentDraggedItem = null;
}