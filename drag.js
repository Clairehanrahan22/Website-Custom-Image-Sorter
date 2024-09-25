const draggables = document.querySelectorAll('.draggable');
const dropZone = document.getElementById('dropZone');
const checkButton = document.querySelector('.check-button');

draggables.forEach(item => {
  item.addEventListener('dragstart', dragStart);
  item.addEventListener('touchstart', touchStart, { passive: true });
  item.addEventListener('touchmove', touchMove, { passive: false });
  item.addEventListener('touchend', touchEnd);
});

dropZone.addEventListener('dragover', dragOver);
dropZone.addEventListener('drop', drop);


checkButton.addEventListener('click', () => {
  console.log("Check button clicked");
  // Add your logic here for what should happen when clicked
});

// Optional: Add touch support for mobile devices
checkButton.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Prevents mouse event fallback
  console.log("Check button touched");
  // Add your logic here for what should happen when touched
});


let currentDraggedItem = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Drag start (mouse)
function dragStart(e) {
  currentDraggedItem = e.target;
  
  // Calculate the offset of the mouse relative to the dragged element
  const rect = currentDraggedItem.getBoundingClientRect();
  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;

  e.dataTransfer.setData('text/plain', e.target.id);
  setTimeout(() => {
    currentDraggedItem.style.display = 'none'; // Hide while dragging
  }, 0);
}

// Drag over (allow drop)
function dragOver(e) {
  e.preventDefault();
}

// Drop (mouse)
function drop(e) {
    e.preventDefault();
  
    const dropZoneRect = dropZone.getBoundingClientRect();
    
    const offsetX = e.clientX - dropZoneRect.left - dragOffsetX;
    const offsetY = e.clientY - dropZoneRect.top - dragOffsetY;
  
    // Position the dragged item
    currentDraggedItem.style.position = 'absolute';
    currentDraggedItem.style.left = `${offsetX}px`;
    currentDraggedItem.style.top = `${offsetY}px`;
    currentDraggedItem.style.display = 'block'; // Show it again

    // Append the item back to the drop zone
    dropZone.appendChild(currentDraggedItem);
    currentDraggedItem = null;
  }

  
  function touchStart(e) {
    currentDraggedItem = e.target;
    
    // Don't hide the item here. Let the user see what they're dragging.
    const rect = currentDraggedItem.getBoundingClientRect();
    const touch = e.touches[0];
    dragOffsetX = touch.clientX - rect.left;
    dragOffsetY = touch.clientY - rect.top;
  
    // Immediately update the position of the dragged item to follow the touch.
    currentDraggedItem.style.position = 'absolute';
    currentDraggedItem.style.left = `${touch.clientX - dragOffsetX}px`;
    currentDraggedItem.style.top = `${touch.clientY - dragOffsetY}px`;
    currentDraggedItem.style.display = 'block'; // Make sure it's visible
  }
  
  function touchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    
    const dropZoneRect = dropZone.getBoundingClientRect();
  
    // Update the dragged item's position as the user moves their finger.
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
  
    // Finalize the position
    currentDraggedItem.style.position = 'absolute';
    currentDraggedItem.style.left = `${offsetX}px`;
    currentDraggedItem.style.top = `${offsetY}px`;
    currentDraggedItem.style.display = 'block'; // Ensure it's visible
  
    // Append the item back to the drop zone
    dropZone.appendChild(currentDraggedItem);
  
    currentDraggedItem = null;
  }