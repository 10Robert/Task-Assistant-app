import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { TASK_STATUS } from '../../constants/taskStatuses';

const StatusIcon = ({ status }) => {
  switch (status) {
    case TASK_STATUS.COMPLETED:
      return <CheckCircle2 className="text-green-500" />;
    case TASK_STATUS.IN_PROGRESS:
      return <Clock className="text-blue-500" />;
    case TASK_STATUS.PENDING:
      return <AlertCircle className="text-yellow-500" />;
    case TASK_STATUS.PAUSED:
      return <AlertCircle className="text-red-500" />;
    default:
      return null;
  }
};

export default StatusIcon;