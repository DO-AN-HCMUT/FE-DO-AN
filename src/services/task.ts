import api from './api';

import { GetCommentsDto } from '@/types/comment';
import Response from '@/types/response';
import { GetMyTaskDto } from '@/types/task';

const BASE_URL = '/task';

const getMyTasks = async (search?: string, isDueToday?: boolean) => {
  return (
    await api.get<Response<GetMyTaskDto>>(
      `${BASE_URL}/getAll?${search ? `search=${search}` : ''}${isDueToday ? `&dueToday=${isDueToday}` : ''}`,
    )
  ).data.payload;
};

const getComments = async (taskId: string) => {
  return (await api.get<Response<GetCommentsDto>>(`${BASE_URL}/${taskId}/comments`)).data.payload;
};

const addComment = async (taskId: string, comment: string) => {
  return (await api.post<Response<void>>(`${BASE_URL}/${taskId}/comment`, { content: comment })).data.payload;
};

const updateComment = async (commentId: string, comment: string) => {
  return (await api.put<Response<void>>(`${BASE_URL}/comments/${commentId}`, { content: comment })).data.payload;
};

const deleteComment = async (commentId: string) => {
  return (await api.delete<Response<void>>(`${BASE_URL}/comments/${commentId}`)).data.payload;
};

const TaskService = { getMyTasks, getComments, addComment, updateComment, deleteComment };

export default TaskService;
