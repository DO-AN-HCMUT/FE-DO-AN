export default function getStatusString(_status: string) {
  return {
    TO_DO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
    TO_FIX: 'To Fix',
    FIXED: 'Fixed',
    TO_TEST: 'To Test',
    TESTING: 'Testing',
    TESTED: 'Tested',
    ERROR: 'Error',
    URGENT: 'URGENT',
  }[_status];
}
