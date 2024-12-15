import Link from 'next/link';

import { NotificationType, NotificationEnum } from '@/types/notification';

type NotificationMessageProps = {
  type: NotificationType;
  authorName: string;
  target: any;
};

export default function NotificationMessage({ type, authorName, target }: NotificationMessageProps) {
  switch (type) {
    case NotificationEnum.TASK_ASSIGN:
      return (
        <div>
          <p>
            <span className='font-semibold'>{authorName}</span> assigned a task for you
          </p>
          <Link href={`/projects/tasks?projectId=${target.projectId}`}>
            <p className='text-nowrap font-semibold text-primary hover:text-primary/85'>{`[${target.key}] ${target.title}`}</p>
          </Link>
        </div>
      );

    case NotificationEnum.TASK_UNASSIGN:
      return (
        <div>
          <p>
            <span className='font-semibold'>{authorName}</span> unassigned you from a task
          </p>
          <Link href={`/projects/tasks?projectId=${target.projectId}`}>
            <p className='text-nowrap font-semibold text-primary hover:text-primary/85'>{`[${target.key}] ${target.title}`}</p>
          </Link>
        </div>
      );

    case NotificationEnum.TASK_COMMENT:
      return (
        <div>
          <p>
            <span className='font-semibold'>{authorName}</span> commented on a task
          </p>
          <Link href={`/projects/tasks?projectId=${target.projectId}`}>
            <p className='text-nowrap font-semibold text-primary hover:text-primary/85'>{`[${target.key}] ${target.title}`}</p>
          </Link>
        </div>
      );

    case NotificationEnum.TASK_UPDATE:
      return (
        <div>
          <p>
            <span className='font-semibold'>{authorName}</span> updated a task
          </p>
          <Link href={`/projects/tasks?projectId=${target.projectId}`}>
            <p className='text-nowrap font-semibold text-primary hover:text-primary/85'>{`[${target.key}] ${target.title}`}</p>
          </Link>
        </div>
      );

    case NotificationEnum.PROJECT_INVITE:
      return (
        <div>
          <p>
            <span className='font-semibold'>{authorName}</span> added you to a project
          </p>
          <Link href={`/projects/tasks?projectId=${target._id}`}>
            <p className='text-nowrap font-semibold text-primary hover:text-primary/85'>{`[${target.key}] ${target.name}`}</p>
          </Link>
        </div>
      );

    case NotificationEnum.PROJECT_REMOVE_MEMBER:
      return (
        <div>
          <p>
            <span className='font-semibold'>{authorName}</span> removed you from a project
          </p>
          <Link href={`/projects/tasks?projectId=${target._id}`}>
            <p className='text-nowrap font-semibold text-primary hover:text-primary/85'>{`[${target.key}] ${target.name}`}</p>
          </Link>
        </div>
      );
  }
}
