import { TASK_PRIORITY, ALL_PRIORITIES } from '../constants/taskPriorities';

export function getPriorityColor(priority) {
  switch (priority) {
    case TASK_PRIORITY.HIGH:
      return "bg-red-100 text-red-800";
    case TASK_PRIORITY.MEDIUM:
      return "bg-yellow-100 text-yellow-800";
    case TASK_PRIORITY.LOW:
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getTaskStatusColor(status) {
  switch (status) {
    case ALL_PRIORITIES.COMPLETED:
      return "border-green-500 bg-green-50";
    case ALL_PRIORITIES.PAUSED:
      return "border-red-500";
    case ALL_PRIORITIES.IN_PROGRESS:
      return "border-blue-500";
    case ALL_PRIORITIES.PENDING:
    default:
      return "border-yellow-500";
  }
}

export function getTaskBadgeColor(status) {
  switch (status) {
    case ALL_PRIORITIES.COMPLETED:
      return "bg-green-100 text-green-800";
    case ALL_PRIORITIES.PAUSED:
      return "bg-red-100 text-red-800";
    case ALL_PRIORITIES.IN_PROGRESS:
      return "bg-blue-100 text-blue-800";
    case ALL_PRIORITIES.PENDING:
    default:
      return "bg-yellow-100 text-yellow-800";
  }
}