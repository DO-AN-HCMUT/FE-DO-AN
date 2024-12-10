export default function getStatusString(_status: string) {
  return {
    TO_DO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
    OVERDUE: 'Overdue',
  }[_status];
}
