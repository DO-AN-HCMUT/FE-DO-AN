import User from './user';

export type Comment = {
  _id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  hasUpdated: boolean;
};

export type GetCommentsDto = (Comment & { author: User })[];
