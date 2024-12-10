import api from './api';

import { GetAllUserDto, GetProjectByIdDto } from '@/types/project';
import Response from '@/types/response';
import Task, { CreateTaskRequestDto } from '@/types/task';

const BASE_URL = '/project';

const getProjectById = async (id: string) => {
  return (await api.get<Response<GetProjectByIdDto>>(`${BASE_URL}/${id}/get`)).data.payload;
};

const getAllTasksByProjectId = async (id: string) => {
  return (await api.get<Response<Task[]>>(`${BASE_URL}/${id}/tasks`)).data.payload;
};

const getAllUsers = async (projectId: string, search?: string) => {
  return (await api.get<Response<GetAllUserDto>>(`${BASE_URL}/${projectId}/members?${search ? `q=${search}` : ''}`))
    .data.payload;
};

const createTask = async (projectId: string, payload: CreateTaskRequestDto) => {
  return (await api.post<Response<Task>>(`${BASE_URL}/${projectId}/createTask`, payload)).data.payload;
};

const addMembers = async (projectId: string, memberEmails: string[]) => {
  return (await api.post<Response<void>>(`${BASE_URL}/${projectId}/addMembers`, { memberEmails })).data.payload;
};

const deleteMembers = async (projectId: string, memberIds: string[]) => {
  return (await api.put<Response<void>>(`${BASE_URL}/${projectId}/members`, { memberIds })).data.payload;
};

const addProject = async (payload: { name: string; key: string; description?: string }) => {
  return (await api.post<Response<void>>(`${BASE_URL}/new`, payload)).data.payload;
};

const ProjectService = {
  addProject,
  getProjectById,
  getAllTasksByProjectId,
  getAllUsers,
  createTask,
  addMembers,
  deleteMembers,
};

export default ProjectService;
