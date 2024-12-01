import { TaskStatus } from './task-status';
import User from './user';

type Task = {
  _id: string;
  title: string;
  projectID: string;
  key: string;
  registeredMembers: User[];
  description: string;
  status: keyof typeof TaskStatus;
  endDate?: string;
  createdAt?: string;
};

export type CreateTaskRequestDto = {
  title: string;
  registeredMembers?: string[];
  status?: keyof typeof TaskStatus;
  endDate?: string;
};

export default Task;
