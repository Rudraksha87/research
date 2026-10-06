import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export const ErrorMessage = ({ message = 'An unexpected error occurred.', onRetry }) => {
  return (
    <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 text-rose-300 flex items-start gap-3 my-4">
      <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-rose-200">System Error</h4>
        <p className="text-sm text-rose-300/90 mt-0.5">{message}</p>
      </div>
      {onRetry && (
        <Button size="sm" variant="danger" onClick={onRetry} icon={RefreshCw}>
          Retry
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
