import { TASK_STATUS_COLOR } from '@/constants/common';
import getStatusString from '@/utils/get-status-string';

import TaskStatusType from '@/types/task-status';

export default function TaskStatus({ status }: { status: TaskStatusType }) {
  return (
    <div style={TASK_STATUS_COLOR[status]} className='inline rounded bg-green px-2 py-1 font-semibold text-white'>
      {getStatusString(status)}
    </div>
  );
}
