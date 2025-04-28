import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import TaskCard from './TaskCard';
import { handleDragOver, handleDragStart } from '../../utils/dragDropUtils';
import { TASK_STATUS } from '../../constants/taskStatuses';
import { useTaskContext } from '../../context/TaskContext';

const TaskArea = ({ title, areaType, tasks }) => {
  const { 
    changeTaskStatus, 
    handleEdit, 
    handleDelete, 
    handleCompleteTask, 
    setSelectedTask, 
    setShowModal,
    draggedTask,
    setDraggedTask
  } = useTaskContext();

  const handleDrop = (e) => {
    e.preventDefault();
    
    if (draggedTask) {
      let newStatus;
      
      if (areaType === "active") {
        newStatus = TASK_STATUS.IN_PROGRESS;
      } else if (areaType === "paused") {
        newStatus = TASK_STATUS.PAUSED;
      }
      
      changeTaskStatus(
        draggedTask.id, 
        newStatus, 
        `Status alterado para ${newStatus} por arrasto`
      );
      
      setDraggedTask(null);
    }
  };

  return (
    <div className="mb-8">
      <h2 className={`text-lg font-semibold mb-4 ${
        areaType === "active" ? "text-blue-600" : "text-red-600"
      } flex items-center`}>
        {areaType === "active" ? <Clock size={18} className="mr-2" /> : <AlertCircle size={18} className="mr-2" />}
        {title}
      </h2>
      <div 
        className="flex overflow-x-auto pb-4 min-h-32 items-start"
        onDragOver={(e) => handleDragOver(e)}
        onDrop={handleDrop}
      >
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard 
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onComplete={handleCompleteTask}
              onClick={(task) => {
                setSelectedTask(task);
                setShowModal(true);
              }}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-300 min-w-64 flex-shrink-0 max-w-xs mr-4 flex items-center justify-center h-24 text-gray-400">
            Arraste tarefas para cá
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskArea;