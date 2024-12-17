import User from './user';

export type Notification = {
  _id: string;
  recipientId: string;
  type: NotificationType;
  author: User;
  target: any;
  isRead: boolean;
  createdAt: string;
};

export const NotificationEnum = {
  TASK_UPDATE: 'TASK_UPDATE',
  TASK_COMMENT: 'TASK_COMMENT',
  TASK_ASSIGN: 'TASK_ASSIGN',
  TASK_UNASSIGN: 'TASK_UNASSIGN',
  PROJECT_INVITE: 'PROJECT_INVITE',
  PROJECT_REMOVE_MEMBER: 'PROJECT_REMOVE_MEMBER',
} as const;

export type NotificationType = (typeof NotificationEnum)[keyof typeof NotificationEnum];
