export function handleDragStart(e, task, setDraggedTask) {
    e.dataTransfer.effectAllowed = "move";
    setDraggedTask(task);
  }
  
  export function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }
  