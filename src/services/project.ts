import api from './api';

import Project from '@/types/project';
import Response from '@/types/response';
import Task, { CreateTaskRequestDto } from '@/types/task';
import User from '@/types/user';

const BASE_URL = '/project';

const getProjectById = async (id: string) => {
  return (await api.get<Response<Project>>(`${BASE_URL}/${id}/get`)).data.payload;
};

const getAllTasksByProjectId = async (id: string) => {
  return (await api.get<Response<Task[]>>(`${BASE_URL}/${id}/tasks`)).data.payload;
};

const getAllUsers = async (projectId: string, search?: string) => {
  return (await api.get<Response<User[]>>(`${BASE_URL}/${projectId}/members?${search ? `q=${search}` : ''}`)).data
    .payload;
};

const createTask = async (projectId: string, payload: CreateTaskRequestDto) => {
  return (await api.post<Response<Task>>(`${BASE_URL}/${projectId}/createTask`, payload)).data.payload;
};

const ProjectService = {
  getProjectById,
  getAllTasksByProjectId,
  getAllUsers,
  createTask,
};

export default ProjectService;
