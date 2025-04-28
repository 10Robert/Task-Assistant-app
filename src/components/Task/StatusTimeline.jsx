import React from 'react';
import { formatDate } from '../../utils/dateUtils';
import { getTaskBadgeColor } from '../../utils/formatUtils';

const StatusTimeline = ({ history }) => {
  return (
    <div className="mt-4 pt-3 border-t border-gray-200">
      <h3 className="text-sm font-medium mb-2 text-gray-700">Histórico de Status:</h3>
      <div className="space-y-3">
        {history.map((entry, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 h-4 w-4 mt-1 relative">
              <div className={`h-4 w-4 rounded-full ${
                entry.status === "Concluída" ? "bg-green-500" : 
                entry.status === "Pausada" ? "bg-red-500" :
                entry.status === "Em andamento" ? "bg-blue-500" :
                "bg-yellow-500"
              }`}></div>
              {index < history.length - 1 && (
                <div className="absolute top-4 left-1/2 w-px h-6 -ml-px bg-gray-300"></div>
              )}
            </div>
            <div className="ml-3">
              <div className="flex items-center">
                <span className="text-xs font-medium text-gray-700">
                  {formatDate(entry.date)}
                </span>
                <span className={`ml-2 text-xs py-0.5 px-1.5 rounded-full ${getTaskBadgeColor(entry.status)}`}>
                  {entry.status}
                </span>
              </div>
              {entry.notes && (
                <p className="text-xs text-gray-600 mt-0.5">
                  {entry.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusTimeline;
