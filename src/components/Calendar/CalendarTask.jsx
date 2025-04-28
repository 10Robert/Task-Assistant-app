import React from 'react';
import StatusIcon from '../UI/StatusIcon';
import { getPriorityColor, getTaskStatusColor } from '../../utils/formatUtils';
import { TASK_STATUS } from '../../constants/taskStatuses';

const CalendarTask = ({ task, onClick }) => {
  return (
    <div 
      key={task.id}
      className={`p-2 mb-2 rounded-md shadow-sm border-l-2 ${getTaskStatusColor(task.status)}`}
      onClick={() => onClick(task)}
    >
      <div className="flex items-center justify-between">
        <p className={`text-sm font-medium ${task.status === TASK_STATUS.COMPLETED ? "line-through text-gray-500" : ""}`}>
          {task.name}
        </p>
        <span className="text-xs text-gray-600">{task.dueTime || ""}</span>
      </div>
      <div className="flex items-center mt-1 justify-between">
        <span className={`text-xs ${getPriorityColor(task.priority)} px-1 py-0.5 rounded-sm`}>
          {task.priority}
        </span>
        <div className="flex items-center">
          <StatusIcon status={task.status} />
          <span className="ml-1 text-xs text-gray-500">{task.status}</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarTask;
